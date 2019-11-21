import * as React from "react";
import { Link } from "react-router-dom";

import { ReduxRecord } from "@client/redux/records";

interface ComponentProps {
  record: ReduxRecord;
}

export default class RecordView extends React.PureComponent<ComponentProps> {
  public render() {
    const { record } = this.props;
    return (
      <div className="RecordView">
        {record.japaneseMarkup}
        <div>
          <Link to={`/record/${record.id}/official-translation/add`}>
            Add official translation
          </Link>
        </div>
        <div>
          <Link to={`/record/${record.id}/user-translation/add`}>
            Add user translation
          </Link>
        </div>
      </div>
    );
  }
}
