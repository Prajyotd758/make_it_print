export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string,
    public fieldErrors: Record<string, string[]> = {}
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

interface Options {
  signal?: AbortSignal;
  token?: string; // access token for protected routes
}

async function request<T>(
  path: string,
  {
    method = "GET",
    body,
    signal,
    token,
  }: Options & { method?: string; body?: unknown }
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      signal,
      headers: {
        ...(body !== undefined && { "Content-Type": "application/json" }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    if ((e as Error)?.name === "AbortError") throw e; // let callers ignore cancelled requests
    throw new ApiRequestError(
      "Could not reach the server. Check your connection.",
      0,
      "NETWORK_ERROR"
    );
  }

  const json = await res.json().catch(() => null);

  if (!res.ok || json?.success === false) {
    const err = json?.error;
    throw new ApiRequestError(
      err?.message ?? "Something went wrong. Please try again.",
      res.status,
      err?.code ?? "UNKNOWN",
      err?.code === "VALIDATION_ERROR" ? err.details ?? {} : {}
    );
  }

  // auth routes wrap the payload in { success, data }; product routes return it directly
  return (json?.success ? json.data : json) as T;
}

export const get = <T>(path: string, opts?: Options) =>
  request<T>(path, opts ?? {});
export const post = <T>(path: string, body: unknown, opts?: Options) =>
  request<T>(path, { ...opts, method: "POST", body });
export const patch = <T>(path: string, body: unknown, opts?: Options) =>
  request<T>(path, { ...opts, method: "PATCH", body });
export const del = <T>(path: string, opts?: Options) =>
  request<T>(path, { ...opts, method: "DELETE" });
