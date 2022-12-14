import { FormControl, FormHelperText, Stack, Typography } from "@mui/material";
import { Selection } from "@/components/atoms/HookForms";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { SelectElementProps } from "react-hook-form-mui";
import Labeler, { LabelerSupplementaryProps } from "../Labeler";

interface RangeSelectionProps {
  label: string;
  minProps: SelectElementProps<any>;
  maxProps: SelectElementProps<any>;
  labelProps?: LabelerSupplementaryProps;
}

function RangeSelection({
  label,
  minProps,
  maxProps,
  labelProps,
}: RangeSelectionProps) {
  const { watch, setError, clearErrors } = useFormContext();
  const [minValue, maxValue] = watch([minProps.name, maxProps.name]);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (+minValue >= +maxValue) {
      setError(label, { type: "custom", message: "Values should be a range!" });
      setLocalError("Values should be a range!");
    } else {
      clearErrors(label);
      setLocalError("");
    }
  }, [minValue, maxValue, setError, clearErrors, label]);

  return (
    <Labeler label={label} {...labelProps}>
      <FormControl error={Boolean(localError)} fullWidth>
        <Stack direction="row" spacing={2} alignItems="center">
          <Selection size="small" fullWidth {...minProps} />
          <Typography>~</Typography>
          <Selection size="small" fullWidth {...maxProps} />
        </Stack>
      </FormControl>
      {localError && <FormHelperText>{localError}</FormHelperText>}
    </Labeler>
  );
}

export default RangeSelection;
