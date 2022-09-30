import useDisabledComponent from "@/hooks/useDisabledComponent";
import useOptions from "@/hooks/useOptions";
import {
  CheckboxButtonGroup,
  CheckboxButtonGroupProps,
} from "react-hook-form-mui";

export type CheckboxGroupProps = Omit<CheckboxButtonGroupProps<any>, "options"> & {
  options?: any[];
};

function CheckboxGroup({
  options: optionsProp,
  disabled: disabledProp,
  ...rest
}: CheckboxGroupProps) {
  const disabledChild = useDisabledComponent();
  const optionsChild = useOptions();
  const disabled = disabledProp || disabledChild;
  const options = optionsProp || optionsChild?.[rest.name] || [];

  return (
    <CheckboxButtonGroup disabled={disabled} options={options} labelKey="name" {...rest} />
  );
}

export default CheckboxGroup;
