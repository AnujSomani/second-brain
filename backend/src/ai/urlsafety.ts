import { lookup } from "node:dns/promises";
import { BlockList, isIP } from "node:net";
const BLOCKED_HOSTS = new Set([
  "localhost",
  "localhost.localdomain",
  "ip6-localhost",
  "ip6-loopback",
  "metadata",
  "metadata.google.internal",
  "metadata.google.com",
]);
const privateRanges = new BlockList();
privateRanges.addSubnet("0.0.0.0", 8, "ipv4");
privateRanges.addSubnet("10.0.0.0", 8, "ipv4");
privateRanges.addSubnet("100.64.0.0", 10, "ipv4");
privateRanges.addSubnet("127.0.0.0", 8, "ipv4");
privateRanges.addSubnet("169.254.0.0", 16, "ipv4");
privateRanges.addSubnet("172.16.0.0", 12, "ipv4");
privateRanges.addSubnet("192.168.0.0", 16, "ipv4");
privateRanges.addSubnet("::", 128, "ipv6");
privateRanges.addSubnet("::1", 128, "ipv6");
privateRanges.addSubnet("fc00::", 7, "ipv6");
privateRanges.addSubnet("fe80::", 10, "ipv6");
privateRanges.addSubnet("ff00::", 8, "ipv6");
const MAX_DOWNLOAD_BYTES = 5 * 1024 * 1024;
const MAX_REDIRECTS = 5;
export function assertSafeUrl(rawUrl: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error("Invalid URL provided");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Only http/https URLs are allowed");
  }
  const hostname = parsed.hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (BLOCKED_HOSTS.has(hostname) || isBlockedIp(hostname)) {
    throw new Error("This URL is not allowed");
  }
  return parsed;
}
export async function assertSafeToFetch(rawUrl: string): Promise<URL> {
  const parsed = assertSafeUrl(rawUrl);
  const hostname = parsed.hostname.replace(/^\[|\]$/g, "");
  if (isIP(hostname) || looksLikeNumericIpv4(hostname)) {
    if (isBlockedIp(hostname)) {
      throw new Error("This URL is not allowed");
    }
    return parsed;
  }
  let addresses;
  try {
    addresses = await lookup(hostname, { all: true });
  } catch {
    throw new Error("This URL is not allowed");
  }
  if (addresses.length === 0 || addresses.some((a) => isBlockedIp(a.address))) {
    throw new Error("This URL is not allowed");
  }
  return parsed;
}
export async function safeFetch(
  rawUrl: string,
  init: RequestInit & { maxBytes?: number; timeoutMs?: number } = {}
): Promise<{ response: Response; buffer: Buffer }> {
  const { maxBytes = MAX_DOWNLOAD_BYTES, timeoutMs = 10000, ...fetchInit } = init;
  let current = rawUrl;
  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    await assertSafeToFetch(current);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(current, {
        ...fetchInit,
        redirect: "manual",
        signal: controller.signal,
      });
      if (isRedirect(response.status)) {
        const location = response.headers.get("location");
        if (!location) {
          throw new Error("Redirect missing Location header");
        }
        current = new URL(location, current).toString();
        continue;
      }
      const method = (fetchInit.method ?? "GET").toString().toUpperCase();
      if (method === "HEAD") {
        return { response, buffer: Buffer.alloc(0) };
      }
      const declaredLength = Number(response.headers.get("content-length") ?? "0");
      if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
        throw new Error("Response too large");
      }
      const buffer = await readCapped(response, maxBytes);
      return { response, buffer };
    } finally {
      clearTimeout(timeout);
    }
  }
  throw new Error("Too many redirects");
}
function isRedirect(status: number): boolean {
  return status === 301 || status === 302 || status === 303 || status === 307 || status === 308;
}
function looksLikeNumericIpv4(hostname: string): boolean {
  return /^\d+$/.test(hostname) || /^\d+(?:\.\d+){1,3}$/.test(hostname);
}
function isBlockedIp(host: string): boolean {
  const hostname = host.replace(/^\[|\]$/g, "").toLowerCase();
  if (/^\d+$/.test(hostname)) {
    const n = Number(hostname);
    if (n < 0 || n > 0xffffffff || !Number.isInteger(n)) return true;
    const dotted = [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
    return privateRanges.check(dotted, "ipv4");
  }
  const mapped = hostname.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
  if (mapped?.[1]) {
    return privateRanges.check(mapped[1], "ipv4") || privateRanges.check(hostname, "ipv6");
  }
  const version = isIP(hostname);
  if (version === 4) return privateRanges.check(hostname, "ipv4");
  if (version === 6) return privateRanges.check(hostname, "ipv6");
  return false;
}
async function readCapped(response: Response, maxBytes: number): Promise<Buffer> {
  if (!response.body) return Buffer.alloc(0);
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new Error("Response too large");
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}