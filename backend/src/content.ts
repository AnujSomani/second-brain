import { Router } from "express";
import { middleware } from "./middlewares/user.js";
import type { Request, Response } from "express";
import { prisma } from "./prisma.js";
import { contentSchema, shareBrainSchema } from "./validation.js";
import { hash, parsePagination, formatPaginatedResponse } from "./utils.js";
import { ingestContent } from "./ai/ingest.js";
const contentrouter = Router();


contentrouter.get("/api/v1/content", middleware, async (req: Request, res: Response) => {
     const userId = req.userId!;
     const { page, limit, skip } = parsePagination(req.query);

     try {
          const [content, total] = await Promise.all([
               prisma.content.findMany({
                    where: { userId },
                    select: {
                         id: true,
                         title: true,
                         link: true,
                         type: true,
                         createdAt: true,
                         thumbnailUrl: true,
                         description: true,
                         extractedText: true,
                         embedHtml: true,
                         favicon: true,
                         siteName: true,
                         author: true,
                         publishedDate: true,
                         providerName: true,
                         metadata: true,
                         status: true,
                         tags: {
                              select: {
                                   id: true,
                                   title: true,
                              },
                         },
                    },
                    orderBy: { createdAt: "desc" },
                    skip,
                    take: limit,
               }),
               prisma.content.count({ where: { userId } }),
          ]);

          return res.status(200).json(formatPaginatedResponse(content, total, page, limit));
     } catch (e) {
          console.error("❌ Error in GET /api/v1/content:", e);
          return res.status(500).json({ message: "Internal server error" });
     }
});

contentrouter.post("/api/v1/content", middleware, async (req: Request, res: Response) => {

     const parsedData = contentSchema.safeParse(req.body);
     if (!parsedData.success) {
          return res.status(411).json({ message: "Invalid Input" });
     }
     const { title, link, type, tags } = parsedData.data;
     try {
          const content = await prisma.content.create({
               data: {
                    title,
                    link,
                    type,
                    userId: req.userId!,
                    tags: {
                         connectOrCreate: tags.map((tag: string) => ({
                              where: { title: tag },
                              create: { title: tag },
                         }))
                    }
               },
               include: { tags: true },
          })
          ingestContent(content.id).catch((err) => {
               console.error(`Ingestion failed for content ${content.id}:`, err);
          });

          return res.status(201).json({ message: "content created", content });
     } catch (e) {
          return res.status(500).json({ message: "Internal server error" });
     }
});

contentrouter.delete("/api/v1/content", middleware, async (req: Request, res: Response) => {

     const contentId = Number(req.body.contentId);
     if (!req.body.contentId || isNaN(contentId)) {
          return res.status(400).json({ message: "Invalid or missing content ID" });
     }

     try {
          const content = await prisma.content.findUnique({
               where: { id: contentId },
          });
          if (!content) {
               return res.status(404).json({ message: "Content not found" });
          }
          if (content.userId !== req.userId) {
               return res.status(403).json({ message: "Not your content" });
          }
          await prisma.content.delete({ where: { id: contentId } });

          return res.status(200).json({ message: "content deleted successfully" });
     } catch (e) {
          return res.status(500).json({ message: "Internal server error" });
     }
});

contentrouter.get("/api/v1/brain/share/status", middleware, async (req: Request, res: Response) => {
     try {
          const link = await prisma.link.findUnique({
               where: { userId: req.userId! },
          });

          if (link) {
               return res.status(200).json({
                    isShared: true,
                    shareLink: `/shared/${link.hash}`,
               });
          } else {
               return res.status(200).json({
                    isShared: false,
                    shareLink: null,
               });
          }
     } catch (e) {
          return res.status(500).json({ message: "Internal server error" });
     }
});

contentrouter.post("/api/v1/brain/share", middleware, async (req: Request, res: Response) => {
     const parsedData = shareBrainSchema.safeParse(req.body);
     if (!parsedData.success) {
          return res.status(400).json({ message: "Invalid Input" });
     }

     const { share } = parsedData.data;

     if (share) {
          const link = await prisma.link.upsert({
               where: { userId: req.userId! },
               update: {},
               create: { hash: hash(), userId: req.userId! },
          });


          return res.status(200).json({
               shareLink: `/shared/${link.hash}`,
          });

     } else {
          await prisma.link.deleteMany({
               where: { userId: req.userId! },
          });

          return res.status(200).json({ message: "Sharing disabled" });
     }
})

contentrouter.get("/api/v1/brain/:shareLink", async (req: Request, res: Response) => {

     const { shareLink } = req.params;

     try {
          const link = await prisma.link.findUnique({
               where: { hash: shareLink as string },
               include: {
                    user: {
                         select: {
                              username: true,
                              contents: {
                                   include: { tags: true }
                              }
                         }
                    }
               }
          });

          if (!link) {
               return res.status(404).json({ message: "Share link not found or disabled" });
          }

          return res.status(200).json({
               username: link.user.username,
               content: link.user.contents,
          });

     } catch (e) {
          return res.status(500).json({ message: "Internal server error" });
     }
})

export default contentrouter;