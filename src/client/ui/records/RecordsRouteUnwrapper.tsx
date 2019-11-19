import * as React from "react";

import RecordsList from "./RecordsList";

export const ROUTE_PATH = "/records";

export default class RecordsRouteUnwrapper extends React.PureComponent {
  public render() {
    return <RecordsList />;
  }
}
