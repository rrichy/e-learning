import { DatePicker as AtomDatePicker, DatePickerElementProps } from "@/components/atoms/HookForms";
import Labeler, { LabelerSupplementaryProps } from "../Labeler";

function DatePicker({
  label,
  labelProps,
  ...rest
}: DatePickerElementProps & { labelProps?: LabelerSupplementaryProps }) {
  return (
    <Labeler label={label} {...labelProps}>
      <AtomDatePicker {...rest} fullWidth />
    </Labeler>
  );
}

export default DatePicker;
