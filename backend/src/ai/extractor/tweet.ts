import { JSDOM } from "jsdom";
import { assertSafeToFetch } from "../urlsafety.js";
import type { ExtractionResult } from "./types.js";

const TWEET_URL_PATTERN = /^https?:\/\/(www\.)?(twitter|x)\.com\/[^/]+\/status\/\d+/i;

export async function extractTweet(url: string): Promise<ExtractionResult> {
  await assertSafeToFetch(url);

  if (!TWEET_URL_PATTERN.test(url)) {
    throw new Error("This does not look like a valid tweet/X post URL");
  }

  const oembedUrl = `https://publish.x.com/oembed?url=${encodeURIComponent(url)}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  let data: { html: string; author_name: string };
  try {
    const response = await fetch(oembedUrl, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`Failed to fetch tweet: ${response.status}`);
    }

    data = await response.json();
  } finally {
    clearTimeout(timeout);
  }

  const dom = new JSDOM(data.html);
  const paragraphs = dom.window.document.querySelectorAll("blockquote p, p");
  let text = Array.from(paragraphs)
    .map((p) => p.textContent?.trim())
    .filter(Boolean)
    .join("\n\n");

  if (!text) {
    text = dom.window.document.body.textContent?.trim() || "";
  }

  if (!text) {
    throw new Error("Could not extract text from this tweet");
  }

  const fullText = [
    `Tweet / X post by ${data.author_name}`,
    `Link: ${url}`,
    text,
  ].filter(Boolean).join("\n\n");

  return {
    title: `Tweet by ${data.author_name}`,
    text: fullText,
  };
}