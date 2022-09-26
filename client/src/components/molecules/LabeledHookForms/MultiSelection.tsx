import {
  MultiSelection as AtomMultiSelection,
  MultiSelectionProps as AtomMultiSelectionProps,
} from "@/components/atoms/HookForms";
import Labeler, { LabelerSupplementaryProps } from "../Labeler";

function MultiSelection({
  label,
  placeholder,
  labelProps,
  ...rest
}: Omit<AtomMultiSelectionProps, "label"> & {
  label: React.ReactNode;
  labelProps?: LabelerSupplementaryProps;
}) {
  return (
    <Labeler label={label} {...labelProps}>
      <AtomMultiSelection fullWidth size="small" {...rest} />
    </Labeler>
  );
}

export default MultiSelection;
