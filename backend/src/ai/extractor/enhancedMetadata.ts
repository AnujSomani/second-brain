import { JSDOM, VirtualConsole } from "jsdom";
import { safeFetch, assertSafeToFetch } from "../urlsafety.js";

export interface EnhancedPageMetadata {
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  favicon: string | null;
  siteName: string | null;
  author: string | null;
  publishedDate: Date | null;
  providerName: string | null;
  metadata: Record<string, any> | null;
}

export function detectProvider(url: string): string | null {
  const lower = url.toLowerCase();
  
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) return "youtube";
  if (lower.includes("twitter.com") || lower.includes("x.com")) return "twitter";
  if (lower.includes("linkedin.com")) {
    if (lower.includes("/jobs/")) return "linkedin-job";
    if (lower.includes("/posts/")) return "linkedin-post";
    return "linkedin";
  }
  if (lower.includes("github.com")) return "github";
  if (lower.includes("notion.so") || lower.includes("notion.site")) return "notion";
  if (lower.includes("medium.com")) return "medium";
  if (lower.includes("dev.to")) return "devto";
  if (lower.includes("stackoverflow.com")) return "stackoverflow";
  if (lower.includes("reddit.com")) return "reddit";
  if (lower.includes("instagram.com")) return "instagram";
  if (lower.includes("facebook.com")) return "facebook";
  if (lower.includes("tiktok.com")) return "tiktok";
  
  return null;
}

function extractFavicon(doc: Document, baseUrl: string): string | null {
  const selectors = [
    'link[rel="icon"]',
    'link[rel="shortcut icon"]',
    'link[rel="apple-touch-icon"]',
    'link[rel="apple-touch-icon-precomposed"]',
  ];

  for (const selector of selectors) {
    const link = doc.querySelector(selector);
    const href = link?.getAttribute("href");
    if (href) {
      try {
        return new URL(href, baseUrl).href;
      } catch {
        continue;
      }
    }
  }
  try {
    const url = new URL(baseUrl);
    return `${url.protocol}//${url.host}/favicon.ico`;
  } catch {
    return null;
  }
}

function extractJsonLd(doc: Document): Record<string, any> | null {
  const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
  
  for (const script of Array.from(scripts)) {
    try {
      const content = script.textContent?.trim();
      if (content) {
        const data = JSON.parse(content);
        if (Array.isArray(data)) {
          return data[0] || null;
        }
        return data;
      }
    } catch {
      continue;
    }
  }
  
  return null;
}

function extractPublishedDate(
  ogPublished: string | null,
  jsonLd: Record<string, any> | null
): Date | null {
  if (ogPublished) {
    const date = new Date(ogPublished);
    if (!isNaN(date.getTime())) return date;
  }
  if (jsonLd) {
    const dateFields = ["datePublished", "dateCreated", "uploadDate", "releaseDate"];
    for (const field of dateFields) {
      if (jsonLd[field]) {
        const date = new Date(jsonLd[field]);
        if (!isNaN(date.getTime())) return date;
      }
    }
  }

  return null;
}

function extractAuthor(
  ogAuthor: string | null,
  jsonLd: Record<string, any> | null
): string | null {
  if (ogAuthor) return ogAuthor;

  if (jsonLd?.author) {
    if (typeof jsonLd.author === "string") return jsonLd.author;
    if (jsonLd.author.name) return jsonLd.author.name;
  }

  if (jsonLd?.creator) {
    if (typeof jsonLd.creator === "string") return jsonLd.creator;
    if (jsonLd.creator.name) return jsonLd.creator.name;
  }

  return null;
}

