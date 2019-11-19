import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio
} from "@material-ui/core";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { RadioGroup, TextField } from "formik-material-ui";
import { values as objectValues } from "lodash";
import * as React from "react";

import {
  ProtoOfficialTranslation,
  ProtoUserTranslation,
  TranslationConfidence
} from "@common/types";

type ProvidedProps =
  | {
      translationType: "user";
      current: ProtoUserTranslation | null;
      onSubmit: (proto: ProtoUserTranslation) => Promise<void>;
    }
  | {
      translationType: "official";
      current: ProtoOfficialTranslation | null;
      onSubmit: (proto: ProtoOfficialTranslation) => Promise<void>;
    };

type ComponentProps = ProvidedProps;

interface FormValues {
  translation: string;
  confidence: TranslationConfidence;
  comments: string;
}

export default class TranslationConfigureForm extends React.PureComponent<
  ComponentProps
> {
  private get initialValues(): FormValues {
    switch (this.props.translationType) {
      case "user": {
        const { current } = this.props;
        return {
          comments: (current && current.comments) || "",
          confidence:
            (current && current.confidence) || TranslationConfidence.Confident,
          translation: (current && current.translation) || ""
        };
      }
      case "official": {
        const { current } = this.props;
        return {
          comments: (current && current.comments) || "",
          confidence: TranslationConfidence.Confident,
          translation: (current && current.translation) || ""
        };
      }
    }
  }

  public render() {
    return (
      <div className="TranslationConfigureForm">
        <Formik<FormValues>
          initialValues={this.initialValues}
          onSubmit={this.onSubmit}
        >
          {this.renderForm}
        </Formik>
      </div>
    );
  }

  private renderForm = (props: FormikProps<FormValues>) => {
    const { translationType } = this.props;

    return (
      <Form>
        <Field name="translation" label="Translation" component={TextField} />
        <Field name="comments" label="Comments" component={TextField} />
        {translationType === "user" && (
          <FormControl component="fieldset">
            <FormLabel component="legend" required={true}>
              Confidence
            </FormLabel>
            <Field name="confidence" label="Confidence" component={RadioGroup}>
              {objectValues(TranslationConfidence).map(
                this.renderConfidenceChoice
              )}
            </Field>
          </FormControl>
        )}
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

  private renderConfidenceChoice = (confidence: TranslationConfidence) => {
    return (
      <FormControlLabel
        key={confidence}
        value={confidence}
        control={<Radio />}
        label={confidence}
      />
    );
  };

  private onSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    actions.setSubmitting(true);

    try {
      switch (this.props.translationType) {
        case "user": {
          const { onSubmit } = this.props;
          await onSubmit({
            comments: values.comments,
            confidence: values.confidence,
            translation: values.translation
          });
          break;
        }
        case "official": {
          const { onSubmit } = this.props;
          await onSubmit({
            comments: values.comments,
            translation: values.translation
          });
          break;
        }
      }
    } catch (e) {
      actions.setStatus(e.message);
    } finally {
      actions.setSubmitting(false);
    }
  };
}
