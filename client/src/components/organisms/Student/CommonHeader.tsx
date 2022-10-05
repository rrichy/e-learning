import { Avatar, Grid, Paper, Stack, Typography } from "@mui/material";

interface CommonHeaderProps {
  image: string | null;
  title: string;
  preview?: boolean;
}

function CommonHeader({ image, title, preview }: CommonHeaderProps) {
  return (
    <Grid item xs={12}>
      <Paper variant="softoutline" sx={{ width: 1 }}>
        <Stack direction="row" spacing={2} p={2} alignItems="center">
          <Avatar
            src={image || undefined}
            alt="course-image"
            sx={{ width: 70, height: 70 }}
          />
          <Typography variant="h2" fontSize={24} fontWeight="bold">
            {title}対策講座
          </Typography>
        </Stack>
      </Paper>
    </Grid>
  );
}

export default CommonHeader;
