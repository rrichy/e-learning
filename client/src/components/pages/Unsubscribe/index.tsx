import { List, ListItem, Paper, Stack, Typography } from "@mui/material";
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
          <Typography fontWeight="bold">退会される前に必ずご確認ください</Typography>
        </Stack>
        <Stack p={5}>
          <List>
            <ListItem>
              <Typography>・you can recover your account within 30 days after withdrawal</Typography>
            </ListItem>
            <ListItem>
              <Typography>・your account will be permanently deleted after 30 days you unsubscribe</Typography>
            </ListItem>
            <ListItem>
              <Typography>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</Typography>
            </ListItem>
          </List>
        </Stack>
        <Stack alignItems="center" spacing={2} p={3} direction="row" justifyContent="center">
          <Button 
            color="secondary" 
            variant="contained" 
            rounded 
            large 
            type="button"
            to="reason"
          >
            退会手続きへ進む
          </Button>
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