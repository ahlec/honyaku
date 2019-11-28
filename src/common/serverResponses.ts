/* tslint:disable:no-empty-interface */

import { JapaneseTextFragment } from "./japaneseMarkup";
import { Origin, ServerRecord } from "./types";

export interface InitializeServerResponse {
  origins: ReadonlyArray<Origin>;
  records: ReadonlyArray<ServerRecord>;
}

export interface CreateRecordServerResponse {
  recordId: number;
  timestampCreated: number;
}

export interface CreateUserTranslationServerResponse {
  userTranslationId: number;
  timestampCreated: number;
}

export interface ChangeUserTranslationTextServerResponse {
  timestampModified: number;
}

export interface CreateOfficialTranslationServerResponse {
  officialTranslationId: number;
}

export interface ChangeOfficialTranslationTextServerResponse {}

export interface KanjiMarkupServerResponse {
  fragments: ReadonlyArray<JapaneseTextFragment>;
  input: string;
}
