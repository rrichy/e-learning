import { Paper, Typography } from "@mui/material";

function Footer() {
  return (
    <Paper variant="softoutline" sx={{ py: 3, mb: 0 }}>
      <Typography variant="body2" textAlign="center">
        © 2020 techhub
      </Typography>
    </Paper>
  );
}

export default Footer;
