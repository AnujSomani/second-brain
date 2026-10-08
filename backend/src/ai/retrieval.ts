import { prisma } from "../prisma.js";
import { embedQuery } from "./embedding.js";

export interface RetrievedChunk {
  chunkId: number;
  contentId: number;
  text: string;
  title: string;
  link: string;
  thumbnailUrl: string | null;
  type: string;
  distance: number;
}

const TOP_K = 5;
const SIMILARITY_THRESHOLD = 0.5; // cosine distance — lower = more similar; 0 = identical, 1 = unrelated

/**
 * Enhances user queries with related keywords for better semantic matching
 */
function enhanceQuery(question: string): string {
  const lower = question.toLowerCase();
  
  // Job/Career queries
  if (/\b(job|jobs|hiring|hirings|career|opportunity|opportunities|position|opening|openings|recruitment|employ|work)\b/i.test(lower)) {
    return `${question} job opening hiring career opportunity position recruitment employment work application intern full-time part-time`;
  }
  
  // Article/Blog queries
  if (/\b(article|articles|blog|blogs|post|posts|read|reading)\b/i.test(lower)) {
    return `${question} article blog post story publication essay writing content`;
  }
  
  // Video queries
  if (/\b(video|videos|watch|tutorial|course|lesson)\b/i.test(lower)) {
    return `${question} video tutorial course lesson youtube vimeo watch`;
  }
  
  // Tweet/Social queries
  if (/\b(tweet|tweets|twitter|social|post)\b/i.test(lower)) {
    return `${question} tweet twitter social media post opinion thread`;
  }
  
  // Document queries
  if (/\b(document|documents|pdf|paper|research)\b/i.test(lower)) {
    return `${question} document pdf paper report research whitepaper`;
  }
  
  // Learning/Tutorial queries
  if (/\b(learn|learning|how to|tutorial|guide|teach)\b/i.test(lower)) {
    return `${question} learn learning tutorial guide howto teach education training course`;
  }
  
  // Tech/Programming queries
  if (/\b(code|coding|programming|developer|software|tech|technology|ai|ml|data)\b/i.test(lower)) {
    return `${question} programming coding development software engineering technology computer science`;
  }
  
  // No specific category - return original
  return question;
}

export async function retrieveRelevantChunks(
  userId: number,
  question: string
): Promise<RetrievedChunk[]> {
  // Enhance query for better semantic matching
  const enhancedQuestion = enhanceQuery(question);
  
  const queryVector = await embedQuery(enhancedQuestion);
  const vectorLiteral = `[${queryVector.join(",")}]`;

  const results = await prisma.$queryRaw<RetrievedChunk[]>`
    WITH query_vec AS (
      SELECT ${vectorLiteral}::vector AS q
    )
    SELECT
      c."id" AS "chunkId",
      c."contentId" AS "contentId",
      c."text" AS "text",
      content."title" AS "title",
      content."link" AS "link",
      content."thumbnailUrl" AS "thumbnailUrl",
      content."type" AS "type",
      (c."embedding" <=> query_vec.q) AS "distance"
    FROM "Chunk" c
    CROSS JOIN query_vec
    JOIN "Content" content ON content."id" = c."contentId"
    WHERE content."userId" = ${userId}
      AND content."status" = 'ready'
      AND c."embedding" IS NOT NULL
      AND (c."embedding" <=> query_vec.q) < ${SIMILARITY_THRESHOLD}
    ORDER BY "distance" ASC
    LIMIT ${TOP_K}
  `;

  return results;
}