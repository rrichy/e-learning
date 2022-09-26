import { ListSubheader, MenuItem, TextField } from "@mui/material";
import useDisabledComponent from "@/hooks/useDisabledComponent";
import useOptions from "@/hooks/useOptions";
import { createElement } from "react";
import { Controller } from "react-hook-form";
import { SelectElementProps } from "react-hook-form-mui";

function Selection({
  disabled: disabledProp,
  options: optionsProp,
  name,
  required,
  valueKey = "id",
  labelKey = "name",
  parseError,
  type,
  objectOnChange,
  validation = {},
  control,
  ...rest
}: SelectElementProps<any>) {
  const disabledChild = useDisabledComponent();
  const optionsChild = useOptions();
  const disabled = disabledProp || disabledChild;
  const options = [...(optionsProp || optionsChild?.[name] || [])];

  const isNativeSelect = !!rest.SelectProps?.native;
  const ChildComponent = isNativeSelect ? "option" : MenuItem;

  if (required && !validation.required) {
    validation.required = "This field is required";
  }

  return (
    <Controller
      name={name}
      rules={validation}
      control={control}
      render={({
        field: { onBlur, onChange, value },
        fieldState: { invalid, error },
      }) => {
        // handle shrink on number input fields
        if (type === "number" && typeof value !== "undefined") {
          rest.InputLabelProps = rest.InputLabelProps || {};
          rest.InputLabelProps.shrink = true;
        }
        if (typeof value === "object" && value !== null) {
          value = value[valueKey]; // if value is object get key
        }
        return (
          <TextField
            {...rest}
            name={name}
            value={options.length && value !== null ? value : ""}
            onBlur={onBlur}
            onChange={(event) => {
              let item: number | string = event.target.value;
              if (type === "number") {
                item = Number(item);
              }
              onChange(item);
              if (typeof rest.onChange === "function") {
                if (objectOnChange) {
                  item = options.find((i) => i[valueKey] === item);
                }
                rest.onChange(item);
              }
            }}
            select
            required={required}
            error={invalid}
            helperText={
              error
                ? typeof parseError === "function"
                  ? parseError(error)
                  : error.message
                : rest.helperText
            }
            disabled={disabled}
          >
            {isNativeSelect && <option />}
            {rest.children ||
              options.map((item: any) =>
                item.selectionType === "category" ? (
                  <ListSubheader key={`${name}_${item[valueKey]}`}>
                    {item[valueKey]}
                  </ListSubheader>
                ) : (
                  createElement(
                    ChildComponent,
                    {
                      key: `${name}_${item[valueKey]}`,
                      value: item[valueKey],
                      disabled: item.selectionType === "disabled",
                      sx: item.sx,
                    },
                    item[labelKey]
                  )
                )
              )}
          </TextField>
        );
      }}
    />
  );
}

export default Selection;
