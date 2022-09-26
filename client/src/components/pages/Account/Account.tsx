import {
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Container,
  Dialog,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import { FormContainer } from "react-hook-form-mui";
import {
  DatePicker,
  RadioGroup,
  Selection,
  TextField,
} from "../../molecules/LabeledHookForms";
// import { RadioGroup } from "@/components/atoms/HookForms";
import CloseIcon from '@mui/icons-material/Close';

function Account() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [multipleAccountsOpen, setMultipleAccountsOpen] = useState(false);
  const [createAccountOpen, setCreateAccountOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleSearchOpen = () => {
    setSearchOpen(true);
  };
  const handleSearchClose = () => {
    setSearchOpen(false);
  };

  const handleMultipleAccountsOpen = () => {
    setMultipleAccountsOpen(true);
  };
  const handleMultipleAccountsClose = () => {
    setMultipleAccountsOpen(false);
  };

  const handleCreateAccountOpen = () => {
    setCreateAccountOpen(true);
  };
  const handleCreateAccountClose = () => {
    setCreateAccountOpen(false);
  };
  
  return (
    <Stack justifyContent="space-between">
      <Container>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Button variant="contained" sx={{ p: 2 }} onClick={handleSearchOpen}>
            検索ボックスを開く
          </Button>
          <Stack spacing={2} justifyContent="center" direction="row">
            <Button variant="contained" sx={{ width: 200, borderRadius: 6 }} onClick={handleCreateAccountOpen}>
              新規作成
            </Button>
            <Button variant="contained" sx={{ width: 200, borderRadius: 6 }} onClick={handleMultipleAccountsOpen}>
              一括登録
            </Button>
          </Stack>
          <Paper variant="softoutline" sx={{ p: 6 }}>
            <Stack spacing={3}>
              <Typography
                fontWeight="bold"
                variant="h6"
                pl={1}
                sx={{ borderLeft: "5px solid #00c2b2" }}
              >
                アカウントの管理
              </Typography>
              <Button
                color="warning"
                variant="contained"
                sx={{
                  width: 150,
                  my: 3,
                  borderRadius: 6,
                }}
              >
                削除
              </Button>
              <Typography>検索結果: 12 人</Typography>
              <Typography>Table Here</Typography>
            </Stack>
          </Paper>
        </Stack>

        <FormContainer>
          <Dialog open={searchOpen} maxWidth="xl">
            <DialogTitle 
              align="center" 
              fontWeight={700} 
              sx={{ 
                background: "#00c2b2", 
                color: "#ffffff" 
              }}
            >
              Search Accounts
              <IconButton
                onClick={handleSearchClose}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 12,
                  color: "#ffffff",
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <Stack spacing={1} pt={3} pl={3} pr={3}>
              <Selection
                name="sex"
                label="Account Info"
              />
              <TextField
                name="name"
                placeholder="Name"
                label="User Info"
              />
              <TextField
                name="name"
                placeholder="Mail Address"
              />
              <TextField
                name="name"
                placeholder="Remarks"
              />
              <Selection
                name="sex"
                label="Course Info"
              />
              <DatePicker
                name="birthday"
                label="Registered Date"
                maxDate={new Date()}
              />
              <DatePicker
                name="birthday"
                maxDate={new Date()}
              />
              <RadioGroup
                name="gender"
                label="Last login day"
                row={false}
                options={[
                  { id: 1, name: "Not yet logged in" },
                  { id: 2, name: "Date 1 and Date 2" },
                ]}
              />
              <Selection
                name="sex"
                label="Display number of results"
              />
              <Selection
                name="sex"
              />
            </Stack>
            <Stack direction="row" spacing={2} p={3} justifyContent="center">
              <Button large color="inherit" variant="outlined" sx={{ borderRadius: 7 }}>Clear</Button>
              <Button large color="warning" variant="contained" sx={{ borderRadius: 7 }}>Search</Button>
            </Stack>
          </Dialog>

          <Dialog open={createAccountOpen} maxWidth="lg">
            <DialogTitle>
              <Typography
                fontWeight="bold"
                variant="h6"
                pl={1}
                sx={{ borderLeft: "5px solid #00c2b2" }}
              >
                アカウントを作成
              </Typography>
              <IconButton
                onClick={handleCreateAccountClose}
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
            <Stack spacing={1} p={3}>
              <TextField
                name="name"
                placeholder="Upload Image Here"
                label="アイコン画像"
              />
              <TextField
                name="name"
                placeholder="名前を入力"
                label="氏名"
              />
              <TextField
                name="name"
                placeholder="メールアドレスを入力"
                label="メールアドレス"
              />
              <TextField
                name="name"
                placeholder="メールアドレスを入力"
                label="メールアドレス（確認）"
              />
              <Selection
                name="sex"
                label="性別"
              />
              <DatePicker
                name="birthday"
                label="生年月日"
                maxDate={new Date()}
              />
              <TextField
                name="password"
                label="パスワード"
                type="password"
              />
              <TextField
                name="password_confirmation"
                label="パスワード（確認）"
                type="password"
              />
              <Selection
                name="sex"
                label="権限"
              />
              <Selection
                name="sex"
                label="所属"
              />
              <Selection
                name="sex"
                label="部署１"
              />
              <Selection
                name="sex"
                label="部署２"
              />
            </Stack>
            <Stack direction="row" spacing={2} p={3} justifyContent="center">
              <Button large color="inherit" variant="outlined" sx={{ borderRadius: 7 }}>キャンセル</Button>
              <Button large color="warning" variant="contained" sx={{ borderRadius: 7 }}>登録</Button>
            </Stack>
          </Dialog>

          <Dialog open={multipleAccountsOpen} maxWidth="lg">
            <DialogTitle>
              <Typography
                fontWeight="bold"
                variant="h6"
                pl={1}
                sx={{ borderLeft: "5px solid #00c2b2" }}
              >
                アカウントの複数登録
              </Typography>
              <IconButton
                onClick={handleMultipleAccountsClose}
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
            <Stack spacing={1} p={3}>
              <Card sx={{ border: "1px solid #dadfe1" }}>
                <CardHeader 
                  subheader="CSVファイルから登録" 
                  sx={{ 
                    background: "#dadfe1",
                    fontSize: "1rem"
                  }}
                  align="center"
                />
                <CardContent>
                  <TextField
                    name="name"
                    placeholder="Upload CSV File"
                    labelProps={{ compact: true }}
                  />
                </CardContent>
              </Card>
              <Stack direction="row" spacing={2} p={1} justifyContent="flex-end">
                <Typography>一括登録用のCSVテンプレート</Typography>
                <Button color="warning" variant="contained" sx={{ borderRadius: 7, width: 100 }}>ダウンロード</Button>
              </Stack>
              <Divider />
              <Stack direction="row" spacing={2} p={1} justifyContent="space-evenly">
                <Typography>「登録のお知らせ」メール配信</Typography>
                <FormControlLabel
                  label="メールを配信する"
                  control={
                    <Checkbox
                      size="small"
                      checked={checked}
                      onChange={(_, checked) => setChecked(checked)}
                    />
                  }
                />
              </Stack>
              {checked && (
                <>
                  <Stack direction="row" spacing={2} p={1}>
                    <Selection
                      name="sex"
                      label="性別"
                    />
                    <Button color="warning" variant="contained" sx={{ borderRadius: 7, width: 100 }}>メール整理</Button>
                  </Stack>
                  <TextField
                    name="name"
                    placeholder="Upload Image Here"
                    label="アイコン画像"
                  />
                  <TextField
                    name="name"
                    placeholder="名前を入力"
                    label="氏名"
                    multiline
                    rows={3}
                  />
                  <Stack direction="row" spacing={2} p={1} justifyContent="space-between">
                    <Typography sx={{ color: "red" }}>（※）上記タイトル・内容を保存できます。</Typography>
                    <Button color="warning" variant="contained" sx={{ borderRadius: 7, width: 100 }}>保存</Button>
                  </Stack>
                  <Selection
                    name="sex"
                    label="性別"
                  />
                </>
              )}
            </Stack>
            <Stack direction="row" spacing={2} p={3} justifyContent="center">
              <Button large color="inherit" variant="outlined" sx={{ borderRadius: 7 }}>キャンセル</Button>
              <Button large color="warning" variant="contained" sx={{ borderRadius: 7 }}>登録</Button>
            </Stack>
          </Dialog>
        </FormContainer>
      </Container>
    </Stack>
  );
}

export default Account;
