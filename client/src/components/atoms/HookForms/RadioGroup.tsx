import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup as MuiRadioGroup,
  useTheme,
} from "@mui/material";
import useDisabledComponent from "@/hooks/useDisabledComponent";
import useOptions from "@/hooks/useOptions";
import { ChangeEvent } from "react";
import { Control, FieldError, useController } from "react-hook-form";

export type RadioGroupProps = {
  options?: any[];
  helperText?: string;
  name: string;
  required?: boolean;
  parseError?: (error: FieldError) => string;
  label?: string;
  labelKey?: string;
  valueKey?: string;
  type?: "number" | "string";
  emptyOptionLabel?: "string";
  onChange?: (value: any) => void;
  returnObject?: boolean;
  row?: boolean;
  control?: Control<any>;
};

function RadioGroup({
  options: optionsProp,
  helperText,
  label,
  name,
  parseError,
  labelKey = "name",
  valueKey = "id",
  required,
  emptyOptionLabel,
  returnObject,
  row,
  control,
  ...rest
}: RadioGroupProps) {
  const disabledChild = useDisabledComponent();
  const optionsChild = useOptions();
  const options = optionsProp || optionsChild?.[name] || [];

  const theme = useTheme();
  const {
    field: { value, onChange },
    fieldState: { invalid, error },
  } = useController({
    name,
    rules: required ? { required: "This field is required" } : undefined,
    control,
  });

  helperText = error
    ? typeof parseError === "function"
      ? parseError(error)
      : error.message
    : helperText;

  const onRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    const radioValue = (event.target as HTMLInputElement).value;
    const returnValue = returnObject
      ? options.find((items) => items[valueKey] === radioValue)
      : radioValue;
    onChange(returnValue);
    if (typeof rest.onChange === "function") {
      rest.onChange(returnValue);
    }
  };

  return (
    <FormControl error={invalid}>
      {label && (
        <FormLabel required={required} error={invalid}>
          {label}
        </FormLabel>
      )}
      <MuiRadioGroup
        onChange={onRadioChange}
        name={name}
        row={row}
        value={value || ""}
      >
        {emptyOptionLabel && (
          <FormControlLabel
            control={
              <Radio
                sx={{
                  color: invalid ? theme.palette.error.main : undefined,
                }}
                checked={!value}
              />
            }
            label={emptyOptionLabel}
            value=""
          />
        )}
        {options.map((option: any) => {
          const optionKey = option[valueKey];
          if (!optionKey) {
            console.error(
              `CheckboxButtonGroup: valueKey ${valueKey} does not exist on option`,
              option
            );
          }
          const isChecked = !!(
            value &&
            (returnObject
              ? value[valueKey] === optionKey
              : value === optionKey || +value === optionKey)
          );
          return (
            <FormControlLabel
              control={
                <Radio
                  sx={{
                    color: invalid ? theme.palette.error.main : undefined,
                  }}
                  checked={isChecked}
                  disabled={disabledChild || option.disabled}
                  checkedIcon={option?.checkedIcon}
                  icon={option?.icon}
                />
              }
              value={optionKey}
              label={option[labelKey]}
              key={optionKey}
            />
          );
        })}
      </MuiRadioGroup>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

export default RadioGroup;
