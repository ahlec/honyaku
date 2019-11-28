import {
  IconButton,
  Snackbar,
  SnackbarContent,
  Theme
} from "@material-ui/core";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import { Close as CloseIcon, Error as ErrorIcon } from "@material-ui/icons";
import * as React from "react";

interface ProvidedProps {
  error: string;
  onClose: () => void;
}

const styles = (theme: Theme) =>
  createStyles({
    closeIcon: {
      fontSize: 20
    },
    content: {
      backgroundColor: theme.palette.error.dark
    },
    errorIcon: {
      fontSize: 20,
      marginRight: theme.spacing(1),
      opacity: 0.9
    },
    message: {
      alignItems: "center",
      display: "flex"
    }
  });

type ComponentProps = ProvidedProps & WithStyles<typeof styles>;

class ErrorSnackbar extends React.PureComponent<ComponentProps> {
  public render() {
    const { classes, error } = this.props;

    return (
      <Snackbar
        anchorOrigin={{
          horizontal: "left",
          vertical: "bottom"
        }}
        open={true}
        autoHideDuration={30000}
        onClose={this.onClose}
      >
        <SnackbarContent
          className={classes.content}
          message={
            <span className={classes.message}>
              <ErrorIcon className={classes.errorIcon} />
              {error}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="close"
              color="inherit"
              onClick={this.onClose}
            >
              <CloseIcon className={classes.closeIcon} />
            </IconButton>
          ]}
        />
      </Snackbar>
    );
  }

  private onClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    this.props.onClose();
  };
}

export default withStyles(styles)(ErrorSnackbar);
