import * as React from "react";

import { InputBase } from "@material-ui/core";
import {
  createStyles,
  fade,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import { Search as SearchIcon } from "@material-ui/icons";

const styles = (theme: Theme) =>
  createStyles({
    container: {
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25)
      },
      backgroundColor: fade(theme.palette.common.white, 0.15),
      borderRadius: theme.shape.borderRadius,
      marginLeft: 0,
      marginRight: theme.spacing(2),
      position: "relative",
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto"
      }
    },
    icon: {
      alignItems: "center",
      display: "flex",
      height: "100%",
      justifyContent: "center",
      pointerEvents: "none",
      position: "absolute",
      width: theme.spacing(7)
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: 200
      }
    },
    inputRoot: {
      color: "inherit"
    }
  });

type ComponentProps = WithStyles<typeof styles>;

class Search extends React.PureComponent<ComponentProps> {
  public render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <div className={classes.icon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Search…"
          classes={{
            input: classes.inputInput,
            root: classes.inputRoot
          }}
          inputProps={{ "aria-label": "search" }}
        />
      </div>
    );
  }
}

export default withStyles(styles)(Search);
