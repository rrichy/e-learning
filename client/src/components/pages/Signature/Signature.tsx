import {
  Card, 
  CardContent, 
  CardHeader, 
  Container,
  Dialog,
  DialogContent, 
  DialogTitle,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@/components/atoms/Button";
import Footer from "@/components/molecules/Footer";
import { FormContainer } from "react-hook-form-mui";
import CloseIcon from '@mui/icons-material/Close';
import {
  DatePicker,
  // RadioGroup,
  Selection,
  TextField,
} from "../../molecules/LabeledHookForms";
import { RadioGroup } from "@/components/atoms/HookForms";

function Signature() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  
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
                sx={{ borderLeft: "5px solid #00c2b2" }}
              >
                署名の管理
              </Typography>
              <Stack spacing={1} direction="row">
                <Button
                  variant="contained"
                  color="warning"
                  sx={{ width: 70, borderRadius: 6 }}
                >
                  削除
                </Button>
                <Button
                  variant="contained"
                  sx={{ width: 100, borderRadius: 6 }}
                  onClick={handleClickOpen}
                >
                  新規追加
                </Button>
              </Stack>
              <Typography>Table Here</Typography>
            </Stack>
          </Paper>
        </Stack>
        <FormContainer>
          <Dialog open={open} maxWidth="lg">
            <DialogTitle>
              <Typography 
                fontWeight="bold" 
                variant="h6" 
                pl={1} 
                sx={{ borderLeft: '5px solid #00c2b2' }}
              >
                署名の登録
              </Typography>
              <IconButton
                onClick={handleClose}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Card>
                <CardHeader 
                  title="基本情報" 
                  sx={{ 
                    fontWeight: "bold",
                    background: "#000000",
                    color: "#ffffff",
                    fontSize: "1.25rem"
                  }}
                />
                <CardContent>
                  <Stack spacing={2} p={2}>
                    <TextField
                      name="name"
                      label="登録名"
                      placeholder="登録名を入力"
                    />
                    <TextField
                      name="name"
                      label="From名前"
                      placeholder="From名前を入力"
                    />
                    <TextField
                      name="name"
                      label="Fromアドレス"
                      placeholder="Fromアドレスを入力"
                    />
                    <TextField
                      name="name"
                      label="署名"
                      placeholder="署名を入力"
                      multiline
                      rows={3}
                    />
                  </Stack>
                </CardContent>
              </Card>
              <Stack direction="row" spacing={1} justifyContent="center" pt={2}>
                <Button large color="inherit" variant="outlined" sx={{ borderRadius: 7 }}>キャンセル</Button>
                <Button large color="warning" variant="contained" sx={{ borderRadius: 7 }}>登録</Button>
              </Stack>
            </DialogContent>
          </Dialog>
        </FormContainer>
      </Container>
    </Stack>
  );
}

export default Signature;
