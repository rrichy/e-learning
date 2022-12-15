import {
  TextField as AtomTextField,
  TextFieldProps,
} from "@/components/atoms/HookForms";
import Labeler, { LabelerSupplementaryProps } from "../Labeler";

function TextField({
  label,
  placeholder,
  labelProps,
  ...rest
}: TextFieldProps & { labelProps?: LabelerSupplementaryProps }) {
  return (
    <Labeler label={label} {...labelProps}>
      <AtomTextField
        placeholder={
          placeholder !== "not_applicable"
            ? placeholder || label + "を入力してください"
            : "N/A"
        }
        fullWidth
        size="small"
        {...rest}
      />
    </Labeler>
  );
}

export default TextField;
