import { JSDOM, VirtualConsole } from "jsdom";
import { safeFetch } from "../urlsafety.js";

export interface PageMetadata {
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  siteName: string | null;
  embedHtml?: string | null;  // For Twitter/oEmbed widgets
}

/**
 * Universal metadata extractor using Open Graph protocol.
 * Works for ANY URL - Instagram, LinkedIn, Notion, job sites, blogs, etc.
 * Backend validates URL and extracts metadata regardless of user-provided type.
 * 
 * Note: Some sites (Twitter, Instagram, LinkedIn) block automated scraping.
 * For these, we return null metadata and let the frontend show platform logos.
 */
export async function extractMetadata(url: string): Promise<PageMetadata> {
  // Special handling for Twitter - use oEmbed instead of scraping
  if (/^https?:\/\/(www\.)?(twitter|x)\.com\/.+\/status\/\d+/i.test(url)) {
    try {
      const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}&omit_script=true`;
      const response = await fetch(oembedUrl);
      
      if (response.ok) {
        const data = await response.json();
        return {
          title: `Tweet by ${data.author_name || 'User'}`,
          description: null,
          thumbnailUrl: null,
          siteName: 'Twitter',
          embedHtml: data.html,  // Twitter's embed HTML
        };
      }
    } catch (err) {
      console.warn('Twitter oEmbed failed, falling back');
    }
  }

  try {
    const { response, buffer } = await safeFetch(url, {
      timeoutMs: 8000,
      headers: {
        // User agent that encourages sites to return Open Graph tags
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      },
    });

    // Handle 403 Forbidden - site blocks bots
    if (response.status === 403) {
      console.warn(`Site blocks scraping (403): ${url}`);
      return {
        title: new URL(url).hostname,
        description: "This site blocks automated access. Content saved for search.",
        thumbnailUrl: null,
        siteName: null,
      };
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.status}`);
    }

    const html = buffer.toString("utf8");
    const virtualConsole = new VirtualConsole();
    virtualConsole.on("error", () => {}); // Suppress CSS parsing errors

    const dom = new JSDOM(html, { url, virtualConsole });
    const doc = dom.window.document;

    // Helper to get meta tag content
    const getMeta = (property: string, fallbackName?: string): string | null => {
      // Try Open Graph property first
      let content =
        doc.querySelector(`meta[property="${property}"]`)?.getAttribute("content") ||
        doc.querySelector(`meta[property="og:${property}"]`)?.getAttribute("content");

      // Try Twitter card
      if (!content) {
        content = doc.querySelector(`meta[name="twitter:${property}"]`)?.getAttribute("content");
      }

      // Try standard meta name
      if (!content && fallbackName) {
        content = doc.querySelector(`meta[name="${fallbackName}"]`)?.getAttribute("content");
      }

      return content?.trim() || null;
    };

    // Extract Open Graph / meta tags
    const ogTitle = getMeta("og:title", "title");
    const ogDescription = getMeta("og:description", "description");
    const ogImage = getMeta("og:image", "image") || getMeta("image");
    const ogSiteName = getMeta("og:site_name");

    // Fallback to HTML title if no Open Graph
    const htmlTitle = doc.querySelector("title")?.textContent?.trim();
    const title = ogTitle || htmlTitle || "Untitled";

    // Clean and truncate description
    let description = ogDescription;
    if (description && description.length > 300) {
      description = description.slice(0, 297) + "...";
    }

    // Resolve relative image URLs to absolute
    let thumbnailUrl = ogImage;
    if (thumbnailUrl && !thumbnailUrl.startsWith("http")) {
      try {
        const baseUrl = new URL(url);
        thumbnailUrl = new URL(thumbnailUrl, baseUrl.origin).href;
      } catch {
        thumbnailUrl = null; // Invalid URL, skip it
      }
    }

    return {
      title,
      description,
      thumbnailUrl,
      siteName: ogSiteName,
    };
  } catch (error) {
    console.warn(`Metadata extraction failed for ${url}:`, error);
    // Return minimal fallback metadata
    return {
      title: "Saved Link",
      description: null,
      thumbnailUrl: null,
      siteName: null,
    };
  }
}
