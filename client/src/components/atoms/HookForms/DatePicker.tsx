import { DatePicker, DatePickerProps } from "@mui/x-date-pickers";
import {
  Control,
  Controller,
  ControllerProps,
  FieldError,
} from "react-hook-form";
import { TextField, TextFieldProps } from "@mui/material";
import useDisabledComponent from "@/hooks/useDisabledComponent";

export declare type ParseableDate<TDate> =
  | string
  | number
  | Date
  | null
  | undefined
  | TDate;

export type DatePickerElementProps<TDate = any> = Omit<
  DatePickerProps<any, any>,
  "value" | "onChange" | "renderInput"
> & {
  name: string;
  required?: boolean;
  isDate?: boolean;
  parseError?: (error: FieldError) => string;
  onChange?: (value?: TDate) => void;
  validation?: ControllerProps["rules"];
  parseDate?: (date: TDate) => string;
  control?: Control<any>;
  inputProps?: TextFieldProps;
  helperText?: TextFieldProps["helperText"];
  fullWidth?: boolean;
};

export default function DatePickerElement({
  isDate,
  parseError,
  name,
  required,
  parseDate,
  validation = {},
  inputProps,
  control,
  fullWidth,
  ...rest
}: DatePickerElementProps): JSX.Element {
  const isDisabled = useDisabledComponent();
  if (required) {
    validation.required = "This field is required";
  }

  return (
    <Controller
      name={name}
      rules={validation}
      control={control}
      render={({
        field: { onChange, value },
        fieldState: { error, invalid },
      }) => (
        <DatePicker
          disabled={isDisabled}
          mask="____年__月__日"
          inputFormat="yyyy年MM月dd日"
          {...rest}
          value={value || ""}
          onChange={(date: any, selectionState: any) => {
            let parsedDate = "";
            if (selectionState) {
              if (typeof parseDate === "function") {
                parsedDate = parseDate(selectionState);
              }
            } else {
              parsedDate = date?.toISOString().substr(0, 10);
              if (typeof parseDate === "function") {
                parsedDate = parseDate(date);
              }
            }
            onChange(parsedDate);
            if (typeof rest.onChange === "function") {
              rest.onChange(parsedDate);
            }
          }}
          renderInput={(params: any) => {
            const tempParams = { ...params };
            if (!value) {
              tempParams["inputProps"] = {
                ...tempParams["inputProps"],
                value: "",
              };
            }

            return (
              <TextField
                {...tempParams}
                inputProps={{
                  ...tempParams["inputProps"],
                  onChange: undefined,
                }}
                {...inputProps}
                required={!!required}
                error={invalid}
                size="small"
                helperText={
                  error
                    ? typeof parseError === "function"
                      ? parseError(error)
                      : error.message
                    : inputProps?.helperText || rest.helperText
                }
                fullWidth={fullWidth}
              />
            );
          }}
        />
      )}
    />
  );
}
