import {
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  Theme,
  Typography
} from "@material-ui/core";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import { ArrowForwardIos as SubcategoryArrowIcon } from "@material-ui/icons";
import classnames from "classnames";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { RadioGroup, Select, TextField } from "formik-material-ui";
import { orderBy, values as objectValues } from "lodash";
import memoizeOne from "memoize-one";
import * as React from "react";
import { connect } from "react-redux";

import { KanjiMarkupEndpoint } from "@common/endpoints";
import { KanjiMarkupServerResponse } from "@common/serverResponses";
import {
  Origin,
  OriginType,
  ProtoRecord,
  RecordSignificance,
  Source
} from "@common/types";

import { fetchApi } from "@client/api";
import { State } from "@client/redux";
import { OriginsLookup, OriginTypeLookup } from "@client/redux/origins";
import {
  getOriginsLookup,
  getOriginTypeLookup
} from "@client/redux/origins/selectors";
import { stringifyJapaneseMarkup } from "@common/japaneseMarkup";

import {
  ORIGIN_TYPE_DEFINITIONS,
  RECORD_SIGNIFICANCE_DEFINITIONS
} from "@client/i18n/enums";

const styles = (theme: Theme) =>
  createStyles({
    disabledArrowIcon: {
      opacity: 0.25
    },
    paper: {
      padding: theme.spacing(2)
    },
    root: {
      marginTop: theme.spacing(3)
    },
    subcontentArrow: {
      display: "block",
      margin: "auto",
      paddingTop: 12
    }
  });

const ALPHABETICAL_ORIGIN_TYPES = orderBy(
  objectValues(OriginType),
  type => ORIGIN_TYPE_DEFINITIONS[type].displayName
);

interface ProvidedProps {
  current: ProtoRecord | null;

  onSubmit: (record: ProtoRecord) => Promise<void>;
}

interface ReduxProps {
  originsLookup: OriginsLookup;
  originTypes: OriginTypeLookup;
}

function mapStateToProps(state: State): ReduxProps {
  return {
    originTypes: getOriginTypeLookup(state),
    originsLookup: getOriginsLookup(state)
  };
}

type ComponentProps = ProvidedProps & ReduxProps & WithStyles<typeof styles>;

interface FormValues {
  originId: string;
  originType: OriginType | "";
  rawJapaneseInput: string;
  significance: RecordSignificance;
  sourceChapterNo: string;
  sourceEpisodeNo: string;
  sourcePageNo: string;
  sourceSeasonNo: string;
  sourceUrl: string;
}

