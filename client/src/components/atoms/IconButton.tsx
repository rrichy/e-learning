import {
  IconButton as MuiIconButton,
  IconButtonProps as MuiIconButtonProps,
} from "@mui/material";
import { Link as RouterLink, To } from "react-router-dom";

interface IconButtonProps extends MuiIconButtonProps {
  to?: To;
  state?: any;
}

function IconButton(props: IconButtonProps) {
  return (
    <MuiIconButton {...{ component: props.to ? RouterLink : null, ...props }} />
  );
}

export default IconButton;
