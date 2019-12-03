import { Container, Grid, Paper, Theme, Typography } from "@material-ui/core";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import * as React from "react";
import { connect } from "react-redux";

import { ReduxDispatch, State } from "@client/redux";
import { getOfficialTranslations } from "@client/redux/officialTranslations/selectors";
import { ReduxRecord } from "@client/redux/records";
import {
  ChronologicalOrder,
  getChronologicalUserTranslations
} from "@client/redux/userTranslations/selectors";
import { OfficialTranslation, UserTranslation } from "@common/types";

import JapaneseMarkupDisplay from "@client/ui/components/JapaneseMarkup";

import TranslationPanel from "./TranslationPanel";

const styles = (theme: Theme) =>
  createStyles({
    image: {
      maxWidth: "100%"
    },
    japaneseContainer: {
      marginBottom: theme.spacing(2),
      padding: theme.spacing(3),
      textAlign: "center"
    },
    officialTranslationContainer: {
      marginBottom: theme.spacing(6)
    },
    userTranslationHeader: {
      fontSize: theme.typography.pxToRem(15)
    }
  });

interface ProvidedProps {
  record: ReduxRecord;
}

interface ReduxProps {
  officialTranslations: ReadonlyArray<OfficialTranslation>;
  userTranslations: ReadonlyArray<UserTranslation>;
}

function mapStateToProps(state: State, { record }: ProvidedProps): ReduxProps {
  return {
    officialTranslations: getOfficialTranslations(state, record.id),
    userTranslations: getChronologicalUserTranslations(
      state,
      record.id,
      ChronologicalOrder.NewestFirst
    )
  };
}

type ComponentProps = ProvidedProps &
  ReduxProps &
  WithStyles<typeof styles> & { dispatch: ReduxDispatch };

class RecordView extends React.PureComponent<ComponentProps> {
  public render() {
    const {
      classes,
      dispatch,
      officialTranslations,
      record,
      userTranslations
    } = this.props;
    return (
      <Container maxWidth="md">
        <Paper className={classes.japaneseContainer} square>
          {record.imageUrl && (
            <img className={classes.image} src={record.imageUrl} />
          )}
          <Typography variant="h3">
            <JapaneseMarkupDisplay japaneseMarkup={record.japaneseMarkup} />
          </Typography>
        </Paper>
        <Grid container>
          <Grid item md={6}>
            <TranslationPanel
              dispatch={dispatch}
              recordId={record.id}
              layout="align-right"
              type="official"
              translations={officialTranslations}
            />
          </Grid>
          <Grid item md={6}>
            <TranslationPanel
              dispatch={dispatch}
              recordId={record.id}
              layout="align-left"
              type="user"
              translations={userTranslations}
            />
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(withStyles(styles)(RecordView));
