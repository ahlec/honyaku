import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";

import { ProtoOfficialTranslation } from "@common/types";

import { ReduxDispatch, State } from "@client/redux";
import { createOfficialTranslation } from "@client/redux/officialTranslations/actions";
import { ReduxRecord } from "@client/redux/records";

import ErrorRedirect from "@client/ui/ErrorRedirect";

import TranslationConfigureForm from "./TranslationConfigureForm";

export function getLinkToCreateOfficialTranslation(
  record: ReduxRecord
): string {
  return `/record/${record.id}/official-translation/add`;
}

export const ROUTE_PATH = "/record/:id(\\d+)/official-translation/add";

type ProvidedProps = RouteComponentProps<{ id: string }>;

interface ReduxProps {
  doesRecordExist: boolean;
  recordId: number | null;
}

function mapStateToProps(state: State, props: ProvidedProps): ReduxProps {
  const id = parseInt(props.match.params.id, 10);
  const record = isFinite(id) && state.records[id];

  return {
    doesRecordExist: !!record,
    recordId: record ? record.id : null
  };
}

type ComponentProps = ProvidedProps &
  ReduxProps & {
    dispatch: ReduxDispatch;
  };

class OfficialTranslationCreateRouteUnwrapper extends React.PureComponent<
  ComponentProps
> {
  public render() {
    const {
      doesRecordExist,
      match: {
        params: { id }
      }
    } = this.props;
    if (!doesRecordExist) {
      return (
        <ErrorRedirect message={`There is no record with the id of '${id}'.`} />
      );
    }

    return (
      <TranslationConfigureForm
        current={null}
        onSubmit={this.onSubmit}
        translationType="official"
      />
    );
  }

  private onSubmit = async (proto: ProtoOfficialTranslation) => {
    const { dispatch, recordId } = this.props;
    if (recordId === null) {
      throw new Error();
    }

    await dispatch(createOfficialTranslation(recordId, proto));
  };
}

export default connect(mapStateToProps)(
  OfficialTranslationCreateRouteUnwrapper
);
