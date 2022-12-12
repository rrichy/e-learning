import {
  FormControl,
  FormHelperText,
  FormLabel,
  Slider as MuiSlider,
  SliderProps as MuiSliderProps,
} from "@mui/material";
import useDisabledComponent from "@/hooks/useDisabledComponent";
import { Control, useController } from "react-hook-form";

export type SliderProps = Omit<MuiSliderProps, "name"> & {
  name: string;
  control?: Control<any>;
  required?: boolean;
  label?: string;
};

function Slider({
  disabled: disabledProp,
  name,
  control,
  required,
  label,
  ...rest
}: SliderProps) {
  const disabledChild = useDisabledComponent();

  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    rules: required ? { required: "This field is required" } : undefined,
    control,
  });

  return (
    <FormControl error={Boolean(error)} fullWidth sx={{ px: 3 }}>
      {label && <FormLabel>{label}</FormLabel>}
      <MuiSlider
        {...rest}
        name={name}
        value={value}
        valueLabelDisplay="auto"
        disabled={disabledChild || disabledProp}
        onChange={(_e, v, a) => {
          onChange(v);
          if (rest.onChange) rest.onChange(_e, v, a);
        }}
        disableSwap
      />
      <FormHelperText error={Boolean(error)}>{error?.message}</FormHelperText>
    </FormControl>
  );
}

export default Slider;
