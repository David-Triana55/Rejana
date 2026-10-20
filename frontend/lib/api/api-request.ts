import { cookies } from "next/headers";
import type { ApiError, ApiRequestOptions, ApiResult } from "./types";

// Solo para servidor (Server Actions, Server Components, Route Handlers).
// Esto NO es una Server Action: no lleva "use server" para no exponerlo como endpoint.

const AUTH_COOKIE = "token";

function getBaseUrl() {
  const url = process.env.API_URL;
  if (!url) throw new Error("Falta la variable de entorno API_URL");
  return url.replace(/\/$/, "");
}

function buildUrl(path: string, query: ApiRequestOptions["query"]) {
  const url = new URL(`${getBaseUrl()}/${path.replace(/^\//, "")}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }
  return url;
}

// El backend setea la cookie de sesión en SU respuesta; hay que pasarla al navegador.
async function relaySetCookies(res: Response) {
  const store = await cookies();
  for (const raw of res.headers.getSetCookie()) {
    const [pair, ...attrs] = raw.split(";").map((p) => p.trim());
    const eq = pair.indexOf("=");
    if (eq < 1) continue;

    const options: Parameters<typeof store.set>[2] = {};
    for (const attr of attrs) {
      const [k, v] = attr.split("=");
      switch (k.toLowerCase()) {
        case "httponly": options.httpOnly = true; break;
        case "secure": options.secure = true; break;
        case "path": options.path = v; break;
        case "max-age": options.maxAge = Number(v); break;
        case "expires": options.expires = new Date(v); break;
        case "samesite": options.sameSite = v.toLowerCase() as "lax" | "strict" | "none"; break;
      }
    }
    store.set(pair.slice(0, eq), pair.slice(eq + 1), options);
  }
}

async function parseBody(res: Response): Promise<unknown> {
  if (res.status === 204) return undefined;
  const text = await res.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function toApiError(status: number, body: unknown): ApiError {
  if (body && typeof body === "object") {
    const b = body as Record<string, unknown>;
    // Nest ValidationPipe devuelve message: string[]
    const message = Array.isArray(b.message) ? b.message.join(", ") : b.message;
    return {
      status,
      code: typeof b.code === "string" ? b.code : (typeof b.error === "string" ? b.error : "HTTP_ERROR"),
      message: typeof message === "string" ? message : `Error ${status}`,
      details: b.details,
    };
  }
  return { status, code: "HTTP_ERROR", message: `Error ${status}` };
}

export async function apiRequest<T = unknown>(
  path: string,
  { method = "GET", body, query, auth = true, headers, signal }: ApiRequestOptions = {},
): Promise<ApiResult<T>> {
  const requestHeaders = new Headers({ Accept: "application/json", ...headers });
  if (body !== undefined) requestHeaders.set("Content-Type", "application/json");

  if (auth) {
    const token = (await cookies()).get(AUTH_COOKIE)?.value;
    if (token) requestHeaders.set("Cookie", `${AUTH_COOKIE}=${token}`);
  }

  let res: Response;
  try {
    res = await fetch(buildUrl(path, query), {
      method,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
      signal,
    });
  } catch {
    return { ok: false, error: { status: 0, code: "NETWORK_ERROR", message: "No se pudo conectar con el servidor" } };
  }

  await relaySetCookies(res);
  const data = await parseBody(res);

  if (!res.ok) return { ok: false, error: toApiError(res.status, data) };
  return { ok: true, status: res.status, data: data as T };
}
