import { apiUnderTestConfig } from "./apiUnderTestConfig";

// Store the original fetch
const originalFetch = global.fetch;

// Create a custom fetch that prepends the base URL for relative URLs
const customFetch: typeof fetch = (input: RequestInfo | URL, init?: RequestInit) => {
  let url: string;

  if (typeof input === "string") {
    url = input;
  } else if (input instanceof URL) {
    url = input.toString();
  } else if (input instanceof Request) {
    url = input.url;
  } else {
    url = String(input);
  }

  // If URL is relative, prepend the base URL
  if (url.startsWith("/")) {
    url = `${apiUnderTestConfig.apiBaseUrl}${url}`;
  }

  // Create a new Request with the full URL
  const newInput = typeof input === "string" ? url : new Request(url, init);

  return originalFetch(newInput, init);
};

// Override global fetch
global.fetch = customFetch;
