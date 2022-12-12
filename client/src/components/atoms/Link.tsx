import { Link as MuiLink, LinkProps } from "@mui/material";
import { Link as RouterLink, To } from "react-router-dom";

function Link(props: LinkProps & { to: To; state?: any }) {
  return <MuiLink component={RouterLink} {...props} />;
}

export default Link;
