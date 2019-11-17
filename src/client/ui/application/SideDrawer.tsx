import * as React from "react";
import { Link } from "react-router-dom";

import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import { Add as AddIcon, Home as HomeIcon } from "@material-ui/icons";

import { ROUTE_PATH as CREATE_RECORD_ROUTE_PATH } from "@client/ui/record-create-edit/RecordCreateRouteUnwrapper";

const styles = createStyles({
  fullList: {
    width: "auto"
  },
  list: {
    width: 250
  }
});

interface ProvidedProps {
  /**
   * A boolean representing whether the drawer is currently open
   * or not.
   */
  isOpen: boolean;

  /**
   * A callback that will be called when the drawer is currently
   * open and is indicating that it should now be closed.
   */
  onClose: () => void;
}

type ComponentProps = ProvidedProps & WithStyles<typeof styles>;

class SideDrawer extends React.PureComponent<ComponentProps> {
  public render() {
    const { classes, isOpen, onClose } = this.props;

    return (
      <Drawer anchor="left" open={isOpen} onClose={onClose}>
        <div className={classes.list} role="presentation">
          <List>
            <ListItem button component={Link} to="/" onClick={onClose}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem
              button
              component={Link}
              to={CREATE_RECORD_ROUTE_PATH}
              onClick={onClose}
            >
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="Add Record" />
            </ListItem>
          </List>
        </div>
      </Drawer>
    );
  }
}

export default withStyles(styles)(SideDrawer);
