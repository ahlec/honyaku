import { Typography } from "@material-ui/core";
import { memoize, startCase } from "lodash";
import * as React from "react";

import { OfficialTranslation, UserTranslation } from "@common/types";

import { ReduxDispatch } from "@client/redux";
import { changeOfficialTranslationText } from "@client/redux/officialTranslations/actions";
import { changeUserTranslationText } from "@client/redux/userTranslations/actions";

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

export default class TranslationPanel extends React.PureComponent<
  ComponentProps
> {
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
    const { translations, type } = this.props;
    return (
      <div>
        <Typography variant="h5">
          {startCase(type)}{" "}
          {translations.length === 1 ? "Translation" : "Translations"}
        </Typography>
        {this.props.type === "user"
          ? this.props.translations.map(this.renderUserTranslation)
          : this.props.translations.map(this.renderOfficialTranslation)}
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
}
