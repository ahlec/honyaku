import {
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio
} from "@material-ui/core";
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  HighlightOff as HighlightOffIcon
} from "@material-ui/icons";
import {
  Field,
  Form,
  Formik,
  FormikErrors,
  FormikHelpers,
  FormikProps
} from "formik";
import { RadioGroup, TextField } from "formik-material-ui";
import { values as objectValues } from "lodash";
import * as React from "react";

import { TranslationConfidence } from "@common/types";
import { ReduxDispatch } from "@client/redux";
import { createUserTranslation } from "@client/redux/userTranslations/actions";
import { createOfficialTranslation } from "@client/redux/officialTranslations/actions";

interface ComponentProps {
  dispatch: ReduxDispatch;
  type: "user" | "official";
  recordId: number;
  onCloseRequested: () => void;
}

interface FormValues {
  text: string;
  confidence: TranslationConfidence;
  comments: string;
}

const INITIAL_VALUES: FormValues = {
  text: "",
  confidence: TranslationConfidence.Confident,
  comments: ""
};

export default class CreateTranslationForm extends React.PureComponent<
  ComponentProps
> {
  private isUnmounted = false;

  public componentWillUnmount() {
    this.isUnmounted = true;
  }

  public render() {
    return (
      <Formik<FormValues>
        initialValues={INITIAL_VALUES}
        onSubmit={this.onSubmit}
        validate={this.validateForm}
      >
        {this.renderForm}
      </Formik>
    );
  }

  private validateForm = (values: FormValues): FormikErrors<FormValues> => {
    const errors: FormikErrors<FormValues> = {};

    if (!values.text || !values.text.trim()) {
      errors.text = "Text cannot be empty.";
    }

    return errors;
  };

  private renderForm = (props: FormikProps<FormValues>) => {
    const { type } = this.props;

    return (
      <Form>
        <Field
          name="text"
          label="Translation"
          component={TextField}
          multiline
          fullWidth
        />
        {type === "user" && (
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
        <IconButton disabled={!props.isValid} onClick={props.submitForm}>
          <CheckCircleOutlineIcon />
        </IconButton>
        <IconButton onClick={this.onCancelClicked}>
          <HighlightOffIcon />
        </IconButton>
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

  private onCancelClicked = () => {
    const { onCloseRequested } = this.props;
    onCloseRequested();
  };

  private onSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    const { dispatch, onCloseRequested, recordId } = this.props;

    actions.setSubmitting(true);

    try {
      switch (this.props.type) {
        case "user": {
          await dispatch(
            createUserTranslation(recordId, {
              comments: values.comments,
              confidence: values.confidence,
              text: values.text
            })
          );
          break;
        }
        case "official": {
          await dispatch(
            createOfficialTranslation(recordId, {
              comments: values.comments,
              text: values.text
            })
          );
          break;
        }
      }

      onCloseRequested();
    } catch (e) {
      if (!this.isUnmounted) {
        actions.setStatus(e.message);
      }
    } finally {
      if (!this.isUnmounted) {
        actions.setSubmitting(false);
      }
    }
  };
}
