import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio
} from "@material-ui/core";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { RadioGroup, TextField } from "formik-material-ui";
import memoizeOne from "memoize-one";
import * as React from "react";
import { connect } from "react-redux";

import { Origin, OriginType, Source } from "@common/types";

import { State } from "@client/redux";
import { OriginTypeLookup } from "@client/redux/origins";
import {
  getOriginsArray,
  getOriginTypeLookup
} from "@client/redux/origins/selectors";

import { ProtoRecord } from "./interfaces";

interface ProvidedProps {
  current: ProtoRecord | null;

  onSubmit: (record: ProtoRecord) => Promise<void>;
}

interface ReduxProps {
  origins: ReadonlyArray<Origin>;
  originTypes: OriginTypeLookup;
}

function mapStateToProps(state: State): ReduxProps {
  return {
    originTypes: getOriginTypeLookup(state),
    origins: getOriginsArray(state)
  };
}

type ComponentProps = ProvidedProps & ReduxProps;

interface FormValues {
  japanese: string;
  originId: string;
  sourceChapterNo: string;
  sourceEpisodeNo: string;
  sourcePageNo: string;
  sourceSeasonNo: string;
}

function getSourceFromFormValues(
  values: FormValues,
  originTypes: OriginTypeLookup
): Source {
  const originType = originTypes[values.originId];
  switch (originType) {
    case OriginType.Book:
    case OriginType.Manga: {
      return {
        chapterNo: parseInt(values.sourceChapterNo, 10),
        originId: parseInt(values.originId, 10),
        pageNo: parseInt(values.sourcePageNo, 10),
        type: originType
      };
    }
    case OriginType.Anime: {
      return {
        episodeNo: parseInt(values.sourceEpisodeNo, 10),
        originId: parseInt(values.originId, 10),
        seasonNo: parseInt(values.sourceSeasonNo, 10),
        type: originType
      };
    }
    case OriginType.Game:
    case OriginType.News: {
      return {
        originId: parseInt(values.originId, 10),
        type: originType
      };
    }
  }
}

class RecordConfigureForm extends React.PureComponent<ComponentProps> {
  private readonly getInitialValues = memoizeOne(
    (
      current: ProtoRecord | null,
      origins: ReadonlyArray<Origin>
    ): FormValues => {
      let sourceChapterNo = 0;
      let sourceEpisodeNo = 0;
      let sourcePageNo = 0;
      let sourceSeasonNo = 0;
      if (current) {
        switch (current.source.type) {
          case OriginType.Book:
          case OriginType.Manga: {
            sourceChapterNo = current.source.chapterNo;
            sourcePageNo = current.source.pageNo;
            break;
          }
          case OriginType.Anime: {
            sourceEpisodeNo = current.source.episodeNo;
            sourceSeasonNo = current.source.seasonNo;
            break;
          }
        }
      }

      return {
        japanese:
          (current && current.japanese && current.japanese.kanjiOnly) || "",
        originId: (current
          ? current.source.originId
          : origins[0].id
        ).toString(),
        sourceChapterNo: sourceChapterNo.toString(),
        sourceEpisodeNo: sourceEpisodeNo.toString(),
        sourcePageNo: sourcePageNo.toString(),
        sourceSeasonNo: sourceSeasonNo.toString()
      };
    }
  );

  public render() {
    const { current, origins } = this.props;
    return (
      <div className="RecordConfigureForm">
        <Formik<FormValues>
          initialValues={this.getInitialValues(current, origins)}
          onSubmit={this.onSubmit}
        >
          {this.renderForm}
        </Formik>
      </div>
    );
  }

  private renderForm = (props: FormikProps<FormValues>) => {
    const { origins } = this.props;

    return (
      <Form>
        <FormControl component="fieldset">
          <FormLabel component="legend" required={true}>
            Source
          </FormLabel>
          <Field name="originId" label="Origin" component={RadioGroup}>
            {origins.map(this.renderOriginChoice)}
          </Field>
          {this.renderSourceDependentFields(props.values.originId)}
        </FormControl>
        <Field name="japanese" label="Japanese" component={TextField} />
        <Button
          disabled={!props.isValid}
          color="primary"
          onClick={props.submitForm}
        >
          Submit
        </Button>
      </Form>
    );
  };

  private renderOriginChoice = (origin: Origin) => {
    return (
      <FormControlLabel
        key={origin.id}
        value={origin.id.toString()}
        control={<Radio />}
        label={origin.title}
      />
    );
  };

  private renderSourceDependentFields(originId: string) {
    const { originTypes } = this.props;
    const type = originTypes[originId];
    switch (type) {
      case OriginType.Game:
      case OriginType.News: {
        return null;
      }
      case OriginType.Book:
      case OriginType.Manga: {
        return (
          <React.Fragment>
            <Field
              name="sourceChapterNo"
              label="Chapter"
              type="number"
              component={TextField}
            />
            <Field
              name="sourcePageNo"
              label="Page Number"
              type="number"
              component={TextField}
            />
          </React.Fragment>
        );
      }
      case OriginType.Anime: {
        return (
          <React.Fragment>
            <Field
              name="sourceSeasonNo"
              label="Season"
              type="number"
              component={TextField}
            />
            <Field
              name="sourceEpisodeNo"
              label="Episode"
              type="number"
              component={TextField}
            />
          </React.Fragment>
        );
      }
    }
  }

  private onSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    const { onSubmit, originTypes } = this.props;
    actions.setSubmitting(true);

    try {
      const source = getSourceFromFormValues(values, originTypes);
      const next: ProtoRecord = {
        japanese: {
          kanaOnly: values.japanese,
          kanjiOnly: values.japanese,
          markup: values.japanese
        },
        source
      };

      await onSubmit(next);
    } catch (e) {
      actions.setStatus(e.message);
    } finally {
      actions.setSubmitting(false);
    }
  };
}

export default connect(mapStateToProps)(RecordConfigureForm);
