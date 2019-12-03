type FetchApiParameters =
  | {
      endpoint: string;
      transferType: "json";
      body?: unknown;
    }
  | {
      endpoint: string;
      transferType: "form-data";
      body?: {
        [key: string]: string | number | Blob;
      };
    };

const API_HOSTNAME =
  process.env.NODE_ENV === "production" ? "" : `http://localhost:7001`;

export async function fetchApi<TResponse>(
  parameters: FetchApiParameters
): Promise<TResponse> {
  const { endpoint } = parameters;
  if (!endpoint.startsWith("/")) {
    throw new Error("Endpoint must be a relative path.");
  }

  const url = `${API_HOSTNAME}${endpoint}`;
  const { body, contentType } = preparePayload(parameters);
  const response = await fetch(url, {
    body,
    credentials: "include",
    headers: contentType
      ? {
          "Content-Type": contentType
        }
      : {},
    method: "POST"
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

function preparePayload(
  parameters: FetchApiParameters
): { body: string | FormData | undefined; contentType: string | undefined } {
  switch (parameters.transferType) {
    case "json": {
      const { body } = parameters;
      return {
        body: body ? JSON.stringify(body) : undefined,
        contentType: "application/json"
      };
    }
    case "form-data": {
      const { body } = parameters;

      const formData = new FormData();
      if (body) {
        for (const field in body) {
          if (!body.hasOwnProperty(field)) {
            continue;
          }

          const value = body[field];
          if (value instanceof Blob) {
            formData.append(field, value);
          } else if (typeof value !== "undefined") {
            formData.append(field, value.toString());
          }
        }
      }

      return {
        body: formData,
        contentType: undefined
      };
    }
  }
}
