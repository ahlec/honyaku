import * as React from "react";
import { connect } from "react-redux";

import { ProtoRecord } from "@common/types";

import { ReduxDispatch } from "@client/redux";
import { createRecord } from "@client/redux/records/actions";

import RecordConfigureForm from "./RecordConfigureForm";

export const ROUTE_PATH = "/record/create";

interface ComponentProps {
  dispatch: ReduxDispatch;
}

class RecordCreateRouteUnwrapper extends React.PureComponent<ComponentProps> {
  public render() {
    return <RecordConfigureForm current={null} onSubmit={this.onSubmit} />;
  }

  private onSubmit = async (proto: ProtoRecord) => {
    const { dispatch } = this.props;
    await dispatch(createRecord(proto));
  };
}

export default connect()(RecordCreateRouteUnwrapper);
