import { Paper, Stack, Typography } from "@mui/material";
import Button from "@/components/atoms/Button";

function Unsubscribe() {
  return (
    <Stack justifyContent="space-between">
      <Paper variant="outlined">
        <Stack spacing={3}>
          <Typography variant="sectiontitle2">
            退会手続き
          </Typography>
        </Stack>
        <Stack alignItems="center" p={3}>
          <Typography fontWeight="bold">退会が完了しました</Typography>
        </Stack>
        <Stack p={5}>
          <Typography>Techhub をご利用いただきありがとうございました。テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキ</Typography>
        </Stack>
        <Stack alignItems="center" spacing={2} p={3} direction="row" justifyContent="center">
          <Button 
            color="dull" 
            variant="outlined" 
            rounded 
            large 
            type="button"
            to="/"
          >
            Techhubトップへ
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}

export default Unsubscribe;