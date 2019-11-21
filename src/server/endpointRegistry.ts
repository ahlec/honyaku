import { Endpoint } from "./types";

import createOfficialTranslationEndpoint from "./endpoints/create-official-translation";
import createRecordEndpoint from "./endpoints/create-record";
import createUserTranslationEndpoint from "./endpoints/create-user-translation";
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
  "/official-translation/create": {
    processor: createOfficialTranslationEndpoint,
    requiresAuthentication: true
  },
  "/record/create": {
    processor: createRecordEndpoint,
    requiresAuthentication: true
  },
  "/user-translation/create": {
    processor: createUserTranslationEndpoint,
    requiresAuthentication: true
  }
};
