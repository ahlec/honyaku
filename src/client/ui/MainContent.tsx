import * as React from "react";
import { Route, Switch } from "react-router-dom";

import OriginRouteUnwrapper, {
  ROUTE_PATH as ORIGIN_ROUTE_PATH
} from "./origin-view/OriginRouteUnwrapper";
import OriginsRouteUnwrapper, {
  ROUTE_PATH as ORIGINS_ROUTE_PATH
} from "./origins/OriginsRouteUnwrapper";
import RecordCreateRouteUnwrapper, {
  ROUTE_PATH as RECORD_CREATE_ROUTE_PATH
} from "./record-create-edit/RecordCreateRouteUnwrapper";
import RecordEditRouteUnwrapper, {
  ROUTE_PATH as RECORD_EDIT_ROUTE_PATH
} from "./record-create-edit/RecordEditRouteUnwrapper";

export default class Application extends React.PureComponent {
  public render() {
    return (
      <Switch>
        <Route path={ORIGIN_ROUTE_PATH} component={OriginRouteUnwrapper} />
        <Route path={ORIGINS_ROUTE_PATH} component={OriginsRouteUnwrapper} />
        <Route
          path={RECORD_CREATE_ROUTE_PATH}
          component={RecordCreateRouteUnwrapper}
        />
        <Route
          path={RECORD_EDIT_ROUTE_PATH}
          component={RecordEditRouteUnwrapper}
        />
        <Route render={this.renderMainContent} />
      </Switch>
    );
  }

  private renderMainContent = () => {
    return "Honyaku main content";
  };
}
