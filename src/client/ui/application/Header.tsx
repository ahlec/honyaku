import * as React from "react";

import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import { Menu as MenuIcon } from "@material-ui/icons";

import Search from "./Search";

const styles = (theme: Theme) =>
  createStyles({
    drawerButton: {
      marginRight: theme.spacing(2)
    }
  });

interface ProvidedProps {
  /**
   * A callback to be called when the user has requested to open
   * the {@link SideDrawer}.
   */
  onOpenSideDrawer: () => void;
}

type ComponentProps = ProvidedProps & WithStyles<typeof styles>;

class Header extends React.PureComponent<ComponentProps> {
  public render() {
    const { classes, onOpenSideDrawer } = this.props;

    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.drawerButton}
            color="inherit"
            aria-label="open drawer"
            onClick={onOpenSideDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            翻訳: Translation Notebook
          </Typography>
          <Search />
          <div style={{ flexGrow: 1 }} />
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(Header);
