import * as React from "react";

import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import { Inbox as InboxIcon, Mail as MailIcon } from "@material-ui/icons";

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
            {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {["All mail", "Trash", "Spam"].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    );
  }
}

export default withStyles(styles)(SideDrawer);
