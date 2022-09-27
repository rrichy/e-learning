import {
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Dialog,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import Button from "@/components/atoms/Button";
import { FormContainer } from "react-hook-form-mui";
import {
  Selection,
  TextField,
} from "../../molecules/LabeledHookForms";
import CloseIcon from '@mui/icons-material/Close';
import { OptionAttribute } from "@/interfaces/CommonInterface";
import AccountManagementSearch from "@/components/organisms/AccountManagementFragment/AccountManagementSearchAccordion";
import MaterialTable from "material-table";
import Link from "@/components/atoms/Link";

function AccountManagement() {
  const [multipleAccountsOpen, setMultipleAccountsOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleMultipleAccountsOpen = () => {
    setMultipleAccountsOpen(true);
  };
  const handleMultipleAccountsClose = () => {
    setMultipleAccountsOpen(false);
  };

  const [categories, setCategories] = useState<OptionAttribute[]>([
    { id: 0, name: "未選択", selectionType: "disabled" },
  ]);

  const [data, setData] = useState([
    { 
      email: "trevionshields@gmail.com", 
      name: "Trevion Shields", 
      affiliation: "Enrise Global",
      department: "Jackson Beer DDS Child 3",
      registered_date: "2022-09-18",
      last_login_date: "2022-09-18"
    },
  ]);
  
  return (
    <>
      <Stack
        spacing={3}
        sx={{
          p: 3,
          "& tbody tr:nth-last-of-type(1) td": {
            borderBottom: "none !important",
          },
        }}
      >
        <FormContainer>
          <AccountManagementSearch categories={categories} />
        </FormContainer>
        <Stack
          spacing={2}
          justifyContent="center"
          direction="row"
          sx={{ "& .MuiButton-root": { maxWidth: 200 } }}
        >
          <Button to="create" variant="contained" rounded>
            新規作成
          </Button>
          <Button variant="contained" rounded onClick={handleMultipleAccountsOpen}>
            一括登録
          </Button>
        </Stack>
        <Paper variant="outlined">
          <Stack spacing={3}>
            <Typography variant="sectiontitle2">所属の管理</Typography>
            <Stack spacing={1} direction="row" pb={3}>
              <Button
                variant="contained"
                color="secondary"
                sx={{ width: "fit-content", borderRadius: 6 }}
              >
                削除
              </Button>
            </Stack>
          </Stack>
          <Typography>検索結果: 12 人</Typography>
          <MaterialTable 
            columns={[
              { 
                field: "email", 
                title: "メールアドレス",
                render: (row) => (
                  <Link to={`/account-management/1/detail`}>
                    {row.email}
                  </Link>
                ) 
              },
              { field: "name", title: "氏名" },
              { field: "affiliation", title: "所属" },
              { field: "department", title: "部署" },
              { field: "registered_date", title: "登録日" },
              { field: "last_login_date", title: "最終ログイン日" },
            ]}
            options={{
              toolbar: false,
              draggable: false,
              paging: false,
              maxBodyHeight: 600,
              selection: true,
            }}
            components={{
              Container: (props) => <Paper {...props} variant="table" />,
            }}
            data={data}
          />
        </Paper>
      </Stack>

      <FormContainer>
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
    </>
  );
}

export default AccountManagement;
