import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";

import { ProtoUserTranslation, Record } from "@common/types";

import { ReduxDispatch, State } from "@client/redux";
import ErrorRedirect from "@client/ui/ErrorRedirect";

import TranslationConfigureForm from "./TranslationConfigureForm";

export const ROUTE_PATH = "/record/:id(\\d+)/user-translation/add";

type ProvidedProps = RouteComponentProps<{ id: string }>;

interface ReduxProps {
  record: Record | null;
}

function mapStateToProps(state: State, props: ProvidedProps): ReduxProps {
  const id = parseInt(props.match.params.id, 10);

  return {
    record: (isFinite(id) && state.records[id]) || null
  };
}

type ComponentProps = ProvidedProps &
  ReduxProps & {
    dispatch: ReduxDispatch;
  };

class UserTranslationCreateRouteUnwrapper extends React.PureComponent<
  ComponentProps
> {
  public render() {
    const {
      match: {
        params: { id }
      },
      record
    } = this.props;
    if (!record) {
      return (
        <ErrorRedirect message={`There is no record with the id of '${id}'.`} />
      );
    }

    return (
      <TranslationConfigureForm
        current={null}
        onSubmit={this.onSubmit}
        translationType="user"
      />
    );
  }

  private onSubmit = async (proto: ProtoUserTranslation) => {
    console.log(proto);
  };
}

export default connect(mapStateToProps)(UserTranslationCreateRouteUnwrapper);
