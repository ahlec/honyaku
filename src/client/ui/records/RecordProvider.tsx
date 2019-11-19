import memoizeOne from "memoize-one";
import * as React from "react";

import { Record } from "@common/types";

import { RecordFilter } from "./filters";

interface ProvidedProps {
  /**
   * An array of all of the {@link Record}s that should be
   * considered.
   */
  allRecords: ReadonlyArray<Record>;

  /**
   * A render function that will be passed the filtered list of records
   * based on the other input parameters to this component.
   */
  children: (records: ReadonlyArray<Record>) => React.ReactNode;

  /**
   * A list of any optional filters that should be used
   * in narrowing the list of {@link allRecords}.
   */
  filters: ReadonlyArray<RecordFilter>;
}

type ComponentProps = ProvidedProps;

export default class RecordProvider extends React.PureComponent<
  ComponentProps
> {
  private readonly memoizeFilteredRecords = memoizeOne(
    (
      records: ReadonlyArray<Record>,
      filters: ReadonlyArray<RecordFilter>
    ): ReadonlyArray<Record> => {
      if (!filters.length) {
        return records;
      }

      return records.filter(record =>
        filters.every(({ predicate }) => predicate(record))
      );
    }
  );

  public render() {
    const { allRecords, children, filters } = this.props;
    return children(this.memoizeFilteredRecords(allRecords, filters));
  }
}
