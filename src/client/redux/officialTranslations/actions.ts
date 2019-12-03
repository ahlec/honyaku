import { fetchApi } from "@client/api";
import { ReduxDispatch } from "@client/redux";

import {
  ChangeOfficialTranslationTextEndpoint,
  CreateOfficialTranslationEndpoint
} from "@common/endpoints";
import {
  ChangeOfficialTranslationTextServerResponse,
  CreateOfficialTranslationServerResponse
} from "@common/serverResponses";
import { OfficialTranslation, ProtoOfficialTranslation } from "@common/types";

export interface ActionOfficialTranslationCreated {
  type: "official-translation-created";

  recordId: number;
  officialTranslation: OfficialTranslation;
}

export interface ActionOfficialTranslationTextChanged {
  type: "official-translation-text-changed";

  recordId: number;
  translationId: number;
  text: string;
}

export type OfficialTranslationActions =
  | ActionOfficialTranslationCreated
  | ActionOfficialTranslationTextChanged;

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
      endpoint: "/official-translation/create",
      transferType: "json"
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

export function changeOfficialTranslationText(
  recordId: number,
  translationId: number,
  text: string
) {
  return async (dispatch: ReduxDispatch) => {
    const payload: ChangeOfficialTranslationTextEndpoint = {
      text,
      translationId
    };
    await fetchApi<ChangeOfficialTranslationTextServerResponse>({
      body: payload,
      endpoint: "/official-translation/change-text",
      transferType: "json"
    });

    const action: ActionOfficialTranslationTextChanged = {
      recordId,
      text,
      translationId,
      type: "official-translation-text-changed"
    };

    dispatch(action);
  };
}
