import useDisabledComponent from "@/hooks/useDisabledComponent";
import { FormHelperText } from "@material-ui/core";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Control, useController, useFormContext } from "react-hook-form-mui";
import { DatePickerElementProps } from "./DatePicker";
import DateRange from "./DateRange";

export interface ConditionalDateRangeProps {
  radioName: string;
  radioLabel: string;
  radioValue: number;
  dateRangeValue: number;
  disabled?: boolean;
  DateRangeProps: {
    minDateProps: DatePickerElementProps;
    maxDateProps: DatePickerElementProps;
  };
  control?: Control<any>;
}

function ConditionalDateRange({
  radioName,
  radioLabel,
  radioValue,
  dateRangeValue,
  DateRangeProps,
  control,
  disabled,
}: ConditionalDateRangeProps) {
  const disabledChild = useDisabledComponent();
  const { setValue } = useFormContext();

  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name: radioName,
    control,
  });

  return (
    <FormControl
      error={Boolean(error)}
      fullWidth
      disabled={disabled || disabledChild}
    >
      <RadioGroup
        name={radioName}
        value={value}
        onChange={(_e, value) => {
          onChange(value);
          if (+value === radioValue) {
            setValue(DateRangeProps.minDateProps.name, null);
            setValue(DateRangeProps.maxDateProps.name, null);
          }
        }}
      >
        <FormControlLabel
          value={radioValue}
          control={<Radio />}
          label={radioLabel}
        />
        <FormControlLabel
          value={dateRangeValue}
          control={<Radio />}
          label={
            <DateRange
              {...DateRangeProps}
              disabled={+value !== dateRangeValue}
            />
          }
        />
      </RadioGroup>
      <FormHelperText error={Boolean(error)}>{error?.message}</FormHelperText>
    </FormControl>
  );
}

export default ConditionalDateRange;
