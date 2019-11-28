import * as React from "react";

import { TranslationBase } from "@common/types";

import InPlaceEditableText from "@client/ui/components/InPlaceEditableText";

export enum ChildrenLocation {
  Left = "left",
  Right = "right"
}

interface ProvidedProps {
  children?: React.ReactNode | React.ReactNodeArray;
  childrenLocation: ChildrenLocation;
  translation: TranslationBase;
  onTranslationChanged: (translation: string) => Promise<void>;
}

type ComponentProps = ProvidedProps;

export default class TranslationDisplay extends React.PureComponent<
  ComponentProps
> {
  public render() {
    const { children, childrenLocation, translation } = this.props;

    return (
      <div>
        {childrenLocation === "left" && children}
        <InPlaceEditableText
          text={translation.text}
          onChange={this.onChanged}
        />
        {childrenLocation === "right" && children}
      </div>
    );
  }

  private onChanged = async (text: string) => {
    const { onTranslationChanged } = this.props;
    await onTranslationChanged(text);
  };
}
