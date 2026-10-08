import api from "./api";

/* ─── Response types ─── */

export interface ChatSource {
  title: string;
  link: string;
}

export interface ChatResponse {
  answer: string;
  sources: ChatSource[];
}

/* ─── API call ─── */

export async function sendChatMessage(question: string): Promise<ChatResponse> {
  const { data } = await api.post<ChatResponse>("/api/v1/chat", { question });
  return data;
}
