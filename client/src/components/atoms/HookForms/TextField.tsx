import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  IconButton,
  InputAdornment,
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
} from "@mui/material";
import useDisabledComponent from "@/hooks/useDisabledComponent";
import { useState } from "react";
import {
  Control,
  Controller,
  ControllerProps,
  FieldError,
} from "react-hook-form";

export interface TextFieldProps extends Omit<MuiTextFieldProps, "name"> {
  validation?: ControllerProps["rules"];
  name: string;
  parseError?: (error: FieldError) => string;
  control?: Control<any>;
  suffix?: React.ReactNode;
}

function TextField({
  disabled: disabledProp,
  suffix,
  type,
  validation = {},
  parseError,
  required,
  name,
  control,
  ...rest
}: TextFieldProps) {
  const [typeOrigin, setTypeOrigin] = useState<
    [boolean, React.HTMLInputTypeAttribute | undefined]
  >([type === "password", type]);
  const disabledChild = useDisabledComponent();
  const disabled = disabledProp || disabledChild;

  if (required) {
    validation.required = "This field is required";
  }
  if (type === "email") {
    validation.pattern = {
      value:
        // eslint-disable-next-line no-useless-escape
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: "Please enter a valid email address",
    };
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={validation}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { invalid, error },
      }) => (
        <MuiTextField
          {...rest}
          name={name}
          value={value ?? ""}
          onChange={(e) => {
            onChange(e);
            if (rest.onChange) rest.onChange(e);
          }}
          onBlur={(e) => {
            onBlur();
            if (rest.onBlur) rest.onBlur(e);
          }}
          required={required}
          type={
            typeOrigin[1] === "password"
              ? typeOrigin[0]
                ? "password"
                : "text"
              : type
          }
          disabled={disabled}
          error={invalid}
          helperText={
            error
              ? typeof parseError === "function"
                ? parseError(error)
                : error.message
              : rest.helperText
          }
          InputProps={{
            endAdornment: suffix ? (
              <InputAdornment position="end">{suffix}</InputAdornment>
            ) : type === "password" ? (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setTypeOrigin([!typeOrigin[0], typeOrigin[1]])}
                  edge="end"
                  tabIndex={-1}
                  size={rest.size}
                  disabled={disabled}
                >
                  {typeOrigin[0] ? (
                    <Visibility fontSize={rest.size} />
                  ) : (
                    <VisibilityOff fontSize={rest.size} />
                  )}
                </IconButton>
              </InputAdornment>
            ) : undefined,
            ...rest?.InputProps,
          }}
        />
      )}
    />
  );
}

export default TextField;