function doesOriginTypeHaveCustomFields(type: OriginType): boolean {
  switch (type) {
    case OriginType.Book:
    case OriginType.Manga:
    case OriginType.Anime:
    case OriginType.Website: {
      return true;
    }
    case OriginType.Game:
    case OriginType.News: {
      return false;
    }
  }
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

class RecordConfigureForm extends React.PureComponent<ComponentProps> {
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

  public render() {
    const { classes, current } = this.props;
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
    return (
      <Form>
        <Grid container spacing={3}>
          {this.renderOriginFields(formikProps)}

          <Grid item sm={12}>
            <Field
              name="rawJapaneseInput"
              label="Japanese"
              component={TextField}
            />
          </Grid>
          <FormControl component="fieldset">
            <FormLabel component="legend" required={true}>
              Significance
            </FormLabel>
            <Field
              name="significance"
              label="Significance"
              component={RadioGroup}
            >
              {objectValues(RecordSignificance).map(
                this.renderSignificanceChoice
              )}
            </Field>
          </FormControl>
          <Button
            disabled={!formikProps.isValid}
            color="primary"
            onClick={formikProps.submitForm}
          >
            Submit
          </Button>
        </Grid>
      </Form>
    );
  };

  private renderOriginFields(formikProps: FormikProps<FormValues>) {
    const { classes, originsLookup } = this.props;

    const { originId, originType } = formikProps.values;

    return (
      <React.Fragment>
        <Grid item sm={3}>
          <FormControl fullWidth>
            <InputLabel htmlFor="origin-type">Origin Type</InputLabel>
            <Field
              name="originType"
              component={Select}
              inputProps={{ id: "origin-type" }}
            >
              {ALPHABETICAL_ORIGIN_TYPES.map(this.renderOriginTypeChoice)}
            </Field>
          </FormControl>
        </Grid>
        <Grid item sm={1}>
          <SubcategoryArrowIcon
            className={classnames(
              classes.subcontentArrow,
              !originType && classes.disabledArrowIcon
            )}
          />
        </Grid>
        <Grid item sm={3}>
          <FormControl disabled={!originType} fullWidth>
            <InputLabel htmlFor="origin">Origin</InputLabel>
            <Field
              name="originId"
              component={Select}
              inputProps={{ id: "origin" }}
              disabled={!originType}
            >
              {originType &&
                originsLookup[originType].map(this.renderOriginChoice)}
            </Field>
          </FormControl>
        </Grid>
        <Grid item sm={1}>
          <SubcategoryArrowIcon
            className={classnames(
              classes.subcontentArrow,
              (!originType ||
                !originId ||
                !doesOriginTypeHaveCustomFields(originType)) &&
                classes.disabledArrowIcon
            )}
          />
        </Grid>
        <Grid item sm={3}>
          {!originType || !originId
            ? null
            : this.renderSourceDependentFields(formikProps.values.originId)}
        </Grid>
      </React.Fragment>
    );
  }

  private renderOriginTypeChoice = (originType: OriginType) => {
    const { originsLookup } = this.props;

    const numOrigins = originsLookup[originType].length;
    return (
      <MenuItem
        key={originType}
        value={originType.toString()}
        disabled={!numOrigins}
      >
        {ORIGIN_TYPE_DEFINITIONS[originType].displayName} ({numOrigins}{" "}
        {numOrigins === 1 ? "option" : "options"})
      </MenuItem>
    );
  };

  private renderOriginChoice = (origin: Origin) => {
    return (
      <MenuItem key={origin.id} value={origin.id.toString()}>
        {origin.title}
      </MenuItem>
    );
  };

  private renderSignificanceChoice = (significance: RecordSignificance) => {
    return (
      <FormControlLabel
        key={significance}
        value={significance}
        control={<Radio />}
        label={RECORD_SIGNIFICANCE_DEFINITIONS[significance].displayName}
      />
    );
  };

  private renderSourceDependentFields(originId: string) {
    const { originTypes } = this.props;
    const type = originTypes[originId];
    switch (type) {
      case OriginType.Book:
      case OriginType.Manga: {
        return (
          <React.Fragment>
            <Field
              name="sourceChapterNo"
              label="Chapter"
              type="number"
              component={TextField}
              inputProps={{ min: 1 }}
            />
            <Field
              name="sourcePageNo"
              label="Page Number"
              type="number"
              component={TextField}
              inputProps={{ min: 1 }}
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
              inputProps={{ min: 1 }}
            />
            <Field
              name="sourceEpisodeNo"
              label="Episode"
              type="number"
              component={TextField}
              inputProps={{ min: 1 }}
            />
          </React.Fragment>
        );
      }
      case OriginType.Website: {
        return <Field name="sourceUrl" label="URL" component={TextField} />;
      }
      default: {
        if (doesOriginTypeHaveCustomFields(type)) {
          throw new Error();
        }

        return <Typography>There are no further fields to set.</Typography>;
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
      const kanjiMarkupBody: KanjiMarkupEndpoint = {
        input: values.rawJapaneseInput
      };
      const { fragments } = await fetchApi<KanjiMarkupServerResponse>({
        body: kanjiMarkupBody,
        endpoint: "/kanji/markup"
      });

      const source = getSourceFromFormValues(values, originTypes);
      const next: ProtoRecord = {
        japaneseMarkup: stringifyJapaneseMarkup(fragments),
        significance: values.significance,
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

export default connect(mapStateToProps)(
  withStyles(styles)(RecordConfigureForm)
);
