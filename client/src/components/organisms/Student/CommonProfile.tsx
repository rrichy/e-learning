import { Avatar, Box, Grid, Paper, Stack, Typography } from "@mui/material";
import Button from "../../atoms/Button";

interface CommonProfileProps {
  name?: string;
  image?: string | null;
  plan?: Date | string | null;
  registered_date?: Date | string | null;
}

function CommonProfile ({name, image, plan, registered_date}: CommonProfileProps) {
  return (
    <Grid item xs={12} md={3}>
      <Paper variant="softoutline" sx={{ p: 5 }}>
        <Stack spacing={1} pb={2} alignItems="center">
          <Avatar
            src={image ? image : "https://picsum.photos/id/639/200/300"}
            alt="sample photo"
            sx={{ height: 125, width: 125 }}
          />
          <Typography variant="h6" fontWeight={700}>{name}</Typography> 
          <Typography>2021/04/01に登録</Typography> 
        </Stack>
        <Box p={3} sx={{ background: "#e5f7f6" }}>
          <Typography variant="subtitle2" align="center">現在のご利用プラン</Typography> 
          <Typography variant="h6" align="center" fontWeight={700} color="#00c2b2">1ヶ月プラン</Typography> 
        </Box>
        <Stack spacing={2} pt={3}>
          <Button
            variant="contained"
            type="button"
            rounded
            to="/my-page"
          >
            アカウント編集
          </Button>
          <Button
            variant="contained"
            type="button"
            rounded
            to="/profile/plan"
          >
            プラン変更
          </Button>
          <Button
            variant="contained"
            type="button"
            rounded
          >
            オプション申込み
          </Button>
        </Stack>
      </Paper>
    </Grid>
  );
}
  
export default CommonProfile;