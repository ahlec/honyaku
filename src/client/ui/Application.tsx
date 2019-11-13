import * as React from "react";
import { connect } from "react-redux";

import { ReduxDispatch, State } from "@client/redux";
import { ApplicationState } from "@client/redux/applicationState";
import { initialize } from "@client/redux/applicationState/actions";

import MainContent from "./MainContent";

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
    return <div className="Application">{this.renderMainContent()}</div>;
  }

  private renderMainContent(): React.ReactNode {
    const { applicationState } = this.props;
    switch (applicationState) {
      case ApplicationState.Initializing: {
        return "Loading...";
      }
      case ApplicationState.LoggedOut: {
        return "Please log in.";
      }
      case ApplicationState.Authenticated: {
        return <MainContent />;
      }
      case ApplicationState.Crashed: {
        return "Experienced an application crash.";
      }
    }
  }
}

export default connect(mapStateToProps)(Application);
