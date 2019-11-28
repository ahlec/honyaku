import Database from "@server/database/Database";
import { Schemas } from "@server/database/schemas";
import { Response } from "@server/types";

import { CreateUserTranslationEndpoint } from "@common/endpoints";
import { CreateUserTranslationServerResponse } from "@common/serverResponses";

export default async function createUserTranslationEndpoint(
  request: CreateUserTranslationEndpoint,
  database: Database
): Promise<Response> {
  const timestampCreated = Date.now();
  const { id } = await database.create(Schemas.UserTranslations, {
    comments: request.proto.comments,
    confidence: request.proto.confidence,
    created: new Date(timestampCreated),
    modified: null,
    record_id: request.recordId,
    translation: request.proto.translation
  });

  const response: CreateUserTranslationServerResponse = {
    timestampCreated,
    userTranslationId: id
  };

  return {
    payload: response,
    success: true
  };
}
