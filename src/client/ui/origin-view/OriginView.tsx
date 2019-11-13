import * as React from "react";

import { Origin } from "@common/types";

interface ComponentProps {
  origin: Origin;
}

export default class OriginView extends React.PureComponent<ComponentProps> {
  public render() {
    const { origin } = this.props;
    return <div className="OriginView">{origin.title}</div>;
  }
}
