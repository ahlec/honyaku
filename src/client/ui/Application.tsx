import * as React from "react";
import { connect } from "react-redux";

import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";

import { ReduxDispatch, State } from "@client/redux";
import { ApplicationState } from "@client/redux/applicationState";
import { initialize } from "@client/redux/applicationState/actions";

import Header from "./application/Header";
import SideDrawer from "./application/SideDrawer";
import MainContent from "./MainContent";

const styles = createStyles({
  appRoot: {
    display: "flex",
    flexDirection: "column",
    height: "100vh"
  },
  contentRoot: {
    flex: 1,
    overflowX: "hidden",
    padding: 10
  }
});

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
} & WithStyles<typeof styles>;

interface ComponentState {
  /**
   * A boolean indicating whether or not the {@link SideDrawer} is
   * currently open or not.
   */
  isSideDrawerOpen: boolean;
}

class Application extends React.PureComponent<ComponentProps, ComponentState> {
  public state: ComponentState = {
    isSideDrawerOpen: false
  };

  public componentDidMount() {
    const { dispatch } = this.props;
    dispatch(initialize());
  }

  public render() {
    const { classes } = this.props;
    const { isSideDrawerOpen } = this.state;

    return (
      <div className={classes.appRoot}>
        <Header onOpenSideDrawer={this.onOpenSideDrawer} />
        <SideDrawer
          isOpen={isSideDrawerOpen}
          onClose={this.onCloseSideDrawer}
        />
        <div className={classes.contentRoot}>{this.renderMainContent()}</div>
      </div>
    );
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

  private onOpenSideDrawer = () => this.setState({ isSideDrawerOpen: true });

  private onCloseSideDrawer = () => this.setState({ isSideDrawerOpen: false });
}

export default connect(mapStateToProps)(withStyles(styles)(Application));
