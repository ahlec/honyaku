import { memoize } from "lodash";
import memoizeOne from "memoize-one";
import * as React from "react";

import { Chip, Divider, IconButton, Menu, MenuItem } from "@material-ui/core";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import { FilterList as FilterListIcon } from "@material-ui/icons";

import { Record } from "@common/types";

import {
  FiltersCollection,
  getFiltersCollection,
  RecordFilter
} from "./filters";

const styles = createStyles({
  root: {
    padding: 5
  }
});

interface ProvidedProps {
  /**
   * An array of all of the {@link Record}s that should be
   * considered.
   */
  allRecords: ReadonlyArray<Record>;

  /**
   * A list of any optional filters that should be used
   * in narrowing the list of {@link allRecords}.
   */
  filters: ReadonlyArray<RecordFilter>;

  /**
   * A callback that will be called when the list of user-selected
   * filters has been updated. The parameter to this callback will
   * always be a new reference to an array rather than an existing
   * one, in order to support shallow equality invalidation within
   * React.
   */
  onFiltersChanged: (filters: ReadonlyArray<RecordFilter>) => void;
}

type ComponentProps = ProvidedProps & WithStyles<typeof styles>;

interface ComponentState {
  filterMenuAnchorEl: Element | null;
}

class FilterBar extends React.PureComponent<ComponentProps, ComponentState> {
  public state: ComponentState = {
    filterMenuAnchorEl: null
  };

  private readonly memoizeGetFiltersCollection = memoizeOne(
    (records: ReadonlyArray<Record>): FiltersCollection | null =>
      getFiltersCollection(records)
  );

  private readonly onFilterAdd = memoize((filter: RecordFilter) => () => {
    const { filters, onFiltersChanged } = this.props;
    const index = filters.findIndex(f => f.id === filter.id);
    if (index >= 0) {
      return;
    }

    onFiltersChanged([...filters, filter]);
  });

  private readonly onFilterDelete = memoize((filter: RecordFilter) => () => {
    const { filters, onFiltersChanged } = this.props;
    const index = filters.findIndex(f => f.id === filter.id);
    if (index < 0) {
      return;
    }

    const next = [...filters];
    next.splice(index, 1);
    onFiltersChanged(next);
  });

  public render() {
    const { allRecords, classes, filters } = this.props;
    const { filterMenuAnchorEl } = this.state;

    const filtersCollection = this.memoizeGetFiltersCollection(allRecords);
    if (!filtersCollection) {
      return null;
    }

    return (
      <div className={classes.root}>
        <IconButton onClick={this.onFilterIconClick}>
          <FilterListIcon />
        </IconButton>
        {filters.map(this.renderFilterChip)}
        <Menu
          anchorEl={filterMenuAnchorEl}
          open={!!filterMenuAnchorEl}
          onClose={this.onCloseFilterMenu}
        >
          {filtersCollection.originTypes.map(this.renderFilterMenuItem)}
          <Divider />
          {filtersCollection.status.map(this.renderFilterMenuItem)}
        </Menu>
      </div>
    );
  }

  private renderFilterMenuItem = (filter: RecordFilter) => {
    return (
      <MenuItem key={filter.id} onClick={this.onFilterAdd(filter)}>
        {filter.label}
      </MenuItem>
    );
  };

  private renderFilterChip = (filter: RecordFilter) => {
    return (
      <Chip
        key={filter.id}
        label={filter.label}
        onDelete={this.onFilterDelete(filter)}
      />
    );
  };

  private onFilterIconClick = (e: React.MouseEvent<Element>) =>
    this.setState({
      filterMenuAnchorEl: e.currentTarget
    });

  private onCloseFilterMenu = () => this.setState({ filterMenuAnchorEl: null });
}

export default withStyles(styles)(FilterBar);
