export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// Mismo formato que devuelve DomainErrorFilter del backend.
export type ApiError = {
  status: number;
  code: string;
  message: string;
  details?: unknown;
};

export type ApiResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; error: ApiError };

export type ApiRequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  // Reenvía la cookie `token` del usuario al backend. Default: true.
  auth?: boolean;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};
