import Database from "@server/database/Database";
import { Schemas } from "@server/database/schemas";
import { FailureType, Response } from "@server/types";

import { ChangeUserTranslationTextEndpoint } from "@common/endpoints";
import { ChangeUserTranslationTextServerResponse } from "@common/serverResponses";

export default async function changeUserTranslationTextEndpoint(
  request: ChangeUserTranslationTextEndpoint,
  database: Database
): Promise<Response> {
  const timestampModified = Date.now();
  const success = await database.update(
    Schemas.UserTranslations,
    request.translationId,
    {
      modified: new Date(timestampModified),
      translation: request.text
    }
  );

  if (!success) {
    return {
      message: "Could not update database.",
      success: false,
      type: FailureType.Error
    };
  }

  const response: ChangeUserTranslationTextServerResponse = {
    timestampModified
  };

  return {
    payload: response,
    success: true
  };
}
