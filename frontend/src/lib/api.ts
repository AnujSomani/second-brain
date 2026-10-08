import axios from "axios";

/**
 * Central axios instance — all API requests flow through here.
 * The Vite dev-server proxy forwards `/api` → `http://localhost:3000`,
 * so we keep the baseURL empty (relative paths).
 * Cookies are sent automatically via `withCredentials`.
 */
const api = axios.create({
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default api;

/* ─── Typed error helper ─── */

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Wraps an axios call so that HTTP errors are surfaced as `ApiError`
 * (keeps backward compat with existing catch blocks in auth pages).
 */
export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  try {
    const { method = "GET", body } = options;
    const { data } = await api.request<T>({
      url: path,
      method: method as string,
      data: body ? JSON.parse(body as string) : undefined,
    });
    return data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      const msg =
        typeof err.response.data?.message === "string"
          ? err.response.data.message
          : "Something went wrong. Please try again.";
      throw new ApiError(msg, err.response.status);
    }
    throw err;
  }
}
