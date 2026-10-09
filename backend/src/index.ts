import "dotenv/config";
import express from "express";
import authRouter from "./auth.js";
import contentrouter from "./content.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "./config.js";
import chatRouter from "./ai/chat.js";
import oauthRouter from "./oauth.js";
import { recoverStuckIngestions } from "./ai/ingest.js";
const app = express();
app.use(cors({
  origin: config.frontendUrl ?? "*",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.disable('x-powered-by');
app.use(authRouter);
app.use(contentrouter);
app.use(chatRouter);
app.use(oauthRouter);
const port = Number(config.port) || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  recoverStuckIngestions().catch((err) => {
    console.error("Startup ingestion recovery error:", err);
  });
});