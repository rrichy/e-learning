import { CheckboxGroup as AtomCheckboxGroup, CheckboxGroupProps } from "@/components/atoms/HookForms";
import Labeler, { LabelerSupplementaryProps } from "../Labeler";

function CheckboxGroup({
  label,
  labelProps,
  ...rest
}: Omit<CheckboxGroupProps, "children"> & {
  labelProps?: LabelerSupplementaryProps;
}) {
  return (
    <Labeler label={label} {...labelProps}>
      <AtomCheckboxGroup {...rest} />
    </Labeler>
  );
}

export default CheckboxGroup;
