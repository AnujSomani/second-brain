import { prisma } from "../prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import { detectExtractionStrategy } from "./detectExtractionStrategy.js";
import { extractContent } from "./extractor/index.js";
import { extractEnhancedMetadata } from "./extractor/enhancedMetadata.js";
import { chunkText } from "./chunk.js";
import { embedChunks } from "./embedding.js";

export async function ingestContent(contentId: number): Promise<void> {
  const content = await prisma.content.findUnique({
    where: { id: contentId },
    include: { tags: true },
  });
  if (!content) return; // deleted before this job ran — nothing to do

  await prisma.content.update({
    where: { id: contentId },
    data: { status: "processing" },
  });

  let strategy: Awaited<ReturnType<typeof detectExtractionStrategy>> = "article";
  let extracted;
  let metadata: Awaited<ReturnType<typeof extractEnhancedMetadata>> | null = null;

  try {
    // IMPORTANT: Always extract enhanced metadata from URL
    // This includes oEmbed, JSON-LD, Open Graph, and comprehensive fallbacks
    try {
      metadata = await extractEnhancedMetadata(content.link);
    } catch (metaError) {
      // Silent fallback - no need to warn user about scraping issues
      metadata = {
        title: content.title,
        description: null,
        thumbnailUrl: null,
        favicon: null,
        siteName: null,
        author: null,
        publishedDate: null,
        embedHtml: null,
        providerName: null,
        metadata: null,
      };
    }
    
    strategy = await detectExtractionStrategy(content.link);
    extracted = await extractContent(content.link, strategy);
  } catch (error) {
    // Silent fallback - content remains searchable with user metadata
    // Keep text simple and professional - no technical details
    extracted = {
      title: content.title,
      text: `${content.title}\n\n${content.link}`,
    };
  }

  try {
    // Enrich text with tags so short/visual posts (like an Instagram photo with few words) are easily searchable by tags
    let textToChunk = extracted.text;
    if (content.tags && content.tags.length > 0) {
      const tagList = content.tags.map((t) => t.title).join(", ");
      textToChunk = `Tags: ${tagList}\n\n${textToChunk}`;
    }

    const chunks = chunkText(textToChunk);
    if (chunks.length === 0) {
      throw new Error("No chunks produced from extracted text");
    }

    const vectors = await embedChunks(chunks.map((c) => c.text));

    await prisma.$transaction(async (tx) => {
      // Update content with extracted data AND enhanced metadata
      await tx.content.update({
        where: { id: contentId },
        data: {
          extractedText: extracted.text,
          thumbnailUrl: metadata?.thumbnailUrl || null,
          description: metadata?.description || null,
          embedHtml: metadata?.embedHtml || null,
          favicon: metadata?.favicon || null,
          siteName: metadata?.siteName || null,
          author: metadata?.author || null,
          publishedDate: metadata?.publishedDate || null,
          providerName: metadata?.providerName || null,
          metadata: (metadata?.metadata as Prisma.InputJsonValue) || Prisma.JsonNull,
        },
      });

      // Clear any previous chunks for this content to prevent stale duplicates
      await tx.chunk.deleteMany({
        where: { contentId },
      });

      // Batch insert all chunks in a single multi-row INSERT query
      const chunkInserts = chunks.map((chunk, i) => {
        const vector = vectors[i]!;
        const vectorLiteral = `[${vector.join(",")}]`;
        return Prisma.sql`(${chunk.text}, ${vectorLiteral}::vector, ${chunk.order}, ${contentId})`;
      });

      await tx.$executeRaw`
        INSERT INTO "Chunk" ("text", "embedding", "order", "contentId")
        VALUES ${Prisma.join(chunkInserts)}
      `;

      await tx.content.update({
        where: { id: contentId },
        data: { status: "ready" },
      });
    });
  } catch (error) {
    console.error(`Chunking or embedding failed for content ${contentId}:`, error);
    await prisma.content.update({
      where: { id: contentId },
      data: { status: "failed" },
    });
  }
}

/**
 * Recovers jobs that were left in 'processing' status if the server crashed or restarted.
 * Re-runs ingestion for each interrupted content item so they become searchable without manual intervention.
 */
export async function recoverStuckIngestions(): Promise<void> {
  try {
    const interruptedItems = await prisma.content.findMany({
      where: { status: "processing" },
      select: { id: true, title: true },
    });

    if (interruptedItems.length === 0) return;

    console.log(`[Recovery] Found ${interruptedItems.length} interrupted ingestion(s). Resuming...`);

    for (const item of interruptedItems) {
      try {
        console.log(`[Recovery] Resuming ingestion for content ID ${item.id} ("${item.title}")`);
        await ingestContent(item.id);
      } catch (err) {
        console.error(`[Recovery] Failed to recover content ID ${item.id}:`, err);
        await prisma.content.update({
          where: { id: item.id },
          data: { status: "failed" },
        }).catch(() => {});
      }
    }
  } catch (err) {
    console.error("[Recovery] Error running recovery routine:", err);
  }
}