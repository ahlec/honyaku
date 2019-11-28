import Database from "@server/database/Database";
import { Schemas } from "@server/database/schemas";
import { FailureType, Response } from "@server/types";

import { ChangeOfficialTranslationTextEndpoint } from "@common/endpoints";
import { ChangeOfficialTranslationTextServerResponse } from "@common/serverResponses";

export default async function changeOfficialTranslationTextEndpoint(
  request: ChangeOfficialTranslationTextEndpoint,
  database: Database
): Promise<Response> {
  const success = await database.update(
    Schemas.OfficialTranslations,
    request.translationId,
    {
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

  const response: ChangeOfficialTranslationTextServerResponse = {};

  return {
    payload: response,
    success: true
  };
}
