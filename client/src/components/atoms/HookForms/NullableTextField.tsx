import { Checkbox, FormControlLabel } from "@mui/material";
import useDisabledComponent from "@/hooks/useDisabledComponent";
import { useController } from "react-hook-form";
import TextField, { TextFieldProps } from "./TextField";

function NullableTextField({
  suffix,
  ...props
}: Omit<TextFieldProps, "suffix"> & { suffix?: string }) {
  const isDisabled = useDisabledComponent();
  const {
    field: { value, onChange },
  } = useController({
    name: props.name,
    rules: props.required ? { required: "This field is required" } : undefined,
    control: props.control,
  });

  return (
    <TextField
      {...props}
      suffix={
        <FormControlLabel
          label={suffix || ""}
          labelPlacement="start"
          control={
            <Checkbox
              size="small"
              disabled={props.disabled || isDisabled}
              checked={value === null}
              onChange={(_e, checked) =>
                checked ? onChange(null) : onChange(0)
              }
            />
          }
        />
      }
    />
  );
}

export default NullableTextField;
