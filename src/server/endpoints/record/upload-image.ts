import Database from "@server/database/Database";
import { Schemas } from "@server/database/schemas";
import ImgurAPI from "@server/ImgurAPI";
import { Response, FailureType } from "@server/types";
import YahooAPI from "@server/YahooAPI";

import { UploadRecordImageEndpointServerSide } from "@common/endpoints";
import { UploadRecordImageServerResponse } from "@common/serverResponses";
import { parseJapaneseMarkup } from "@common/japaneseMarkup";

function getDisplayTitle(japaneseMarkup: string): string {
  const fragments = parseJapaneseMarkup(japaneseMarkup);
  return fragments.map(({ text }) => text).join();
}

export default async function uploadRecordImageEndpoint(
  request: UploadRecordImageEndpointServerSide,
  database: Database,
  yahooApi: YahooAPI,
  imgurApi: ImgurAPI
): Promise<Response> {
  const record = await database.single(Schemas.Records, request.recordId);
  if (!record) {
    return {
      message: "Specified record does not exist.",
      success: false,
      type: FailureType.BadInput
    };
  }

  const title = getDisplayTitle(record.japanese_markup);
  const result = await imgurApi.uploadImage(title, request.image);

  const success = await database.update(Schemas.Records, request.recordId, {
    imgur_id: result.id,
    imgur_link: result.link
  });
  if (!success) {
    return {
      message: "Could not update the database.",
      success: false,
      type: FailureType.Error
    };
  }

  const response: UploadRecordImageServerResponse = {
    imageLink: result.link,
    recordId: request.recordId
  };

  return {
    payload: response,
    success: true
  };
}
