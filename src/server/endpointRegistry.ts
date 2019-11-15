import { Endpoint } from "./types";

import createRecordEndpoint from "./endpoints/create-record";
import initializeEndpoint from "./endpoints/initialize";

export const ENDPOINTS: { [endpoint: string]: Endpoint | undefined } = {
  "/initialize": {
    processor: initializeEndpoint,
    requiresAuthentication: false
  },
  "/recod/create": {
    processor: createRecordEndpoint,
    requiresAuthentication: true
  }
};
