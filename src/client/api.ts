interface FetchApiParameters {
  endpoint: string;
  body?: unknown;
}

const API_HOSTNAME =
  process.env.NODE_ENV === "production" ? "" : `http://localhost:7001`;

export async function fetchApi<TResponse>({
  endpoint,
  body
}: FetchApiParameters): Promise<TResponse> {
  if (!endpoint.startsWith("/")) {
    throw new Error("Endpoint must be a relative path.");
  }

  const url = `${API_HOSTNAME}${endpoint}`;
  const response = await fetch(url, {
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST"
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}
