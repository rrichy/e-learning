import {
  RadioGroup as AtomRadioGroup,
  RadioGroupProps,
} from "@/components/atoms/HookForms";
import Labeler, { LabelerSupplementaryProps } from "../Labeler";

function RadioGroup({
  label,
  labelProps,
  ...rest
}: Omit<RadioGroupProps, "children"> & {
  labelProps?: LabelerSupplementaryProps;
}) {
  return (
    <Labeler label={label} {...labelProps}>
      <AtomRadioGroup row {...rest} />
    </Labeler>
  );
}

export default RadioGroup;
