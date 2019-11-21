import { ReduxRecord } from "@client/redux/records";

export interface RecordFilter {
  id: string;
  label: string;
  predicate: (record: ReduxRecord) => boolean;
}

export interface FiltersCollection {
  originTypes: ReadonlyArray<RecordFilter>;
  status: ReadonlyArray<RecordFilter>;
}

const STATUS_FILTERS: ReadonlyArray<RecordFilter> = [];

export function getFiltersCollection(
  records: ReadonlyArray<ReduxRecord>
): FiltersCollection | null {
  if (!records.length) {
    return null;
  }

  return {
    originTypes: [],
    status: STATUS_FILTERS
  };
}
