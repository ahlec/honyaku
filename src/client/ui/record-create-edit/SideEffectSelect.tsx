// Code (heavily) modified from
// https://github.com/stackworx/formik-material-ui/blob/master/src/Select.tsx

import MuiSelect, {
  SelectProps as MuiSelectProps
} from "@material-ui/core/Select";
import { FieldProps } from "formik";
import * as React from "react";

export interface SelectProps<T>
  extends FieldProps,
    Omit<MuiSelectProps, "value"> {
  onChange: (event: React.ChangeEvent<{ name: string; value: T }>) => void;
}

export default class SideEffectSelect<T> extends React.PureComponent<
  SelectProps<T>
> {
  public render() {
    const {
      field,
      form: { isSubmitting },
      disabled,
      onChange,
      ...props
    } = this.props;

    return (
      <MuiSelect
        disabled={disabled !== undefined ? disabled : isSubmitting}
        {...props}
        {...field}
        onChange={onChange}
      />
    );
  }
}
