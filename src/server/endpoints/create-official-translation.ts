import Database from "@server/database/Database";
import { Schemas } from "@server/database/schemas";
import { Response } from "@server/types";

import { CreateOfficialTranslationEndpoint } from "@common/endpoints";
import { CreateOfficialTranslationServerResponse } from "@common/serverResponses";

export default async function createOfficialTranslationEndpoint(
  request: CreateOfficialTranslationEndpoint,
  database: Database
): Promise<Response> {
  const { id } = await database.create(Schemas.OfficialTranslations, {
    comments: request.proto.comments,
    record_id: request.recordId,
    translation: request.proto.translation
  });

  const response: CreateOfficialTranslationServerResponse = {
    officialTranslationId: id
  };

  return {
    payload: response,
    success: true
  };
}
