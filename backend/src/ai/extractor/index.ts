import { extractArticle } from "./article.js";
import { extractTweet } from "./tweet.js";
import { extractVideo } from "./video.js";
import { extractDocument } from "./document.js";
import type { ExtractionStrategy } from "../detectExtractionStrategy.js";
import type { ExtractionResult } from "./types.js";
export type { ExtractionResult };
export async function extractContent(
  url: string,
  strategy: ExtractionStrategy
): Promise<ExtractionResult> {
  switch (strategy) {
    case "article":
      return extractArticle(url);
    case "tweet":
      return extractTweet(url);
    case "video":
      return extractVideo(url);
    case "document":
      return extractDocument(url);
  }
}