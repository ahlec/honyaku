import { OriginType, RecordSignificance } from "@common/types";

export interface FormValues {
  createAnother: boolean;
  originId: string;
  originType: OriginType | "";
  rawJapaneseInput: string;
  significance: RecordSignificance;
  sourceChapterNo: string;
  sourceEpisodeNo: string;
  sourcePageNo: string;
  sourceSeasonNo: string;
  sourceUrl: string;
}
