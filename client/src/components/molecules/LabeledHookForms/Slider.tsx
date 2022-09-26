import { Box, Slider as MuiSlider, SliderProps } from "@mui/material";
import React from "react";
import { Control, useController } from "react-hook-form";
import Labeler, { LabelerSupplementaryProps } from "../Labeler";

function Slider({
  label,
  name,
  required,
  control,
  labelProps,
  ...rest
}: Omit<SliderProps, "name"> & {
  name: string;
  required?: boolean;
  control?: Control<any>;
  label: React.ReactNode;
  labelProps?: LabelerSupplementaryProps;
}) {
  const {
    field: { value, onChange },
    // fieldState: { invalid, error },
  } = useController({
    name,
    rules: required ? { required: "This field is required" } : undefined,
    control,
  });

  const handleChange = (_e: unknown, newValue: number | number[]) => {
    onChange(newValue);
  };

  return (
    <Labeler label={label} {...labelProps}>
      <Box px={3}>
        <MuiSlider
          name={name}
          value={value}
          onChange={handleChange}
          {...rest}
        />
      </Box>
    </Labeler>
  );
}

export default Slider;
