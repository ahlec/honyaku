import * as React from "react";

import OriginsList from "./OriginsList";

export const ROUTE_PATH = "/origins";

export default class OriginRouteUnwrapper extends React.PureComponent {
  public render() {
    return <OriginsList />;
  }
}
