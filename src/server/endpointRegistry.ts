import { Endpoint } from "./types";

import initializeEndpoint from "./endpoints/initialize";
import kanjiMarkupEndpoint from "./endpoints/kanji-markup";
import changeOfficialTranslationTextEndpoint from "./endpoints/official-translation/change-text";
import createOfficialTranslationEndpoint from "./endpoints/official-translation/create";
import createRecordEndpoint from "./endpoints/record/create";
import uploadRecordImageEndpoint from "./endpoints/record/upload-image";
import changeUserTranslationTextEndpoint from "./endpoints/user-translation/change-text";
import createUserTranslationEndpoint from "./endpoints/user-translation/create";

export const ENDPOINTS: { [endpoint: string]: Endpoint | undefined } = {
  "/initialize": {
    processor: initializeEndpoint,
    requiresAuthentication: false
  },
  "/kanji/markup": {
    processor: kanjiMarkupEndpoint,
    requiresAuthentication: true
  },
  "/official-translation/change-text": {
    processor: changeOfficialTranslationTextEndpoint,
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
  "/record/upload-image": {
    processor: uploadRecordImageEndpoint,
    requiresAuthentication: true
  },
  "/user-translation/change-text": {
    processor: changeUserTranslationTextEndpoint,
    requiresAuthentication: true
  },
  "/user-translation/create": {
    processor: createUserTranslationEndpoint,
    requiresAuthentication: true
  }
};
