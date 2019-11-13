import * as React from "react";
import { Route, Switch } from "react-router-dom";

import OriginRouteUnwrapper, {
  ROUTE_PATH as ORIGIN_ROUTE_PATH
} from "./origin-view/OriginRouteUnwrapper";
import OriginsRouteUnwrapper, {
  ROUTE_PATH as ORIGINS_ROUTE_PATH
} from "./origins/OriginsRouteUnwrapper";

export default class Application extends React.PureComponent {
  public render() {
    return (
      <Switch>
        <Route path={ORIGIN_ROUTE_PATH} component={OriginRouteUnwrapper} />
        <Route path={ORIGINS_ROUTE_PATH} component={OriginsRouteUnwrapper} />
        <Route render={this.renderMainContent} />
      </Switch>
    );
  }

  private renderMainContent = () => {
    return "Honyaku main content";
  };
}
