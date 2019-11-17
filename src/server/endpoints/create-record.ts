import Database from "@server/database/Database";
import { Schemas } from "@server/database/schemas";
import { Response } from "@server/types";

import { CreateRecordEndpoint } from "@common/endpoints";
import { CreateRecordServerResponse } from "@common/serverResponses";
import { OriginType } from "@common/types";

export default async function createRecordEndpoint(
  request: CreateRecordEndpoint,
  database: Database
): Promise<Response> {
  let chapterNo: number | null = null;
  let pageNo: number | null = null;
  let seasonNo: number | null = null;
  let episodeNo: number | null = null;
  switch (request.source.type) {
    case OriginType.Book:
    case OriginType.Manga: {
      chapterNo = request.source.chapterNo;
      pageNo = request.source.pageNo;
      break;
    }
    case OriginType.Anime: {
      seasonNo = request.source.seasonNo;
      episodeNo = request.source.episodeNo;
      break;
    }
  }

  const timestampCreated = Date.now();
  const { id } = await database.create(Schemas.Records, {
    created: new Date(timestampCreated),
    has_image: 0,
    japanese_kana_only: request.japanese.kanaOnly,
    japanese_kanji_only: request.japanese.kanjiOnly,
    japanese_markup: request.japanese.markup,
    origin_chapter_no: chapterNo,
    origin_episode_no: episodeNo,
    origin_id: request.source.originId,
    origin_page_no: pageNo,
    origin_season_no: seasonNo
  });

  const response: CreateRecordServerResponse = {
    recordId: id,
    timestampCreated
  };

  return {
    payload: response,
    success: true
  };
}
