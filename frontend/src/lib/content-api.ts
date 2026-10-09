import api from "./api";
import type { BrainContent, ContentCategory } from "../types/brain";


interface BackendTag {
  id: number;
  title: string;
}

interface BackendContent {
  id: number;
  title: string;
  link: string;
  type: ContentCategory;
  userId: number;
  createdAt: string;
  tags: BackendTag[];
  thumbnailUrl?: string | null;
  description?: string | null;
  extractedText?: string | null;
  embedHtml?: string | null;
  favicon?: string | null;
  siteName?: string | null;
  author?: string | null;
  publishedDate?: string | null;
  providerName?: string | null;
  metadata?: any;
  status?: string;
}

interface PaginatedResponse {
  content?: BackendContent[];
  data?: BackendContent[];
  pagination?: { total: number; page: number; limit: number; totalPages: number };
  meta?: { total: number; page: number; limit: number; totalPages: number };
}

interface CreateContentResponse {
  message: string;
  content: BackendContent;
}

interface ShareResponse {
  shareLink?: string;
  message?: string;
}

interface ShareStatusResponse {
  isShared: boolean;
  shareLink: string | null;
}

interface SharedBrainResponse {
  username: string;
  content: BackendContent[];
}


function mapContent(c: BackendContent): BrainContent {
  return {
    id: String(c.id),
    title: c.title,
    link: c.link,
    category: c.type,
    tags: Array.isArray(c.tags) ? c.tags.map((t) => t.title) : [],
    addedDate: c.createdAt,
    preview: c.description || c.extractedText?.slice(0, 200) || "",
    thumbnailUrl: c.thumbnailUrl,
    description: c.description,
    embedHtml: c.embedHtml,
    favicon: c.favicon,
    siteName: c.siteName,
    author: c.author,
    publishedDate: c.publishedDate,
    providerName: c.providerName,
    metadata: c.metadata,
    status: c.status,
  };
}


export async function fetchContents(page = 1, limit = 50): Promise<{ contents: BrainContent[]; total: number }> {
  const { data } = await api.get<PaginatedResponse>("/api/v1/content", { params: { page, limit } });
  const items = Array.isArray(data.content) ? data.content : Array.isArray(data.data) ? data.data : [];
  const total = data.pagination?.total ?? data.meta?.total ?? items.length;

  return {
    contents: items.map(mapContent),
    total,
  };
}

export async function addContent(input: {
  title: string;
  link: string;
  type: ContentCategory;
  tags: string[];
}): Promise<BrainContent> {
  const { data } = await api.post<CreateContentResponse>("/api/v1/content", input);
  return mapContent(data.content);
}

export async function deleteContent(contentId: string): Promise<void> {
  await api.delete("/api/v1/content", { data: { contentId: Number(contentId) } });
}

export async function getShareStatus(): Promise<ShareStatusResponse> {
  const { data } = await api.get<ShareStatusResponse>("/api/v1/brain/share/status");
  if (data.shareLink) {
    return {
      isShared: data.isShared,
      shareLink: `${window.location.origin}${data.shareLink}`,
    };
  }
  return data;
}

export async function shareBrain(share: boolean): Promise<string | null> {
  const { data } = await api.post<ShareResponse>("/api/v1/brain/share", { share });
  if (data.shareLink) {
    return `${window.location.origin}${data.shareLink}`;
  }
  return null;
}

export async function fetchSharedBrain(hash: string): Promise<SharedBrainResponse> {
  const { data } = await api.get<SharedBrainResponse>(`/api/v1/brain/${hash}`);
  return data;
}