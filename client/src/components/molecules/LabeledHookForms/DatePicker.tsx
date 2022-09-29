import { DatePicker as AtomDatePicker, DatePickerElementProps } from "@/components/atoms/HookForms";
import { localeDate } from "@/utils/localeDateString";
import Labeler, { LabelerSupplementaryProps } from "../Labeler";

function DatePicker({
  label,
  labelProps,
  ...rest
}: DatePickerElementProps & { labelProps?: LabelerSupplementaryProps }) {
  return (
    <Labeler label={label} {...labelProps}>
      <AtomDatePicker {...rest} fullWidth parseDate={localeDate} />
    </Labeler>
  );
}

export default DatePicker;
