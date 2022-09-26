import { Container, Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";
import Button from "@/components/atoms/Button";
import Footer from "@/components/molecules/Footer";
import { FormContainer } from "react-hook-form-mui";
import { TextField } from "../molecules/LabeledHookForms";

function Contact() {
  return (
    <Stack justifyContent="space-between">
      <Container>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Paper variant="softoutline" sx={{ p: 6 }}>
            <Stack spacing={3}>
              <Typography 
                fontWeight="bold" 
                variant="h6" 
                pl={1} 
                sx={{ borderLeft: '5px solid #00c2b2' }}
              >
                お問い合わせ
              </Typography>
              <FormContainer>
                <Stack spacing={3} alignItems="center">
                  <Typography>講座やシステムに関する疑問・ご質問は、こちらのフォームよりお問い合わせください。</Typography>
                  <TextField
                    name="contact"
                    label="お問い合わせ内容"
                    labelProps={{ compact: true }}
                    multiline
                    rows={8}
                    placeholder="自由記入欄"
                    // sx={{
                    //   maxWidth: 700,
                    //   textAlign: "center"
                    // }}
                  />
                  <Button variant="contained" color="warning" sx={{ width: 200, p: 2, borderRadius: 7 }}>Confirmation{/* 力確認画面へ */}</Button>
                </Stack>
              </FormContainer>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Stack>
  );
}

export default Contact;
