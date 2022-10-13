import { Dialog, DialogContent, DialogTitle, Grid, Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import Button from "@/components/atoms/Button";
import { FormContainer } from "react-hook-form-mui";
import { TextField } from "../molecules/LabeledHookForms";
import { useState } from "react";
import Labeler from "@/components/molecules/Labeler";

function Contact() {
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
          <Typography variant="sectiontitle2">お問い合わせ</Typography>
          <FormContainer>
            <Stack spacing={5} alignItems="center">
              <Typography>講座やシステムに関する疑問・ご質問は、こちらのフォームよりお問い合わせください。</Typography>
              <Grid container>
                <Grid xs></Grid>
                <Grid xs={8}>
                  <TextField
                    name="contact"
                    label="お問い合わせ内容"
                    labelProps={{ compact: true }}
                    multiline
                    rows={8}
                    placeholder="自由記入欄"
                  />
                </Grid>
                <Grid xs></Grid>
              </Grid>
              <Button 
                variant="contained" 
                color="warning" 
                sx={{ 
                  width: 200, 
                  p: 2, 
                  borderRadius: 7 
                }}
                onClick={handleOpen}
              >
                Confirmation{/* 力確認画面へ */}
              </Button>
            </Stack>
          </FormContainer>

          <Dialog open={open} maxWidth="md">
            <DialogTitle sx={{ px: 0, pt: 0 }}>
              <Typography variant="sectiontitle1">お問い合わせ内容確認</Typography>
            </DialogTitle>
            <DialogContent>
              <Stack alignItems="center" p={3}>
                <Typography>こちらの内容でよろしければ、送信ボタンをクリックしてお問い合わせください。</Typography>
              </Stack>
              <Stack p={3}>
                <Labeler label="お問い合わせ内容" compact>
                  <Typography>sulod sa textarea</Typography>
                </Labeler>
              </Stack>
              <Stack alignItems="center" spacing={2} p={3} direction="row" justifyContent="center">
                <Button 
                  color="secondary" 
                  variant="contained" 
                  rounded 
                  large 
                  type="button"
                  onClick={handleClose}
                >
                  送信
                </Button>
              </Stack>
            </DialogContent>
          </Dialog>
        </Stack>
      </Paper>
    </Stack>
  );
}

export default Contact;
