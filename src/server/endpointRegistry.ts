import { Endpoint } from "./types";

import initializeEndpoint from "./endpoints/initialize";

export const ENDPOINTS: { [endpoint: string]: Endpoint | undefined } = {
  "/initialize": {
    processor: initializeEndpoint,
    requiresAuthentication: false
  }
};
