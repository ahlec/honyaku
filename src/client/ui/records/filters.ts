import { Record } from "@common/types";

export interface RecordFilter {
  id: string;
  label: string;
  predicate: (record: Record) => boolean;
}

export interface FiltersCollection {
  originTypes: ReadonlyArray<RecordFilter>;
  status: ReadonlyArray<RecordFilter>;
}

const STATUS_FILTERS: ReadonlyArray<RecordFilter> = [
  {
    id: "missing-user-translation",
    label: "Missing user translations",
    predicate: record => !record.userTranslations.length
  },
  {
    id: "has-user-translation",
    label: "Has user translations",
    predicate: record => !!record.userTranslations.length
  },
  {
    id: "missing-official-translation",
    label: "Missing official translations",
    predicate: record => !record.officialTranslations.length
  },
  {
    id: "has-official-translation",
    label: "Has official translations",
    predicate: record => !!record.officialTranslations.length
  }
];

export function getFiltersCollection(
  records: ReadonlyArray<Record>
): FiltersCollection | null {
  if (!records.length) {
    return null;
  }

  return {
    originTypes: [],
    status: STATUS_FILTERS
  };
}
