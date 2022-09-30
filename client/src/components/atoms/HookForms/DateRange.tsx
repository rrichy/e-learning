import { localeDate } from "@/utils/localeDateString";
import { Stack, Typography } from "@mui/material";
import { useWatch } from "react-hook-form";
import DatePicker, { DatePickerElementProps } from "./DatePicker";

function DateRange({
  minDateProps,
  maxDateProps,
  disabled,
}: {
  minDateProps: DatePickerElementProps;
  maxDateProps: DatePickerElementProps;
  disabled?: boolean;
}) {
  const minDateVal = useWatch({ name: minDateProps.name });
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={{ xs: 1, md: 2 }}
      alignItems="center"
      width={1}
    >
      <DatePicker
        {...minDateProps}
        disabled={disabled}
        parseDate={localeDate}
      />
      <Typography>~</Typography>
      <DatePicker
        {...maxDateProps}
        minDate={new Date(minDateVal)}
        disabled={disabled}
        parseDate={localeDate}
      />
    </Stack>
  );
}

export default DateRange;
