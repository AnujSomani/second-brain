import crypto from "node:crypto";

export function hash(): string {
  return crypto.randomBytes(16).toString("hex");
}

export function parsePagination(query: Record<string, unknown>) {
  const page = Math.max(1, Number(query["page"]) || 1);
  const limit = Math.min(100, Math.max(1, Number(query["limit"]) || 20));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function formatPaginatedResponse<T>(content: T[], total: number, page: number, limit: number) {
  return {
    content,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}