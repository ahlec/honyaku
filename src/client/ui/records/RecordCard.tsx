import * as React from "react";
import { Link } from "react-router-dom";

import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Typography
} from "@material-ui/core";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import { NavigateNext as NavigateNextIcon } from "@material-ui/icons";

import { getLinkToRecordView } from "@client/ui/record-view/RecordRouteUnwrapper";
import { Record } from "@common/types";

const styles = createStyles({
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
        <CardHeader
          action={
            <IconButton component={Link} to={getLinkToRecordView(record)}>
              <NavigateNextIcon />
            </IconButton>
          }
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            This impressive paella is a perfect party dish and a fun meal to
            cook together with your guests. Add 1 cup of frozen peas along with
            the mussels, if you like.
          </Typography>
        </CardContent>
        <CardActions disableSpacing>Filtering TBD</CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(RecordCard);
