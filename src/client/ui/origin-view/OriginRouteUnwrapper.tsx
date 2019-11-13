import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";

import { Origin } from "@common/types";

import { State } from "@client/redux";
import ErrorRedirect from "@client/ui/ErrorRedirect";

import OriginView from "./OriginView";

export const ROUTE_PATH = "/origin/:id(\\d+)";

export function getLinkToOriginView(origin: Origin): string {
  return `/origin/${origin.id}`;
}

type ProvidedProps = RouteComponentProps<{ id: string }>;

interface ReduxProps {
  origin: Origin | null;
}

function mapStateToProps(state: State, props: ProvidedProps): ReduxProps {
  const id = parseInt(props.match.params.id, 10);

  return {
    origin: (isFinite(id) && state.origins[id]) || null
  };
}

type ComponentProps = ProvidedProps & ReduxProps;

class OriginRouteUnwrapper extends React.PureComponent<ComponentProps> {
  public render() {
    const {
      match: {
        params: { id }
      },
      origin
    } = this.props;
    if (!origin) {
      return (
        <ErrorRedirect message={`There is no origin with the id of '${id}'.`} />
      );
    }

    return <OriginView origin={origin} />;
  }
}

export default connect(mapStateToProps)(OriginRouteUnwrapper);
