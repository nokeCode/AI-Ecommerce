const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export type FetchOptions = RequestInit & { body?: any };

export async function apiFetch<T = any>(path: string, opts: FetchOptions = {}): Promise<T> {
  const { body, headers = {}, ...rest } = opts;

  let resolvedBody: BodyInit | undefined = undefined;

  if (body !== undefined && body !== null) {
    // Allow passing objects directly
    if (typeof body === "object" && !(body instanceof FormData)) {
      resolvedBody = JSON.stringify(body);
      headers["Content-Type"] = headers["Content-Type"] || "application/json";
    } else {
      resolvedBody = body as BodyInit;
    }
  }

  // Attach Authorization if token present
  try {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore (SSR)
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers,
    body: resolvedBody,
  });

  const text = await res.text();
  const contentType = res.headers.get("content-type") || "";

  if (!res.ok) {
    let parsed = text;
    if (contentType.includes("application/json")) {
      try { parsed = JSON.parse(text); } catch {}
    }
    throw new Error(typeof parsed === "string" ? parsed : JSON.stringify(parsed));
  }

  if (!text) return {} as T;
  if (contentType.includes("application/json")) return JSON.parse(text) as T;
  return text as unknown as T;
}

export default apiFetch;

// also export as named for consistency with existing imports
export { apiFetch };

