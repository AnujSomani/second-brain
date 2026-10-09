import { JSDOM, VirtualConsole } from "jsdom";
import { Readability } from "@mozilla/readability";
import { safeFetch } from "../urlsafety.js";
import type { ExtractionResult } from "./types.js";
const MAX_TEXT_LENGTH = 50000;
export async function extractArticle(url: string): Promise<ExtractionResult> {
  const { response, buffer } = await safeFetch(url, {
    timeoutMs: 10000,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
  }
  const html = buffer.toString("utf8");
  const virtualConsole = new VirtualConsole();
  virtualConsole.on("error", () => {}); 
  const dom = new JSDOM(html, { url, virtualConsole });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();
  if (!article || !article.textContent || article.textContent.trim().length === 0) {
    throw new Error(
      "Could not extract readable content. The page may require JavaScript, a login, or is behind a paywall."
    );
  }
  return {
    title: article.title || "Untitled",
    text: article.textContent.trim().slice(0, MAX_TEXT_LENGTH),
  };
}