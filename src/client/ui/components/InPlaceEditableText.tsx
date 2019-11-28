import {
  ClickAwayListener,
  TextField,
  Theme,
  Typography
} from "@material-ui/core";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import * as React from "react";

import ErrorSnackbar from "./ErrorSnackbar";

interface ProvidedProps {
  text: string;
  onChange: (translation: string) => unknown | Promise<unknown>;
}

const styles = (theme: Theme) =>
  createStyles({
    textDisplay: {
      cursor: "pointer"
    }
  });

type ComponentProps = ProvidedProps & WithStyles<typeof styles>;

interface ComponentState {
  error: string | null;
  isEditing: boolean;
  isSaving: boolean;
  modifiedText: string;
}

class InPlaceEditableText extends React.PureComponent<
  ComponentProps,
  ComponentState
> {
  public state: ComponentState = {
    error: null,
    isEditing: false,
    isSaving: false,
    modifiedText: ""
  };

  public render() {
    const { classes, text } = this.props;
    const { error, isEditing, isSaving, modifiedText } = this.state;

    if (isEditing) {
      return (
        <React.Fragment>
          <ClickAwayListener onClickAway={this.onFinishEditing}>
            <TextField
              fullWidth
              disabled={isSaving}
              multiline
              value={modifiedText}
              onChange={this.onTextChange}
              onBlur={this.onFinishEditing}
            />
          </ClickAwayListener>
          {error && (
            <ErrorSnackbar error={error} onClose={this.onDismissError} />
          )}
        </React.Fragment>
      );
    }

    return (
      <Typography className={classes.textDisplay} onClick={this.onClickToEdit}>
        {text}
      </Typography>
    );
  }

  private onClickToEdit = () =>
    this.setState({
      error: null,
      isEditing: true,
      isSaving: false,
      modifiedText: this.props.text
    });

  private onTextChange = (e: React.ChangeEvent<{ value: string }>) => {
    if (this.state.isSaving) {
      return;
    }

    this.setState({ error: null, modifiedText: e.target.value });
  };

  private onDismissError = () => this.setState({ error: null });

  private onFinishEditing = async () => {
    if (this.state.isSaving) {
      return;
    }

    const { onChange, text } = this.props;
    const { modifiedText } = this.state;
    if (modifiedText === text) {
      this.setState({ error: null, isEditing: false, isSaving: false });
      return;
    }

    this.setState({ isSaving: true });
    try {
      await onChange(modifiedText);
      this.setState({ isEditing: false });
    } catch (e) {
      this.setState({
        error: e instanceof Error ? e.message : JSON.stringify(e)
      });
    } finally {
      this.setState({ isSaving: false });
    }
  };
}

export default withStyles(styles)(InPlaceEditableText);
