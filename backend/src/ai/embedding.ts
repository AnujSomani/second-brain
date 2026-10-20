import { GoogleGenAI } from "@google/genai";
import { config } from "../config.js";
const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });
const EMBEDDING_MODEL = "gemini-embedding-001";
const EMBEDDING_DIMENSIONS = 1536;

export async function embedChunks(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  
  try {
    const response = await ai.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: texts,
      config: {
        taskType: "RETRIEVAL_DOCUMENT",
        outputDimensionality: EMBEDDING_DIMENSIONS,
      },
    });
    
    if (!response.embeddings || response.embeddings.length !== texts.length) {
      throw new Error("Embedding response did not match the number of input chunks");
    }
    
    return response.embeddings.map((e) => {
      if (!e.values) throw new Error("Embedding response missing values");
      return e.values;
    });
  } catch (error: any) {
    console.error("Gemini embedding error:", error);
    
    if (error.message?.includes("quota") || error.message?.includes("RESOURCE_EXHAUSTED")) {
      throw new Error("EMBEDDING_QUOTA_EXCEEDED");
    }
    
    if (error.message?.includes("API key") || error.message?.includes("UNAUTHENTICATED")) {
      throw new Error("EMBEDDING_CONFIG_ERROR");
    }
    
    throw new Error("EMBEDDING_SERVICE_ERROR");
  }
}

export async function embedQuery(text: string): Promise<number[]> {
  try {
    const response = await ai.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: text,
      config: {
        taskType: "RETRIEVAL_QUERY",
        outputDimensionality: EMBEDDING_DIMENSIONS,
      },
    });
    
    const embedding = response.embeddings?.[0]?.values;
    if (!embedding) {
      throw new Error("Failed to generate embedding for query");
    }
    
    return embedding;
  } catch (error: any) {
    console.error("Gemini query embedding error:", error);
    
    if (error.message?.includes("quota") || error.message?.includes("RESOURCE_EXHAUSTED")) {
      throw new Error("EMBEDDING_QUOTA_EXCEEDED");
    }
    
    if (error.message?.includes("API key") || error.message?.includes("UNAUTHENTICATED")) {
      throw new Error("EMBEDDING_CONFIG_ERROR");
    }
    
    throw new Error("EMBEDDING_SERVICE_ERROR");
  }
}
