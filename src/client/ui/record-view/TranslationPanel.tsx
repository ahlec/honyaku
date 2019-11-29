import { Typography, IconButton } from "@material-ui/core";
import { AddCircleOutline as AddCircleOutlineIcon } from "@material-ui/icons";
import { memoize, startCase } from "lodash";
import * as React from "react";

import { OfficialTranslation, UserTranslation } from "@common/types";

import { ReduxDispatch } from "@client/redux";
import { changeOfficialTranslationText } from "@client/redux/officialTranslations/actions";
import { changeUserTranslationText } from "@client/redux/userTranslations/actions";

import CreateTranslationForm from "./CreateTranslationForm";
import TranslationDisplay, { ChildrenLocation } from "./TranslationDisplay";

type ComponentProps = {
  layout: "align-left" | "align-right";
  dispatch: ReduxDispatch;
  recordId: number;
} & (
  | {
      type: "official";
      translations: ReadonlyArray<OfficialTranslation>;
    }
  | { type: "user"; translations: ReadonlyArray<UserTranslation> }
);

interface ComponentState {
  isAddingNewTranslation: boolean;
}

export default class TranslationPanel extends React.PureComponent<
  ComponentProps,
  ComponentState
> {
  public state: ComponentState = {
    isAddingNewTranslation: false
  };

  private readonly onUserTranslationChanged = memoize(
    (translationId: number) => (translation: string) => {
      const { dispatch, recordId } = this.props;
      return dispatch(
        changeUserTranslationText(recordId, translationId, translation)
      );
    }
  );

  private readonly onOfficialTranslationChanged = memoize(
    (translationId: number) => (translation: string) => {
      const { dispatch, recordId } = this.props;
      return dispatch(
        changeOfficialTranslationText(recordId, translationId, translation)
      );
    }
  );

  private get translationChildrenLocation(): ChildrenLocation {
    switch (this.props.layout) {
      case "align-left": {
        return ChildrenLocation.Left;
      }
      case "align-right": {
        return ChildrenLocation.Right;
      }
    }
  }

  public render() {
    const { dispatch, recordId, translations, type } = this.props;
    const { isAddingNewTranslation } = this.state;
    return (
      <div>
        <Typography variant="h5">
          {startCase(type)}{" "}
          {translations.length === 1 ? "Translation" : "Translations"}
        </Typography>
        {this.props.type === "user"
          ? this.props.translations.map(this.renderUserTranslation)
          : this.props.translations.map(this.renderOfficialTranslation)}
        {isAddingNewTranslation ? (
          <CreateTranslationForm
            dispatch={dispatch}
            onCloseRequested={this.onCloseCreateFormRequested}
            recordId={recordId}
            type={type}
          />
        ) : (
          <IconButton color="inherit" onClick={this.onClickAddTranslation}>
            <AddCircleOutlineIcon />
          </IconButton>
        )}
      </div>
    );
  }

  private renderUserTranslation = (translation: UserTranslation) => {
    return (
      <TranslationDisplay
        key={translation.id}
        childrenLocation={this.translationChildrenLocation}
        translation={translation}
        onTranslationChanged={this.onUserTranslationChanged(translation.id)}
      />
    );
  };

  private renderOfficialTranslation = (translation: OfficialTranslation) => {
    return (
      <TranslationDisplay
        key={translation.id}
        childrenLocation={this.translationChildrenLocation}
        translation={translation}
        onTranslationChanged={this.onOfficialTranslationChanged(translation.id)}
      />
    );
  };

  private onClickAddTranslation = () =>
    this.setState({ isAddingNewTranslation: true });

  private onCloseCreateFormRequested = () =>
    this.setState({ isAddingNewTranslation: false });
}
