import { Router } from "express";
import type { Request, Response } from "express";
import { middleware } from "../middlewares/user.js";
import { retrieveRelevantChunks } from "./retrieval.js";
import { generateAnswer } from "./llm.js";
import { chatSchema } from "../validation.js";
import { rateLimit, ipKeyGenerator } from "express-rate-limit";
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  keyGenerator: (req) => {
    const ip = req.ip ?? "unknown";
    return String((req as Request).userId ?? ipKeyGenerator(ip));
  },
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many messages, please slow down" },
});
const chatRouter = Router();
chatRouter.post("/api/v1/chat", middleware, chatLimiter, async (req: Request, res: Response) => {
  const parsedData = chatSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(411).json({ message: "Invalid Input" });
  }
  const { question } = parsedData.data;
  const userId = req.userId!;
  try {
    const chunks = await retrieveRelevantChunks(userId, question);
    const answer = await generateAnswer(question, chunks);
    const seenContentIds = new Set<number>();
    const sources = chunks
      .filter((c, i) => {
        const cited = answer.includes(`[${i + 1}]`);
        if (!cited || seenContentIds.has(c.contentId)) return false;
        seenContentIds.add(c.contentId);
        return true;
      })
      .map((c) => ({
        title: c.title,
        link: c.link,
        thumbnailUrl: c.thumbnailUrl,
        type: c.type,
      }));
    return res.status(200).json({ answer, sources });
  } catch (e) {
    console.error("Chat error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
});
export default chatRouter;