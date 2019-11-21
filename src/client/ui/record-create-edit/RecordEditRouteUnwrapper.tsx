import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";

import { State } from "@client/redux";
import { ReduxRecord } from "@client/redux/records";
import ErrorRedirect from "@client/ui/ErrorRedirect";

import RecordConfigureForm from "./RecordConfigureForm";

export const ROUTE_PATH = "/record/:id(\\d+)/edit";

export function getLinkToRecordEdit(record: ReduxRecord): string {
  return `/record/${record.id}/edit`;
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

class RecordEditRouteUnwrapper extends React.PureComponent<ComponentProps> {
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

    return <RecordConfigureForm current={record} onSubmit={this.onSubmit} />;
  }

  private onSubmit = async () => {
    return;
  };
}

export default connect(mapStateToProps)(RecordEditRouteUnwrapper);
