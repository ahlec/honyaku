import { fetchApi } from "@client/api";
import { ReduxDispatch } from "@client/redux";

import { CreateRecordServerResponse } from "@common/serverResponses";
import { ProtoRecord, Record } from "@common/types";

export interface ActionRecordCreated {
  type: "record-created";

  record: Record;
}

export type RecordActions = ActionRecordCreated;

export function createRecord(proto: ProtoRecord) {
  return async (dispatch: ReduxDispatch) => {
    const { recordId, timestampCreated } = await fetchApi<
      CreateRecordServerResponse
    >({
      body: proto,
      endpoint: "/record/create"
    });

    const action: ActionRecordCreated = {
      type: "record-created",

      record: {
        id: recordId,
        imageUrl: null,
        timestampCreated,
        ...proto,
        officialTranslations: [],
        userTranslations: []
      }
    };

    dispatch(action);
  };
}
