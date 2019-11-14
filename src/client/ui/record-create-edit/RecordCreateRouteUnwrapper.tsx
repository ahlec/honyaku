import * as React from "react";

import { ProtoRecord } from "./interfaces";
import RecordConfigureForm from "./RecordConfigureForm";

export const ROUTE_PATH = "/record/create";

export default class RecordCreateRouteUnwrapper extends React.PureComponent {
  public render() {
    return <RecordConfigureForm current={null} onSubmit={this.onSubmit} />;
  }

  private onSubmit = async (proto: ProtoRecord) => {
    console.log(proto);
  };
}
