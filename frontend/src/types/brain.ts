export type ContentCategory = "article" | "document" | "tweet" | "video";
export type SidebarFilter = ContentCategory | "all" | "tags";

export interface BrainContent {
  id: string;
  title: string;
  link: string;
  category: ContentCategory;
  tags: string[];
  addedDate: string;
  preview: string;
  thumbnailUrl?: string | null;
  description?: string | null;
  embedHtml?: string | null;
  favicon?: string | null;
  siteName?: string | null;
  author?: string | null;
  publishedDate?: string | null;
  providerName?: string | null;
  metadata?: Record<string, any> | null;
  status?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: number;
  sources?: Array<{
    id: string;
    title: string;
    link: string;
    category: ContentCategory;
    thumbnailUrl?: string | null;
  }>;
}
