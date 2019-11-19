import * as React from "react";
import { Link } from "react-router-dom";

import {
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography
} from "@material-ui/core";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import { NavigateNext as NavigateNextIcon } from "@material-ui/icons";

import JapaneseMarkupDisplay from "@client/ui/components/JapaneseMarkup";
import { getLinkToRecordView } from "@client/ui/record-view/RecordRouteUnwrapper";
import { Record } from "@common/types";

const styles = createStyles({
  fullViewLinkButton: {
    marginLeft: "auto"
  },
  root: {
    flex: 1
  }
});

interface ProvidedProps {
  record: Record;
}

type ComponentProps = ProvidedProps & WithStyles<typeof styles>;

class RecordCard extends React.PureComponent<ComponentProps> {
  public render() {
    const { record, classes } = this.props;
    return (
      <Card className={classes.root}>
        <CardContent>
          <Typography variant="body2" color="textSecondary">
            <JapaneseMarkupDisplay japaneseMarkup={record.japaneseMarkup} />
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton
            className={classes.fullViewLinkButton}
            component={Link}
            to={getLinkToRecordView(record)}
          >
            <NavigateNextIcon />
          </IconButton>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(RecordCard);
