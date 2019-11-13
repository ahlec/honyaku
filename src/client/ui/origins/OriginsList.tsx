import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { Origin } from "@common/types";

import { State } from "@client/redux";
import { getOriginsArray } from "@client/redux/origins/selectors";
import { getLinkToOriginView } from "@client/ui/origin-view/OriginRouteUnwrapper";

interface ReduxProps {
  origins: ReadonlyArray<Origin>;
}

function mapStateToProps(state: State): ReduxProps {
  return {
    origins: getOriginsArray(state)
  };
}

type ComponentProps = ReduxProps;

class OriginsList extends React.PureComponent<ComponentProps> {
  public render() {
    const { origins } = this.props;
    return <ul className="OriginsList">{origins.map(this.renderLink)}</ul>;
  }

  private renderLink = (origin: Origin) => {
    return (
      <li key={origin.id}>
        <Link to={getLinkToOriginView(origin)}>{origin.title}</Link>
      </li>
    );
  };
}

export default connect(mapStateToProps)(OriginsList);
