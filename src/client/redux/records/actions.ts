import { fetchApi } from "@client/api";
import { ReduxDispatch } from "@client/redux";

import { CreateRecordServerResponse } from "@common/serverResponses";
import { ProtoRecord, ServerRecord } from "@common/types";

export interface ActionRecordCreated {
  type: "record-created";

  record: ServerRecord;
}

export type RecordActions = ActionRecordCreated;

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
