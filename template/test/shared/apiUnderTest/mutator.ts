export class ApiResponseError<TData = unknown> extends Error {
  constructor(
    public data: TData,
    public status: number,
    public headers: Headers
  ) {
    const message =
      typeof data === "object" && data && "message" in data
        ? String((data as { message: unknown }).message)
        : typeof data === "string"
          ? data
          : "API Error";
    super(message);
    this.name = "ApiResponseError";
  }
}

export function isApiResponseError<TError>(
  error: unknown
): error is ApiResponseError<TError> {
  return error instanceof ApiResponseError;
}

export type ErrorType<T> = ApiResponseError<T>;

const parseBody = (body: string | null): unknown => {
  if (!body) return { message: "Unknown error" };

  try {
    return JSON.parse(body);
  } catch {
    // Body is a plain string, not JSON
    return { message: body };
  }
};

export const customFetch = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const res = await fetch(url, options);

  const body = [204, 205, 304].includes(res.status) ? null : await res.text();

  if (!res.ok) {
    const errorData = parseBody(body);
    throw new ApiResponseError(errorData, res.status, res.headers);
  }

  const data = body ? JSON.parse(body) : {};
  return { data, status: res.status, headers: res.headers } as T;
};

export default customFetch;
