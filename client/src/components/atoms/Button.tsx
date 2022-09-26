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
  rounded?: boolean
};

function Button({ loading, large, rounded, sx, ...props }: ButtonProps) {
  if (loading) {
    const { children, disabled, ...rest } = props;
    return (
      <MuiButton
        fullWidth
        disabled
        sx={{
          ...(rounded ? { borderRadius: 50 } : {}),
          ...(large ? { height: { xs: 40, sm: 60 }, maxWidth: 280 } : {}),
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
        ...(large ? { height: { xs: 40, sm: 60 }, maxWidth: 280 } : {}),
        ...sx,
      }}
      {...{ ...props, component: props.to ? RouterLink : null }}
    />
  );
}

export default Button;
