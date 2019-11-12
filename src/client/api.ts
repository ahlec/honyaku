import * as queryString from "query-string";

export interface FileParameter {
  filename: string;
  fileData: Blob;
}

type ValidParameterValue =
  | undefined
  | null
  | string
  | number
  | boolean
  | FileParameter;

function isFileParameter(value: ValidParameterValue): value is FileParameter {
  return !!value && typeof value === "object" && !!value.fileData;
}

interface FetchApiParameters {
  endpoint: string;
  method: "GET" | "POST";
  parameters?: { [key: string]: ValidParameterValue };
}

const API_HOSTNAME =
  process.env.NODE_ENV === "production" ? "" : `http://localhost:8081`;

function chooseNever(_: never) {
  // Nothing. This just exists for TypeScript
}

const NULL_BODY_VALUE = "<apiNull>";

export async function fetchApi<TResponse>({
  endpoint,
  method,
  parameters
}: FetchApiParameters): Promise<TResponse> {
  if (!endpoint.startsWith("/")) {
    throw new Error("Endpoint must be a relative path.");
  }

  let response: Response;
  switch (method) {
    case "GET": {
      let url = `${API_HOSTNAME}${endpoint}`;
      if (parameters) {
        const query = queryString.stringify(parameters);
        url += `?${query}`;
      }

      response = await fetch(url, {
        credentials: "include",
        method: "GET"
      });
      break;
    }
    case "POST": {
      const body = new FormData();
      if (parameters) {
        for (const field in parameters) {
          if (!parameters.hasOwnProperty(field)) {
            continue;
          }

          const value = parameters[field];
          if (isFileParameter(value)) {
            body.append(field, value.fileData, value.filename);
          } else if (value === null) {
            body.append(field, NULL_BODY_VALUE);
          } else if (typeof value !== "undefined") {
            body.append(field, value.toString());
          }
        }
      }

      response = await fetch(`${API_HOSTNAME}${endpoint}`, {
        body,
        credentials: "include",
        method: "POST"
      });
      break;
    }
    default: {
      chooseNever(method);
      throw new Error();
    }
  }

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}
