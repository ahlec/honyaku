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
import RecordViewRouteUnwrapper, {
  ROUTE_PATH as RECORD_VIEW_ROUTE_PATH
} from "./record-view/RecordRouteUnwrapper";
import RecordsRouteUnwrapper, {
  ROUTE_PATH as RECORDS_ROUTE_PATH
} from "./records/RecordsRouteUnwrapper";
import OfficialTranslationCreateRouteUnwrapper, {
  ROUTE_PATH as OFFICIAL_TRANSLATION_CREATE_ROUTE_PATH
} from "./translation-create-edit/OfficialTranslationCreateRouteUnwrapper";
import UserTranslationCreateRouteUnwrapper, {
  ROUTE_PATH as USER_TRANSLATION_CREATE_ROUTE_PATH
} from "./translation-create-edit/UserTranslationCreateRouteUnwrapper";

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
        <Route
          path={OFFICIAL_TRANSLATION_CREATE_ROUTE_PATH}
          component={OfficialTranslationCreateRouteUnwrapper}
        />
        <Route
          path={USER_TRANSLATION_CREATE_ROUTE_PATH}
          component={UserTranslationCreateRouteUnwrapper}
        />
        <Route
          path={RECORD_VIEW_ROUTE_PATH}
          component={RecordViewRouteUnwrapper}
        />
        <Route path={RECORDS_ROUTE_PATH} component={RecordsRouteUnwrapper} />
        <Route render={this.renderMainContent} />
      </Switch>
    );
  }

  private renderMainContent = () => {
    return "Honyaku main content";
  };
}
