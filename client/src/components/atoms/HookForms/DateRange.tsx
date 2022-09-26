import { Stack, Typography } from "@mui/material";
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
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={{ xs: 1, md: 2 }}
      alignItems="center"
      width={1}
    >
      <DatePicker {...minDateProps} disabled={disabled} />
      <Typography>~</Typography>
      <DatePicker {...maxDateProps} disabled={disabled} />
    </Stack>
  );
}

export default DateRange;
