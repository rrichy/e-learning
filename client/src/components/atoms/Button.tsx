import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  CircularProgress,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export type ButtonProps = MuiButtonProps & {
  to?: string;
  loading?: boolean;
  large?: boolean;
  rounded?: boolean;
  fit?: boolean;
};

function Button({ loading, large, rounded, fit, sx, ...props }: ButtonProps) {
  if (loading) {
    const { children, disabled, ...rest } = props;
    return (
      <MuiButton
        fullWidth
        disabled
        sx={{
          ...(rounded ? { borderRadius: 50 } : {}),
          ...(large ? { height: { xs: 40, sm: 60 }, maxWidth: fit ? "fit-content" : 280 } : {}),
          ...(fit ? { maxWidth: "fit-content"} : {}),
          ...sx,
        }}
        {...rest}
      >
        <CircularProgress size={24.5} color="inherit" />
      </MuiButton>
    );
  }

  return (
    <MuiButton
      fullWidth
      sx={{
        ...(rounded ? { borderRadius: 50 } : {}),
        ...(large ? { height: { xs: 40, sm: 60 }, maxWidth: fit ? "fit-content" : 280 } : {}),
        ...(fit ? { maxWidth: "fit-content"} : {}),
        ...sx,
      }}
      {...{ ...props, component: props.to ? RouterLink : null }}
    />
  );
}

export default Button;
