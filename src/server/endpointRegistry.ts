import { Endpoint } from "./types";

import createRecordEndpoint from "./endpoints/create-record";
import initializeEndpoint from "./endpoints/initialize";
import kanjiMarkupEndpoint from "./endpoints/kanji-markup";

export const ENDPOINTS: { [endpoint: string]: Endpoint | undefined } = {
  "/initialize": {
    processor: initializeEndpoint,
    requiresAuthentication: false
  },
  "/kanji/markup": {
    processor: kanjiMarkupEndpoint,
    requiresAuthentication: true
  },
  "/record/create": {
    processor: createRecordEndpoint,
    requiresAuthentication: true
  }
};
