export type ErrorType<Error> = Error;

export const customFetch = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const res = await fetch(url, options);

  const body = [204, 205, 304].includes(res.status) ? null : await res.text();

  if (!res.ok) {
    const err: globalThis.Error & { info?: any; status?: number } =
      new globalThis.Error();
    const data = body ? JSON.parse(body) : {};
    err.info = data;
    err.status = res.status;
    throw err;
  }

  const data = body ? JSON.parse(body) : {};
  return { data, status: res.status, headers: res.headers } as T;
};

export default customFetch;
