import { fetchApi } from "@client/api";
import { ReduxDispatch } from "@client/redux";

import { CreateUserTranslationEndpoint } from "@common/endpoints";
import { CreateUserTranslationServerResponse } from "@common/serverResponses";
import { ProtoUserTranslation, UserTranslation } from "@common/types";

export interface ActionUserTranslationCreated {
  type: "user-translation-created";

  recordId: number;
  userTranslation: UserTranslation;
}

export type UserTranslationActions = ActionUserTranslationCreated;

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
