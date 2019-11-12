import * as React from "react";
import { connect } from "react-redux";

import { ReduxDispatch, State } from "@client/redux";
import { ApplicationState } from "@client/redux/applicationState";
import { initialize } from "@client/redux/applicationState/actions";

import "./Application.scss";

interface ReduxProps {
  applicationState: ApplicationState;
}

function mapStateToProps(state: State): ReduxProps {
  return {
    applicationState: state.applicationState
  };
}

type ComponentProps = ReduxProps & {
  dispatch: ReduxDispatch;
};

class Application extends React.PureComponent<ComponentProps> {
  public componentDidMount() {
    const { dispatch } = this.props;
    dispatch(initialize());
  }

  public render() {
    const { applicationState } = this.props;
    return <div className="Application">{applicationState}</div>;
  }
}

export default connect(mapStateToProps)(Application);
