import {
  Card,
  CardActions,
  CardContent,
  Container,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  IconButton,
  Paper,
  Theme,
  Typography
} from "@material-ui/core";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import {
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon
} from "@material-ui/icons";
import { memoize } from "lodash";
import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { State } from "@client/redux";
import { getOfficialTranslations } from "@client/redux/officialTranslations/selectors";
import { ReduxRecord } from "@client/redux/records";
import {
  ChronologicalOrder,
  getChronologicalUserTranslations
} from "@client/redux/userTranslations/selectors";
import { OfficialTranslation, UserTranslation } from "@common/types";

import JapaneseMarkupDisplay from "@client/ui/components/JapaneseMarkup";
import { getLinkToCreateOfficialTranslation } from "@client/ui/translation-create-edit/OfficialTranslationCreateRouteUnwrapper";
import { getLinkToCreateUserTranslation } from "@client/ui/translation-create-edit/UserTranslationCreateRouteUnwrapper";

const styles = (theme: Theme) =>
  createStyles({
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

type ComponentProps = ProvidedProps & ReduxProps & WithStyles<typeof styles>;

interface ComponentState {
  expandedUserTranslation: number | null;
}

class RecordView extends React.PureComponent<ComponentProps, ComponentState> {
  private readonly handleUserTranslationExpanded = memoize(
    (translationId: number) => (event: unknown, isExpanded: boolean) =>
      this.setState({
        expandedUserTranslation: isExpanded ? translationId : null
      })
  );

  public constructor(props: ComponentProps) {
    super(props);

    this.state = {
      expandedUserTranslation: props.userTranslations.length
        ? props.userTranslations[0].id
        : null
    };
  }

  public render() {
    const { classes, record } = this.props;
    return (
      <Container maxWidth="md">
        <Paper className={classes.japaneseContainer} square>
          <Typography variant="h3">
            <JapaneseMarkupDisplay japaneseMarkup={record.japaneseMarkup} />
          </Typography>
        </Paper>
        <Container maxWidth="sm">
          {this.renderOfficialTranslations()}
          {this.renderUserTranslations()}
        </Container>
      </Container>
    );
  }

  private renderOfficialTranslations() {
    const { classes, officialTranslations, record } = this.props;
    return (
      <Card className={classes.officialTranslationContainer}>
        <CardContent>
          <Typography variant="h5">
            Official{" "}
            {officialTranslations.length === 1 ? "Translation" : "Translations"}
          </Typography>
          {officialTranslations.map(this.renderOfficialTranslation)}
        </CardContent>
        <CardActions>
          <IconButton
            component={Link}
            to={getLinkToCreateOfficialTranslation(record)}
          >
            <AddIcon />
          </IconButton>
        </CardActions>
      </Card>
    );
  }

  private renderOfficialTranslation = (translation: OfficialTranslation) => (
    <Typography key={translation.id}>{translation.translation}</Typography>
  );

  private renderUserTranslations() {
    const { record, userTranslations } = this.props;
    return (
      <div>
        <Typography variant="h5">
          User {userTranslations.length === 1 ? "Translation" : "Translations"}
        </Typography>
        <div>{userTranslations.map(this.renderUserTranslation)}</div>
        <IconButton
          component={Link}
          to={getLinkToCreateUserTranslation(record)}
        >
          <AddIcon />
        </IconButton>
      </div>
    );
  }

  private renderUserTranslation = (translation: UserTranslation) => {
    const { classes } = this.props;
    const { expandedUserTranslation } = this.state;
    return (
      <ExpansionPanel
        key={translation.id}
        expanded={expandedUserTranslation === translation.id}
        onChange={this.handleUserTranslationExpanded(translation.id)}
      >
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.userTranslationHeader}>
            {translation.translation}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>{translation.comments}</ExpansionPanelDetails>
      </ExpansionPanel>
    );
  };
}

export default connect(mapStateToProps)(withStyles(styles)(RecordView));
