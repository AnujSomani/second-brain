import { assertSafeToFetch, safeFetch } from "../urlsafety.js";
import { JSDOM, VirtualConsole } from "jsdom";
import type { ExtractionResult } from "./types.js";

interface VideoProvider {
  name: string;
  pattern: RegExp;
  oembedUrl: (url: string) => string;
}

const PROVIDERS: VideoProvider[] = [
  {
    name: "YouTube",
    pattern: /^https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)/i,
    oembedUrl: (url) => `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
  },
  {
    name: "Vimeo",
    pattern: /^https?:\/\/(www\.)?vimeo\.com\/\d+/i,
    oembedUrl: (url) => `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`,
  },
];

async function extractViaOpenGraph(url: string): Promise<ExtractionResult> {
  const { response, buffer } = await safeFetch(url, {
    timeoutMs: 8000,
    headers: {
      "User-Agent": "facebookexternalhit/1.1 (+https://www.facebook.com/externalhit_uatext.php)",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load page preview: ${response.status}`);
  }

  const html = buffer.toString("utf8");
  const virtualConsole = new VirtualConsole();
  virtualConsole.on("error", () => {});
  const dom = new JSDOM(html, { virtualConsole });
  const doc = dom.window.document;

  const getMeta = (prop: string) =>
    doc.querySelector(`meta[property="${prop}"]`)?.getAttribute("content") ||
    doc.querySelector(`meta[name="${prop}"]`)?.getAttribute("content") ||
    "";

  const ogTitle = getMeta("og:title") || doc.title || "Social Post / Video";
  const ogDescription = getMeta("og:description") || getMeta("description");
  const siteName = getMeta("og:site_name") || (/instagram\.com/i.test(url) ? "Instagram" : /facebook\.com/i.test(url) ? "Facebook" : "Video");

  const lines = [
    `Platform: ${siteName}`,
    `Title: ${ogTitle}`,
    ogDescription ? `Description / Caption: ${ogDescription}` : "",
    `Link: ${url}`,
  ].filter(Boolean);

  return {
    title: ogTitle,
    text: lines.join("\n"),
  };
}

export async function extractVideo(url: string): Promise<ExtractionResult> {
  await assertSafeToFetch(url);

  // 1. YouTube & Vimeo via official public oEmbed
  const provider = PROVIDERS.find((p) => p.pattern.test(url));
  if (provider) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(provider.oembedUrl(url), { signal: controller.signal });
      if (response.ok) {
        const data = await response.json();
        const title = data.title || `${provider.name} Video`;
        const author = data.author_name || "Unknown Creator";

        return {
          title,
          text: [
            `Platform: ${provider.name}`,
            `Channel / Creator: ${author}`,
            `Title: ${title}`,
            `Link: ${url}`,
          ].join("\n"),
        };
      }
    } catch {
      // Fall through to Open Graph scraping if oEmbed encounters network issues
    } finally {
      clearTimeout(timeout);
    }
  }

  // 2. Instagram, Facebook, and other social links via Open Graph metadata
  try {
    return await extractViaOpenGraph(url);
  } catch {
    // 3. Fallback: derive minimal platform metadata from URL so content is still indexed
    let platform = "Video";
    if (/instagram\.com/i.test(url)) platform = "Instagram";
    if (/facebook\.com/i.test(url)) platform = "Facebook";

    return {
      title: `${platform} Link`,
      text: `Platform: ${platform}\nLink: ${url}\nSaved link without preview text.`,
    };
  }
}