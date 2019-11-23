import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Typography
} from "@material-ui/core";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import { ArrowForwardIos as SubcategoryArrowIcon } from "@material-ui/icons";
import classnames from "classnames";
import { connect as connectFormik, Field, FormikContextType } from "formik";
import { TextField } from "formik-material-ui";
import { memoize, orderBy, values as objectValues } from "lodash";
import * as React from "react";
import { connect as connectReactRedux } from "react-redux";

import { Origin, OriginType } from "@common/types";

import { State } from "@client/redux";
import { OriginsLookup, OriginTypeLookup } from "@client/redux/origins";
import {
  getOriginsLookup,
  getOriginTypeLookup
} from "@client/redux/origins/selectors";

import { ORIGIN_TYPE_DEFINITIONS } from "@client/i18n/enums";

import { FormValues } from "./shared";
import SideEffectSelect from "./SideEffectSelect";

const styles = createStyles({
  disabledArrowIcon: {
    opacity: 0.25
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

type PropsWithoutFormik = ReduxProps & WithStyles<typeof styles>;
type ComponentProps = PropsWithoutFormik & {
  formik: FormikContextType<FormValues>;
};

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

class SourceFields extends React.PureComponent<ComponentProps> {
  private readonly getOrderedOrigins = memoize(
    (origins: ReadonlyArray<Origin>): ReadonlyArray<Origin> =>
      orderBy(origins, origin => origin.title)
  );

  public render() {
    const { classes, formik, originsLookup } = this.props;

    const { originId, originType } = formik.values;

    return (
      <React.Fragment>
        <Grid item sm={3}>
          <FormControl fullWidth>
            <InputLabel htmlFor="origin-type">Origin Type</InputLabel>
            <Field
              name="originType"
              component={SideEffectSelect}
              inputProps={{ id: "origin-type" }}
              onChange={this.onChangeOriginType}
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
              component={SideEffectSelect}
              inputProps={{ id: "origin" }}
              disabled={!originType}
              onChange={this.onChangeOriginId}
            >
              {originType &&
                this.getOrderedOrigins(originsLookup[originType]).map(
                  this.renderOriginChoice
                )}
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
          {!originType || !originId ? null : this.renderSourceDependentFields()}
        </Grid>
      </React.Fragment>
    );
  }

  private onChangeOriginType = (
    event: React.ChangeEvent<{ value: OriginType }>
  ) => {
    const {
      formik: {
        setFieldValue,
        values: { originType }
      }
    } = this.props;

    if (originType === event.target.value) {
      return;
    }

    setFieldValue("originType", event.target.value);
    setFieldValue("originId", "");
    this.resetDependentFields();
  };

  private onChangeOriginId = (event: React.ChangeEvent<{ value: string }>) => {
    const {
      formik: {
        setFieldValue,
        values: { originId }
      }
    } = this.props;

    if (originId === event.target.value) {
      return;
    }

    setFieldValue("originId", event.target.value);
    this.resetDependentFields();
  };

  private resetDependentFields() {
    const {
      formik: { setFieldValue }
    } = this.props;

    setFieldValue("sourceChapterNo", "");
    setFieldValue("sourceEpisodeNo", "");
    setFieldValue("sourcePageNo", "");
    setFieldValue("sourceSeasonNo", "");
    setFieldValue("sourceUrl", "");
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

  private renderSourceDependentFields() {
    const {
      formik: {
        values: { originId }
      },
      originTypes
    } = this.props;
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
}

export default connectReactRedux(mapStateToProps)(
  withStyles(styles)(connectFormik<PropsWithoutFormik>(SourceFields))
);
