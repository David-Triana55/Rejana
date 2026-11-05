export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// Same shape returned by the backend's DomainErrorFilter.
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
  // Forwards the user's `token` cookie to the backend. Default: true.
  auth?: boolean;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};
