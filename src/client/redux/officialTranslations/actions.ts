import { fetchApi } from "@client/api";
import { ReduxDispatch } from "@client/redux";

import { CreateOfficialTranslationEndpoint } from "@common/endpoints";
import { CreateOfficialTranslationServerResponse } from "@common/serverResponses";
import { OfficialTranslation, ProtoOfficialTranslation } from "@common/types";

export interface ActionOfficialTranslationCreated {
  type: "official-translation-created";

  recordId: number;
  officialTranslation: OfficialTranslation;
}

export type OfficialTranslationActions = ActionOfficialTranslationCreated;

export function createOfficialTranslation(
  recordId: number,
  proto: ProtoOfficialTranslation
) {
  return async (dispatch: ReduxDispatch) => {
    const payload: CreateOfficialTranslationEndpoint = {
      proto,
      recordId
    };
    const { officialTranslationId } = await fetchApi<
      CreateOfficialTranslationServerResponse
    >({
      body: payload,
      endpoint: "/official-translation/create"
    });

    const action: ActionOfficialTranslationCreated = {
      officialTranslation: {
        id: officialTranslationId,
        ...proto
      },
      recordId,
      type: "official-translation-created"
    };

    dispatch(action);
  };
}
