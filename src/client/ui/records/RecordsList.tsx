import * as React from "react";
import { connect } from "react-redux";

import { Grid } from "@material-ui/core";
// import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";

import { State } from "@client/redux";
import { ReduxRecord } from "@client/redux/records";
import { getRecordsArray } from "@client/redux/records/selectors";

import FilterBar from "./FilterBar";
import { RecordFilter } from "./filters";
import RecordCard from "./RecordCard";
import RecordProvider from "./RecordProvider";

interface ReduxProps {
  records: ReadonlyArray<ReduxRecord>;
}

function mapStateToProps(state: State): ReduxProps {
  return {
    records: getRecordsArray(state)
  };
}

type ComponentProps = ReduxProps;

interface ComponentState {
  filters: ReadonlyArray<RecordFilter>;
}

class RecordsList extends React.PureComponent<ComponentProps, ComponentState> {
  public state: ComponentState = {
    filters: []
  };

  public render() {
    const { records } = this.props;
    const { filters } = this.state;

    return (
      <div>
        <FilterBar
          allRecords={records}
          filters={filters}
          onFiltersChanged={this.onFiltersChanged}
        />
        <Grid container spacing={2}>
          <RecordProvider allRecords={records} filters={filters}>
            {this.renderRecords}
          </RecordProvider>
        </Grid>
      </div>
    );
  }

  private renderRecords = (records: ReadonlyArray<ReduxRecord>) => {
    return records.map(this.renderLink);
  };

  private renderLink = (record: ReduxRecord) => {
    return (
      <Grid key={record.id} item xs={3}>
        <RecordCard record={record} />
      </Grid>
    );
  };

  private onFiltersChanged = (filters: ReadonlyArray<RecordFilter>) =>
    this.setState({ filters });
}

export default connect(mapStateToProps)(RecordsList);
