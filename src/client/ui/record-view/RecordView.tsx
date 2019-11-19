import * as React from "react";

import { Record } from "@common/types";

interface ComponentProps {
  record: Record;
}

export default class RecordView extends React.PureComponent<ComponentProps> {
  public render() {
    const { record } = this.props;
    return <div className="RecordView">{record.japanese.markup}</div>;
  }
}
