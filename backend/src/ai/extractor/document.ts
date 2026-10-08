import { PDFParse } from "pdf-parse";
import { safeFetch } from "../urlsafety.js";
import type { ExtractionResult } from "./types.js";

const MAX_PAGES_TO_PARSE = 15;
const MAX_TEXT_LENGTH = 30000;

export async function extractDocument(url: string): Promise<ExtractionResult> {
  const { response, buffer } = await safeFetch(url, {
    timeoutMs: 15000,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  let urlPath = "";
  try {
    urlPath = new URL(url).pathname.toLowerCase();
  } catch {
    urlPath = url.toLowerCase();
  }

  if (!contentType.includes("pdf") && !urlPath.endsWith(".pdf")) {
    throw new Error("This link does not appear to be a PDF");
  }

  const parser = new PDFParse({ data: buffer });
  try {
    // Only parse the first 15 pages to keep extraction fast and prevent memory overload on 500-1000 page PDFs
    const [textResult, infoResult] = await Promise.all([
      parser.getText({ first: MAX_PAGES_TO_PARSE, pageJoiner: "\n\n" }),
      parser.getInfo().catch(() => null),
    ]);

    const rawText = textResult.text ?? "";
    // Remove default page separators (e.g. "-- 1 of 5 --")
    const meaningfulText = rawText.replace(/--\s*\d+\s*of\s*\d+\s*--/gi, "").trim();

    if (!meaningfulText || meaningfulText.length === 0) {
      throw new Error(
        "Could not extract text from this PDF — it may be scanned images with no embedded text"
      );
    }

    const titleFromInfo = typeof infoResult?.info?.["Title"] === "string" ? infoResult.info["Title"].trim() : "";
    const totalPages = textResult.total || 1;
    const title = titleFromInfo || `Document (${totalPages} pages)`;

    const isCapped = totalPages > MAX_PAGES_TO_PARSE;
    const documentHeader = [
      `Document: ${title}`,
      `Total Pages: ${totalPages}`,
      isCapped ? `Note: Showing summary & content from the first ${MAX_PAGES_TO_PARSE} pages.` : "",
      `Link: ${url}`,
      "\n",
    ].filter(Boolean).join("\n");

    return {
      title,
      text: `${documentHeader}${meaningfulText}`.slice(0, MAX_TEXT_LENGTH),
    };
  } finally {
    await parser.destroy().catch(() => {});
  }
}