import { IncomingMessage, Response } from "@server/types";

export default async function initializeEndpoint(
  request: IncomingMessage
): Promise<Response> {
  return {
    payload: "hello world",
    success: true
  };
}
