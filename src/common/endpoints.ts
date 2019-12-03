import {
  ProtoOfficialTranslation,
  ProtoRecord,
  ProtoUserTranslation
} from "./types";

export type CreateRecordEndpoint = ProtoRecord;

export interface UploadRecordImageEndpointClientSide {
  recordId: number;
  image: Blob;
}

export interface UploadRecordImageEndpointServerSide {
  recordId: number;
  image: Buffer;
}

export interface CreateUserTranslationEndpoint {
  recordId: number;
  proto: ProtoUserTranslation;
}

export interface ChangeUserTranslationTextEndpoint {
  translationId: number;
  text: string;
}

export interface CreateOfficialTranslationEndpoint {
  recordId: number;
  proto: ProtoOfficialTranslation;
}

export interface ChangeOfficialTranslationTextEndpoint {
  translationId: number;
  text: string;
}

export interface KanjiMarkupEndpoint {
  input: string;
}
