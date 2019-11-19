import memoizeOne from "memoize-one";
import * as React from "react";

import {
  JapaneseTextFragment,
  parseJapaneseMarkup
} from "@common/japaneseMarkup";

interface ProvidedProps {
  japaneseMarkup: string;
}

type ComponentProps = ProvidedProps;

export default class JapaneseMarkupDisplay extends React.PureComponent<
  ComponentProps
> {
  private readonly getFragmentsFromMarkup = memoizeOne(
    (japaneseMarkup: string): ReadonlyArray<JapaneseTextFragment> =>
      parseJapaneseMarkup(japaneseMarkup)
  );

  public render() {
    const fragments = this.getFragmentsFromMarkup(this.props.japaneseMarkup);
    return fragments.map(this.renderTextFragment);
  }

  private renderTextFragment = (
    { text, yomigana }: JapaneseTextFragment,
    index: number
  ) => {
    return (
      <ruby key={index}>
        {text}
        {yomigana && (
          <React.Fragment>
            <rp>(</rp>
            <rt>{yomigana}</rt>
            <rp>)</rp>
          </React.Fragment>
        )}
      </ruby>
    );
  };
}
