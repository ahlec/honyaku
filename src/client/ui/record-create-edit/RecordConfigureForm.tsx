import {
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Theme
} from "@material-ui/core";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { Select, TextField } from "formik-material-ui";
import { values as objectValues } from "lodash";
import memoizeOne from "memoize-one";
import * as React from "react";
import { Redirect } from "react-router-dom";

import { KanjiMarkupEndpoint } from "@common/endpoints";
import { stringifyJapaneseMarkup } from "@common/japaneseMarkup";
import { KanjiMarkupServerResponse } from "@common/serverResponses";
import {
  OriginType,
  ProtoRecord,
  RecordSignificance,
  Source
} from "@common/types";

import { fetchApi } from "@client/api";
import { RECORD_SIGNIFICANCE_DEFINITIONS } from "@client/i18n/enums";
import { getLinkToRecordView } from "@client/ui/record-view/RecordRouteUnwrapper";

import { FormValues } from "./shared";
import SourceFields from "./SourceFields";

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2)
    },
    root: {
      marginTop: theme.spacing(3)
    }
  });

type RecordId = number;

interface ProvidedProps {
  current: ProtoRecord | null;

  onSubmit: (record: ProtoRecord) => Promise<RecordId>;
}

type ComponentProps = ProvidedProps & WithStyles<typeof styles>;

function getSourceFromFormValues(values: FormValues): Source {
  const { originType } = values;
  if (!originType) {
    throw new Error();
  }

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
    case OriginType.Website: {
      return {
        originId: parseInt(values.originId, 10),
        type: originType,
        url: values.sourceUrl
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

interface ComponentState {
  redirectRecordId: number | null;
}

class RecordConfigureForm extends React.PureComponent<
  ComponentProps,
  ComponentState
> {
  public state: ComponentState = {
    redirectRecordId: null
  };
  private hasUnmounted = false;

  private readonly getInitialValues = memoizeOne(
    (current: ProtoRecord | null): FormValues => {
      let originId: string | null = null;
      let originType: OriginType | "" = "";
      let sourceChapterNo = 0;
      let sourceEpisodeNo = 0;
      let sourcePageNo = 0;
      let sourceSeasonNo = 0;
      let sourceUrl: string | null = null;

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
          case OriginType.Website: {
            sourceUrl = current.source.url;
            break;
          }
        }

        originId = current.source.originId.toString();
        originType = current.source.type;
      }

      return {
        createAnother: false,
        originId: originId || "",
        originType,
        rawJapaneseInput: (current && current.japaneseMarkup) || "",
        significance:
          (current && current.significance) || RecordSignificance.Difficult,
        sourceChapterNo: sourceChapterNo.toString(),
        sourceEpisodeNo: sourceEpisodeNo.toString(),
        sourcePageNo: sourcePageNo.toString(),
        sourceSeasonNo: sourceSeasonNo.toString(),
        sourceUrl: sourceUrl || ""
      };
    }
  );

  public componentWillUnmount() {
    this.hasUnmounted = true;
  }

  public render() {
    const { classes, current } = this.props;
    const { redirectRecordId } = this.state;

    if (redirectRecordId !== null) {
      return <Redirect to={getLinkToRecordView(redirectRecordId)} />;
    }

    return (
      <Container className={classes.root} fixed maxWidth="md">
        <Paper className={classes.paper}>
          <Formik<FormValues>
            initialValues={this.getInitialValues(current)}
            onSubmit={this.onSubmit}
          >
            {this.renderForm}
          </Formik>
        </Paper>
      </Container>
    );
  }

  private renderForm = (formikProps: FormikProps<FormValues>) => {
    const onChangeCreateAnother = React.useCallback(
      (e: React.ChangeEvent<{}>, checked: boolean) => {
        formikProps.setFieldValue("createAnother", checked);
      },
      [formikProps]
    );

    return (
      <Form>
        <Grid container spacing={3}>
          <SourceFields />
          <Grid item sm={12}>
            <Field
              name="rawJapaneseInput"
              label="Japanese"
              component={TextField}
              multiline
              rows={3}
              fullWidth
            />
          </Grid>

          <Grid item sm={3}>
            <FormControl fullWidth>
              <InputLabel htmlFor="significance">Significance</InputLabel>
              <Field
                name="significance"
                component={Select}
                inputProps={{ id: "significance" }}
              >
                {objectValues(RecordSignificance).map(
                  this.renderSignificanceChoice
                )}
              </Field>
            </FormControl>
          </Grid>
          <Grid item sm={9} />

          <Grid item sm={3}>
            <Button
              disabled={!formikProps.isValid}
              color="primary"
              onClick={formikProps.submitForm}
            >
              Submit
            </Button>
          </Grid>
          <Grid item sm={9}>
            <FormControlLabel
              control={<Field name="createAnother" component={Checkbox} />}
              label="Create another record"
              name="createAnother"
              onChange={onChangeCreateAnother}
            />
          </Grid>
        </Grid>
      </Form>
    );
  };

  private renderSignificanceChoice = (significance: RecordSignificance) => {
    return (
      <MenuItem key={significance} value={significance}>
        {RECORD_SIGNIFICANCE_DEFINITIONS[significance].displayName}
      </MenuItem>
    );
  };

  private onSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    const { onSubmit } = this.props;
    actions.setSubmitting(true);

    try {
      const kanjiMarkupBody: KanjiMarkupEndpoint = {
        input: values.rawJapaneseInput
      };
      const { fragments } = await fetchApi<KanjiMarkupServerResponse>({
        body: kanjiMarkupBody,
        endpoint: "/kanji/markup"
      });

      const source = getSourceFromFormValues(values);
      const next: ProtoRecord = {
        japaneseMarkup: stringifyJapaneseMarkup(fragments),
        significance: values.significance,
        source
      };

      const recordId = await onSubmit(next);

      if (values.createAnother) {
        actions.setFieldValue("rawJapaneseInput", "");
      } else {
        this.setState({ redirectRecordId: recordId });
      }
    } catch (e) {
      actions.setStatus(e.message);
    } finally {
      if (!this.hasUnmounted) {
        actions.setSubmitting(false);
      }
    }
  };
}

export default withStyles(styles)(RecordConfigureForm);
