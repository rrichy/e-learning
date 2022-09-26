import { Selection as AtomSelection } from "@/components/atoms/HookForms";
import { SelectElementProps } from "react-hook-form-mui";
import Labeler, { LabelerSupplementaryProps } from "../Labeler";

function Selection({
  label,
  labelProps,
  ...rest
}: SelectElementProps<any> & { labelProps?: LabelerSupplementaryProps }) {
  return (
    <Labeler label={label} {...labelProps}>
      <AtomSelection fullWidth size="small" {...rest} />
    </Labeler>
  );
}

export default Selection;
