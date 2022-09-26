import {
  ConditionalDateRange as AtomConditionalDateRange,
  ConditionalDateRangeProps,
} from "@/components/atoms/HookForms";
import Labeler, { LabelerSupplementaryProps } from "../Labeler";

function ConditionalDateRange({
  label,
  labelProps,
  ...rest
}: ConditionalDateRangeProps & {
  label: string;
  labelProps?: LabelerSupplementaryProps;
}) {
  return (
    <Labeler label={label} {...labelProps}>
      <AtomConditionalDateRange {...rest} />
    </Labeler>
  );
}

export default ConditionalDateRange;