export async function extractEnhancedMetadata(url: string): Promise<EnhancedPageMetadata> {
  await assertSafeToFetch(url);
  const provider = detectProvider(url);
  try {
    const { response, buffer } = await safeFetch(url, {
      timeoutMs: 8000,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      },
    });

    if (response.status === 403 || !response.ok) {
      return createFallbackMetadata(url, provider);
    }

    const html = buffer.toString("utf8");
    const virtualConsole = new VirtualConsole();
    virtualConsole.on("error", () => {});

    const dom = new JSDOM(html, { url, virtualConsole });
    const doc = dom.window.document;

    const jsonLd = extractJsonLd(doc);

    const getMeta = (property: string, fallbackName?: string): string | null => {
      let content =
        doc.querySelector(`meta[property="${property}"]`)?.getAttribute("content") ||
        doc.querySelector(`meta[property="og:${property}"]`)?.getAttribute("content");

      if (!content) {
        content = doc.querySelector(`meta[name="twitter:${property}"]`)?.getAttribute("content");
      }

      if (!content && fallbackName) {
        content = doc.querySelector(`meta[name="${fallbackName}"]`)?.getAttribute("content");
      }

      return content?.trim() || null;
    };

    const ogTitle = getMeta("og:title", "title") || jsonLd?.headline || jsonLd?.name;
    const ogDescription = getMeta("og:description", "description") || jsonLd?.description;
    const ogImage = getMeta("og:image", "image") || getMeta("image") || jsonLd?.image?.url || jsonLd?.image;
    const ogSiteName = getMeta("og:site_name") || jsonLd?.publisher?.name;
    const ogAuthor = getMeta("article:author", "author");
    const ogPublished = getMeta("article:published_time");

    const htmlTitle = doc.querySelector("title")?.textContent?.trim();
    const title = ogTitle || htmlTitle || "Untitled";

    let description = ogDescription;
    if (description && description.length > 300) {
      description = description.slice(0, 297) + "...";
    }

    let thumbnailUrl = ogImage;
    if (thumbnailUrl && !thumbnailUrl.startsWith("http")) {
      try {
        const baseUrl = new URL(url);
        thumbnailUrl = new URL(thumbnailUrl, baseUrl.origin).href;
      } catch {
        thumbnailUrl = null;
      }
    }
    const favicon = extractFavicon(doc, url);

    const publishedDate = extractPublishedDate(ogPublished, jsonLd);
    const author = extractAuthor(ogAuthor, jsonLd);

    let processedMetadata: Record<string, any> | null = null;
    if (jsonLd) {
      const type = jsonLd["@type"];
      
      if (type === "JobPosting") {
        processedMetadata = {
          type: "job",
          jobTitle: jsonLd.title || jsonLd.name,
          company: jsonLd.hiringOrganization?.name,
          location: jsonLd.jobLocation?.address?.addressLocality || jsonLd.jobLocation?.address,
          salary: jsonLd.baseSalary?.value || jsonLd.baseSalary,
          employmentType: jsonLd.employmentType,
          datePosted: jsonLd.datePosted,
        };
      }
      else if (type === "SoftwareSourceCode" || provider === "github") {
        processedMetadata = {
          type: "repository",
          language: jsonLd.programmingLanguage,
          stars: jsonLd.interactionStatistic?.userInteractionCount,
        };
      }
      else if (type === "Article" || type === "BlogPosting" || type === "NewsArticle") {
        processedMetadata = {
          type: "article",
          wordCount: jsonLd.wordCount,
          keywords: jsonLd.keywords,
        };
      }
    }

    return {
      title,
      description,
      thumbnailUrl,
      favicon,
      siteName: ogSiteName,
      author,
      publishedDate,
      providerName: provider,
      metadata: processedMetadata,
    };
  } catch (error) {
    return createFallbackMetadata(url, provider);
  }
}

function createFallbackMetadata(url: string, provider: string | null): EnhancedPageMetadata {
  let title = "Saved Link";
  let siteName: string | null = null;

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace(/^www\./, "");
    
    const providerNames: Record<string, string> = {
      notion: "Notion",
      "linkedin": "LinkedIn",
      "linkedin-job": "LinkedIn",
      "linkedin-post": "LinkedIn",
      instagram: "Instagram",
      facebook: "Facebook",
      tiktok: "TikTok",
      github: "GitHub",
      medium: "Medium",
      reddit: "Reddit",
    };

    if (provider && providerNames[provider]) {
      siteName = providerNames[provider];
      title = `${providerNames[provider]} Link`;
    } else {
      siteName = hostname.split('.')[0]?.toUpperCase() || hostname;
      title = hostname;
    }
  } catch {
    title = "Saved Link";
  }

  return {
    title,
    description: null, 
    thumbnailUrl: null,
    favicon: null,
    siteName,
    author: null,
    publishedDate: null,
    providerName: provider,
    metadata: null,
  };
}
