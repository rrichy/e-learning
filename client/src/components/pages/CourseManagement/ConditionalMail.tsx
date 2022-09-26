import {
  Container,
  Dialog,
  DialogContent, 
  DialogTitle,
  DialogActions,
  IconButton,
  Paper,
  Typography,
  Grid,
  Divider,
} from "@mui/material";
import { Stack } from "@mui/system";
import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import { FormContainer } from "react-hook-form-mui";
import CloseIcon from '@mui/icons-material/Close';
import {
  DatePicker,
  // RadioGroup,
  Selection,
  TextField,
} from "../../molecules/LabeledHookForms";
import { RadioGroup } from "@/components/atoms/HookForms";
import MaterialTable from "material-table";
import InputOutlinedIcon from '@mui/icons-material/InputOutlined';
import Labeler from "@/components/molecules/Labeler";

function ConditionalMail() {
  const [open, setOpen] = useState(false);
  const [openAddContent, setOpenAddContent] = useState(false);
  const [openReplacement, setOpenReplacement] = useState(false);
  const [dataAll, setDataAll] = useState([
    { send_state: "開講メール" },
    { send_state: "閉講メール" },
  ]);
  const [dataReminder, setDataReminder] = useState([
    { send_state: "開講日ー1日" },
    { send_state: "開講日ー7日" },
    { send_state: "開講日ー30日" },
  ]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenAddContent = () => {
    setOpenAddContent(true);
  };
  const handleCloseAddContent = () => {
    setOpenAddContent(false);
  };

  const handleOpenReplacement = () => {
    setOpenReplacement(true);
  };
  const handleCloseReplacement = () => {
    setOpenReplacement(false);
  };
  
  return (
    <Stack justifyContent="space-between">
      <Container>
        <FormContainer>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Typography
              fontWeight="bold"
              variant="h6"
              pl={1}
              sx={{ borderLeft: "5px solid #00c2b2" }}
            >
              条件付きメール
            </Typography>
            <Paper variant="outlined" sx={{ p: 6 }}>
              <Stack spacing={3}>
                <Stack spacing={2} direction="row" justifyContent="space-between">
                  <Stack spacing={1} direction="row" alignItems="center">
                    <Typography>全員送信</Typography>
                  </Stack>
                  <Stack spacing={1} direction="row">
                    <Button
                      variant="contained"
                      sx={{ width: "fit-content" }}
                    >
                      削除
                    </Button>
                  </Stack>
                </Stack>
                <MaterialTable 
                  columns={[
                    { field: "send_state", title: "送信状態" },
                    { 
                      field: "content", 
                      title: "内容", 
                      render: () => (
                        <Button
                          variant="contained"
                          sx={{ width: "fit-content" }}
                          onClick={handleClickOpen}
                        >
                          内容
                        </Button>
                      ),
                    },
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
                  data={dataAll}
                />
                <Grid container spacing={3} justifyContent="space-between" alignItems="flex-end">
                  <Grid xs={12} sm={4} pr={1}>
                    <Selection
                      name="sex"
                      label="送信状態"
                      labelProps={{ compact: true }}
                    />
                  </Grid>
                  <Grid xs={12} sm={2} pr={1}>
                    <Button
                      variant="contained"
                      sx={{ width: "fit-content" }}
                      onClick={handleOpenAddContent}
                    >
                      内容
                    </Button>
                  </Grid>
                  <Grid xs={12} sm={2} pr={1} justifyContent="center">
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ width: "fit-content" }}
                      startIcon={<InputOutlinedIcon />}
                    >
                      Delete
                    </Button>
                  </Grid>
                </Grid>
                <Button
                  type="button"
                  variant="contained"
                  color="secondary"
                >
                  日程追加✙
                </Button>
              </Stack>

            </Paper>

            <Paper variant="outlined" sx={{ p: 6 }}>
              <Stack spacing={3}>
                <Stack spacing={2} direction="row" justifyContent="space-between">
                  <Stack spacing={1} direction="row" alignItems="center">
                    <Typography>締め切り督促メール（受講完了・合格以外へ送信）</Typography>
                  </Stack>
                  <Stack spacing={1} direction="row">
                    <Button
                      variant="contained"
                      sx={{ width: "fit-content" }}
                    >
                      削除
                    </Button>
                  </Stack>
                </Stack>
                <MaterialTable 
                  columns={[
                    { field: "send_state", title: "送信状態" },
                    { 
                      field: "content", 
                      title: "内容",
                      render: () => (
                        <Button
                          variant="contained"
                          sx={{ width: "fit-content" }}
                          onClick={handleClickOpen}
                        >
                          内容
                        </Button>
                      ), 
                    },
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
                  data={dataReminder}
                />
                <Grid container spacing={3} justifyContent="space-between" alignItems="flex-end">
                  <Grid xs={12} sm={4} pr={1}>
                    <Stack direction="row" spacing={1}>
                      <Selection
                        name="sex"
                        label="送信状態"
                        labelProps={{ compact: true }}
                      />
                      <TextField
                        name="name"
                        label="日数"
                        labelProps={{ compact: true }}
                      />
                    </Stack>
                  </Grid>
                  <Grid xs={12} sm={2} pr={1}>
                    <Button
                      variant="contained"
                      sx={{ width: "fit-content" }}
                      onClick={handleOpenAddContent}
                    >
                      内容
                    </Button>
                  </Grid>
                  <Grid xs={12} sm={2} pr={1} justifyContent="center">
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ width: "fit-content" }}
                      startIcon={<InputOutlinedIcon />}
                    >
                      Delete
                    </Button>
                  </Grid>
                </Grid>
                <Button
                  type="button"
                  variant="contained"
                  color="secondary"
                >
                  日程追加✙
                </Button>
              </Stack>
            </Paper>

            <Stack direction="row" spacing={1} justifyContent="flex-end" pt={2}>
              <Button 
                large 
                startIcon={<InputOutlinedIcon />} 
                color="inherit" 
                variant="outlined" 
                sx={{ borderRadius: 7 }}
              >
                設定
              </Button>
              <Button 
                large 
                startIcon={<InputOutlinedIcon />} 
                color="secondary" 
                variant="contained" 
                sx={{ borderRadius: 7 }}
              >
                確認
              </Button>
            </Stack>
          </Stack>
        
          <Dialog 
            open={open} 
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { bgcolor: "#f7f7f7" } }}
          >
            <DialogTitle sx={{ px: 0, pt: 0 }}>
              <Typography variant="sectiontitle1">内容</Typography>
            </DialogTitle>
            <DialogContent>
              <Paper variant="subpaper">
                <Stack spacing={2} alignItems="center">
                  <TextField
                    name="name"
                    label="氏名"
                    labelProps={{ compact: true, accent: true }}
                  />
                  <TextField
                    name="name"
                    label="氏名"
                    labelProps={{ compact: true, accent: true }}
                    placeholder="内容を入力"
                    multiline
                    rows={3}
                  />
                  <Button 
                    color="secondary" 
                    variant="contained" 
                    sx={{ width:"fit-content" }}
                    startIcon={<InputOutlinedIcon />}
                    onClick={handleOpenReplacement}
                  >
                    自動置換はこちら
                  </Button>
                </Stack>
              </Paper>

              <Stack alignItems="center" spacing={2} pt={2}>
                <Typography>email: admin@gmail.com</Typography>
                <Button 
                  color="secondary" 
                  variant="contained" 
                  sx={{ width:"fit-content" }}
                  startIcon={<InputOutlinedIcon />}
                >
                  テスト配信
                </Button>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Stack direction="row" spacing={1} justifyContent="flex-end" pt={2}>
                <Button 
                  color="inherit" 
                  variant="outlined" 
                  sx={{ width:"fit-content" }}
                  onClick={handleClose}
                >
                  戻る
                </Button>
                <Button 
                  color="secondary" 
                  variant="contained" 
                  sx={{ width: 175 }}
                  startIcon={<InputOutlinedIcon />}
                >
                  入力
                </Button>
              </Stack>
            </DialogActions>
          </Dialog>

          <Dialog 
            open={openAddContent}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { bgcolor: "#f7f7f7" } }}
          >
            <DialogTitle sx={{ px: 0, pt: 0 }}>
              <Typography variant="sectiontitle1">条件付きメール内容</Typography>
            </DialogTitle>
            <DialogContent>
              <Paper variant="subpaper">
                <Stack spacing={2} alignItems="center">
                  <TextField
                    name="name"
                    label="タイトル"
                    labelProps={{ compact: true, accent: true }}
                  />
                  <TextField
                    name="name"
                    label="内容"
                    labelProps={{ compact: true, accent: true }}
                    placeholder="内容を入力"
                    multiline
                    rows={3}
                  />
                </Stack>
              </Paper>
            </DialogContent>
            <DialogActions>
              <Stack direction="row" spacing={1} justifyContent="flex-end" pt={2}>
                <Button 
                  variant="contained" 
                  sx={{ width:"fit-content" }}
                  onClick={handleOpenReplacement}
                >
                  自動置換はこちら
                </Button>
                <Button 
                  color="inherit" 
                  variant="outlined" 
                  sx={{ width:"fit-content" }}
                  onClick={handleCloseAddContent}
                >
                  戻る
                </Button>
                <Button 
                  color="secondary" 
                  variant="contained" 
                  sx={{ width: 175 }}
                  startIcon={<InputOutlinedIcon />}
                >
                  入力
                </Button>
              </Stack>
            </DialogActions>
          </Dialog>

          <Dialog 
            open={openReplacement}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { bgcolor: "#f7f7f7" } }}
          >
            <DialogTitle sx={{ px: 0, pt: 0 }}>
              <Typography variant="sectiontitle1">自動置換</Typography>
            </DialogTitle>
            <DialogContent>
              <Paper variant="subpaper">
                <Grid container>
                  <Grid xs={6}>
                    <Typography fontWeight={700}>[user.email]</Typography>
                  </Grid>
                  <Grid xs={6}>
                    <Typography>ログインID</Typography>
                  </Grid>
                  <Grid xs={12} pt={2} pb={2}><Divider /></Grid>

                  <Grid xs={6}>
                    <Typography fontWeight={700}>[user.remarks]</Typography>
                  </Grid>
                  <Grid xs={6}>
                    <Typography>備考</Typography>
                  </Grid>
                  <Grid xs={12} pt={2} pb={2}><Divider /></Grid>
                  
                  <Grid xs={6}>
                    <Typography fontWeight={700}>[user.last_login_at]</Typography>
                  </Grid>
                  <Grid xs={6}>
                    <Typography>最後ログイン</Typography>
                  </Grid>
                  <Grid xs={12} pt={2} pb={2}><Divider /></Grid>
                  
                  <Grid xs={6}>
                    <Typography fontWeight={700}>[dept.name]</Typography>
                  </Grid>
                  <Grid xs={6}>
                    <Typography>部署名</Typography>
                  </Grid>
                  <Grid xs={12} pt={2} pb={2}><Divider /></Grid>
                  
                  <Grid xs={6}>
                    <Typography fontWeight={700}>[parent_category.name]</Typography>
                  </Grid>
                  <Grid xs={6}>
                    <Typography>親カテゴリ名</Typography>
                  </Grid>
                  <Grid xs={12} pt={2} pb={2}><Divider /></Grid>
                  
                  <Grid xs={6}>
                    <Typography fontWeight={700}>[child_category.name]</Typography>
                  </Grid>
                  <Grid xs={6}>
                    <Typography>子カテゴリ名</Typography>
                  </Grid>
                  <Grid xs={12} pt={2} pb={2}><Divider /></Grid>
                  
                  <Grid xs={6}>
                    <Typography fontWeight={700}>[course.start_date]</Typography>
                  </Grid>
                  <Grid xs={6}>
                    <Typography>コース開始日</Typography>
                  </Grid>
                  <Grid xs={12} pt={2} pb={2}><Divider /></Grid>
                  
                  <Grid xs={6}>
                    <Typography fontWeight={700}>[course.status]</Typography>
                  </Grid>
                  <Grid xs={6}>
                    <Typography>コースステータス</Typography>
                  </Grid>
                  <Grid xs={12} pt={2} pb={2}><Divider /></Grid>
                  
                  <Grid xs={6}>
                    <Typography fontWeight={700}>[course starting_time_period]</Typography>
                  </Grid>
                  <Grid xs={6}>
                    <Typography>開始期間</Typography>
                  </Grid>
                  <Grid xs={12} pt={2} pb={2}><Divider /></Grid>
                  
                  <Grid xs={6}>
                    <Typography fontWeight={700}>[course.ending_time_period]</Typography>
                  </Grid>
                  <Grid xs={6}>
                    <Typography>終了期間</Typography>
                  </Grid>
                  <Grid xs={12} pt={2} pb={2}><Divider /></Grid>
                  
                  <Grid xs={6}>
                    <Typography fontWeight={700}>[attending_course.progress_rate]</Typography>
                  </Grid>
                  <Grid xs={6}>
                    <Typography>進捗率</Typography>
                  </Grid>
                  <Grid xs={12} pt={2} pb={2}><Divider /></Grid>
                  
                  <Grid xs={6}>
                    <Typography fontWeight={700}>[attending_course.end_date]</Typography>
                  </Grid>
                  <Grid xs={6}>
                    <Typography>コース受講完了日</Typography>
                  </Grid>
                  <Grid xs={12} pt={2} pb={2}><Divider /></Grid>
                  
                  <Grid xs={6}>
                    <Typography fontWeight={700}>[test_answer_result.score]</Typography>
                  </Grid>
                  <Grid xs={6}>
                    <Typography>テストの結果</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </DialogContent>
            <DialogActions>
              <Stack direction="row" spacing={1} justifyContent="flex-end" pt={2}>
                <Button 
                  color="inherit" 
                  variant="outlined" 
                  sx={{ width:"fit-content" }}
                  onClick={handleCloseReplacement}
                >
                  閉じる
                </Button>
              </Stack>
            </DialogActions>
          </Dialog>

        </FormContainer>
      </Container>
    </Stack>
  );
}

export default ConditionalMail;
