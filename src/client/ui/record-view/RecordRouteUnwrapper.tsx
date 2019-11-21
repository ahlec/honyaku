import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";

import { State } from "@client/redux";
import { ReduxRecord } from "@client/redux/records";
import ErrorRedirect from "@client/ui/ErrorRedirect";

import RecordView from "./RecordView";

export const ROUTE_PATH = "/record/:id(\\d+)";

export function getLinkToRecordView(record: ReduxRecord): string {
  return `/record/${record.id}`;
}

type ProvidedProps = RouteComponentProps<{ id: string }>;

interface ReduxProps {
  record: ReduxRecord | null;
}

function mapStateToProps(state: State, props: ProvidedProps): ReduxProps {
  const id = parseInt(props.match.params.id, 10);

  return {
    record: (isFinite(id) && state.records[id]) || null
  };
}

type ComponentProps = ProvidedProps & ReduxProps;

class RecordRouteUnwrapper extends React.PureComponent<ComponentProps> {
  public render() {
    const {
      match: {
        params: { id }
      },
      record
    } = this.props;
    if (!record) {
      return (
        <ErrorRedirect message={`There is no record with the id of '${id}'.`} />
      );
    }

    return <RecordView record={record} />;
  }
}

export default connect(mapStateToProps)(RecordRouteUnwrapper);
