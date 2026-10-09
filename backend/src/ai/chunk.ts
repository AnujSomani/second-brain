export interface TextChunk {
  text: string;
  order: number;
}
const CHUNK_SIZE = 1000; 
const CHUNK_OVERLAP = 100; 
const MIN_CHUNK_LENGTH = 40; 
export function chunkText(text: string): TextChunk[] {
  const cleaned = text.trim();
  if (cleaned.length === 0) return [];
  const paragraphs = cleaned
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const rawChunks: string[] = [];
  let current = "";
  for (const paragraph of paragraphs) {
    const candidate = current ? `${current}\n\n${paragraph}` : paragraph;
    if (candidate.length > CHUNK_SIZE && current.length > 0) {
      rawChunks.push(current);
      const overlapText = current.slice(-CHUNK_OVERLAP);
      current = `${overlapText}\n\n${paragraph}`;
    } else {
      current = candidate;
    }
  }
  if (current.trim().length > 0) {
    rawChunks.push(current);
  }
  const finalChunks: string[] = [];
  for (const chunk of rawChunks) {
    if (chunk.length <= CHUNK_SIZE * 1.5) {
      finalChunks.push(chunk.trim());
      continue;
    }
    let remaining = chunk;
    while (remaining.length > 0) {
      finalChunks.push(remaining.slice(0, CHUNK_SIZE).trim());
      remaining = remaining.slice(CHUNK_SIZE - CHUNK_OVERLAP);
    }
  }
  const filtered = finalChunks
    .map((t) => t.trim())
    .filter((t) => t.length >= MIN_CHUNK_LENGTH);
  if (filtered.length === 0 && cleaned.length > 0) {
    return [{ text: cleaned, order: 0 }];
  }
  return filtered.map((text, order) => ({ text, order }));
}