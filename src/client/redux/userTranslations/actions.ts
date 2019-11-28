import { fetchApi } from "@client/api";
import { ReduxDispatch } from "@client/redux";

import {
  ChangeUserTranslationTextEndpoint,
  CreateUserTranslationEndpoint
} from "@common/endpoints";
import {
  ChangeUserTranslationTextServerResponse,
  CreateUserTranslationServerResponse
} from "@common/serverResponses";
import { ProtoUserTranslation, UserTranslation } from "@common/types";

export interface ActionUserTranslationCreated {
  type: "user-translation-created";

  recordId: number;
  userTranslation: UserTranslation;
}

export interface ActionUserTranslationTextChanged {
  type: "user-translation-text-changed";

  recordId: number;
  timestampModified: number;
  translationId: number;
  text: string;
}

export type UserTranslationActions =
  | ActionUserTranslationCreated
  | ActionUserTranslationTextChanged;

export function createUserTranslation(
  recordId: number,
  proto: ProtoUserTranslation
) {
  return async (dispatch: ReduxDispatch) => {
    const payload: CreateUserTranslationEndpoint = {
      proto,
      recordId
    };
    const { timestampCreated, userTranslationId } = await fetchApi<
      CreateUserTranslationServerResponse
    >({
      body: payload,
      endpoint: "/user-translation/create"
    });

    const action: ActionUserTranslationCreated = {
      recordId,
      type: "user-translation-created",
      userTranslation: {
        id: userTranslationId,
        timestampCreated,
        timestampModified: null,
        ...proto
      }
    };

    dispatch(action);
  };
}

export function changeUserTranslationText(
  recordId: number,
  translationId: number,
  text: string
) {
  return async (dispatch: ReduxDispatch) => {
    const payload: ChangeUserTranslationTextEndpoint = {
      text,
      translationId
    };
    const { timestampModified } = await fetchApi<
      ChangeUserTranslationTextServerResponse
    >({
      body: payload,
      endpoint: "/user-translation/change-text"
    });

    const action: ActionUserTranslationTextChanged = {
      recordId,
      text,
      timestampModified,
      translationId,
      type: "user-translation-text-changed"
    };

    dispatch(action);
  };
}
