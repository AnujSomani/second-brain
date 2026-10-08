import { assertSafeToFetch, safeFetch } from "./urlsafety.js";

export type ExtractionStrategy = "article" | "tweet" | "video" | "document";

const VIDEO_URL_PATTERN =
  /youtube\.com|youtu\.be|vimeo\.com|facebook\.com\/(watch|.+videos)|instagram\.com\/(reel|p|share)\/|tiktok\.com/i;

const TWEET_URL_PATTERN = /^https?:\/\/(www\.)?(twitter|x)\.com\/.+\/status\/\d+/i;

export async function detectExtractionStrategy(url: string): Promise<ExtractionStrategy> {
  await assertSafeToFetch(url);

  if (VIDEO_URL_PATTERN.test(url)) return "video";
  if (TWEET_URL_PATTERN.test(url)) return "tweet";

  try {
    const { response } = await safeFetch(url, {
      method: "HEAD",
      timeoutMs: 5000,
    });
    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("pdf")) return "document";
  } catch {
    // some servers reject HEAD requests — fall through to the default below
  }

  return "article";
}
