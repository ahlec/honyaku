import { fetchApi } from "@client/api";
import { ReduxDispatch } from "@client/redux";

import { UploadRecordImageEndpointClientSide } from "@common/endpoints";
import {
  CreateRecordServerResponse,
  UploadRecordImageServerResponse
} from "@common/serverResponses";
import { ProtoRecord, ServerRecord } from "@common/types";

export interface ActionRecordCreated {
  type: "record-created";

  record: ServerRecord;
}

export interface ActionRecordImageUploaded {
  type: "record-image-uploaded";

  imageLink: string;
  recordId: number;
}

export type RecordActions = ActionRecordCreated | ActionRecordImageUploaded;

export function createRecord(proto: ProtoRecord) {
  return async (dispatch: ReduxDispatch) => {
    const { recordId, timestampCreated } = await fetchApi<
      CreateRecordServerResponse
    >({
      body: proto,
      endpoint: "/record/create",
      transferType: "json"
    });

    const record: ServerRecord = {
      id: recordId,
      imageUrl: null,
      timestampCreated,
      ...proto,
      officialTranslations: [],
      userTranslations: []
    };
    const action: ActionRecordCreated = {
      record,
      type: "record-created"
    };

    dispatch(action);

    return record;
  };
}

export function uploadRecordImage(recordId: number, image: Blob) {
  return async (dispatch: ReduxDispatch) => {
    const body: UploadRecordImageEndpointClientSide = {
      recordId,
      image
    };

    const { imageLink } = await fetchApi<UploadRecordImageServerResponse>({
      body: body as any, // TODO
      endpoint: "/record/upload-image",
      transferType: "form-data"
    });

    const action: ActionRecordImageUploaded = {
      imageLink,
      recordId,
      type: "record-image-uploaded"
    };

    dispatch(action);
  };
}
