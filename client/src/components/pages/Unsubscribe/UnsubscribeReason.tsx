import {
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Button from "@/components/atoms/Button";
import { TextField } from "../../molecules/LabeledHookForms";
import { FormContainer } from "react-hook-form-mui";
import { useState } from "react";
import Labeler from "@/components/molecules/Labeler";

function UnsubscribeReason() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Stack justifyContent="space-between">
      <Paper variant="outlined">
        <Stack spacing={3}>
          <Typography variant="sectiontitle2">退会手続き</Typography>
        </Stack>
        <Stack alignItems="center" p={3}>
          <Typography>ご利用いただきありがとうございました。</Typography>
          <Typography>
            今後のサビーズ改善のため、退会する理由を聞かせください。
          </Typography>
        </Stack>
        <FormContainer>
          <Stack p={5}>
            <TextField
              name="reason"
              label="退会理由"
              labelProps={{ compact: true }}
              multiline
              rows={8}
              placeholder="自由記入欄"
            />
          </Stack>
          <Stack
            alignItems="center"
            spacing={2}
            p={3}
            direction="row"
            justifyContent="center"
          >
            <Button
              color="secondary"
              variant="contained"
              rounded
              large
              type="button"
              onClick={handleOpen}
            >
              退会確認画面へ進む
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
        </FormContainer>

        <Dialog open={open} maxWidth="xl">
          <DialogTitle sx={{ px: 0, pt: 0 }}>
            <Typography variant="sectiontitle1">退会手続き</Typography>
          </DialogTitle>
          <DialogContent>
            <Stack alignItems="center" p={3}>
              <Typography fontWeight="bold">退会確認</Typography>
            </Stack>
            <Stack p={3}>
              <Typography>
                退会するとご登録されているアカウントに関する全ての情報が削除されます。
              </Typography>
              <Typography>
                ※ 30日以内であればアカウントへのログインが可能です。
              </Typography>
            </Stack>
            <Stack p={3}>
              <Labeler label="アカウント名: ">
                <Typography>account_name</Typography>
              </Labeler>
              <Labeler label="メールアドレス: ">
                <Typography>account@sample.com</Typography>
              </Labeler>
            </Stack>
            <Stack
              alignItems="center"
              spacing={2}
              p={3}
              direction="row"
              justifyContent="center"
            >
              <Button
                color="secondary"
                variant="contained"
                rounded
                large
                type="button"
                onClick={handleOpen}
              >
                退会する
              </Button>
              <Button
                color="dull"
                variant="outlined"
                rounded
                large
                type="button"
                onClick={handleClose}
              >
                Techhubトップへ
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>
      </Paper>
    </Stack>
  );
}

export default UnsubscribeReason;
