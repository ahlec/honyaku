import memoizeOne from "memoize-one";
import * as React from "react";

import { ReduxRecord } from "@client/redux/records";

import { RecordFilter } from "./filters";

interface ProvidedProps {
  /**
   * An array of all of the {@link ReduxRecord}s that should be
   * considered.
   */
  allRecords: ReadonlyArray<ReduxRecord>;

  /**
   * A render function that will be passed the filtered list of records
   * based on the other input parameters to this component.
   */
  children: (records: ReadonlyArray<ReduxRecord>) => React.ReactNode;

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
      records: ReadonlyArray<ReduxRecord>,
      filters: ReadonlyArray<RecordFilter>
    ): ReadonlyArray<ReduxRecord> => {
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
