import { 
  Card, 
  CardContent, 
  CardHeader, 
  Container, 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  Divider, 
  IconButton, 
  Paper, 
  Typography 
} from "@mui/material";
import { Stack } from "@mui/system";
import Button from "@/components/atoms/Button";
import { FormContainer } from "react-hook-form-mui";
import {
  Selection,
  TextField,
} from "../../molecules/LabeledHookForms";
import { RadioGroup } from "@/components/atoms/HookForms";
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

function ComprehensionTestAdd() {
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
          <FormContainer>
            <Paper variant="softoutline" sx={{ p: 6 }}>
              <Stack spacing={3}>
                <Typography 
                  fontWeight="bold" 
                  variant="h6" 
                  pl={1} 
                  sx={{ borderLeft: '5px solid #00c2b2' }}
                >
                  理解度テストを作成
                </Typography>
                
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
                      <Selection
                        name="sex"
                        label="合格ライン"
                      />
                      <TextField
                        name="name"
                        label="章末テストタイトル"
                        placeholder="章末テストタイトルを入力"
                      />
                      <TextField
                        name="name"
                        label="章末テスト内容"
                        placeholder="章末テストの説明を入力"
                        multiline
                        rows={3}
                      />
                    </Stack>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader 
                    title="問題 (Droppable)" 
                    sx={{ 
                      fontWeight: "bold",
                      background: "#000000",
                      color: "#ffffff",
                      fontSize: "1.25rem"
                    }}
                  />
                  <CardContent>
                    <Stack p={2}>
                      <RadioGroup
                        name="gender"
                        row={false}
                        options={[
                          { id: 1, name: "全期間" },
                          { id: 2, name: "Date 1 and Date 2" },
                        ]}
                      />
                    </Stack>
                    <Stack direction="row" justifyContent="flex-end">
                      <Button
                        type="button"
                        variant="contained"
                        color="warning"
                        sx={{ height: 30, width: "fit-content", borderRadius: 6 }}
                        onClick={handleClickOpen}
                      >
                        問題を追加
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>

              <Stack direction="row" spacing={2} pt={5} justifyContent="center">
                <Button large color="inherit" variant="outlined" sx={{ borderRadius: 7 }}>キャンセル</Button>
                <Button large variant="contained" sx={{ borderRadius: 7 }}>プレビュー</Button>
                <Button large color="warning" variant="contained" sx={{ borderRadius: 7 }}>章末テストを作成</Button>
              </Stack>
            </Paper>

            <Dialog open={open} maxWidth="lg">
              <DialogTitle>
                <Typography 
                  fontWeight="bold" 
                  variant="h6" 
                  pl={1} 
                  sx={{ borderLeft: '5px solid #00c2b2' }}
                >
                  問1
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
                        label="配点"
                        placeholder="配点を入力"
                      />
                      <TextField
                        name="name"
                        label="問題名"
                        placeholder="問題名を入力"
                      />
                      <TextField
                        name="name"
                        label="問題文"
                        placeholder="問題文を入力"
                        multiline
                        rows={3}
                      />
                      <Selection
                        name="sex"
                        label="問題形式"
                      />
                      <Stack direction="row" justifyContent="flex-end" pb={1}>
                        <Button
                          type="button"
                          variant="contained"
                          color="info"
                          sx={{ height: 30, width: "fit-content" }}
                        >
                          問題を追加
                        </Button>
                      </Stack>
                      <Divider />
                      <Typography>正解</Typography>
                      <Stack>
                        <TextField
                          name="name"
                          placeholder="Enter explanation"
                          multiline
                          rows={3}
                          labelProps={{ compact: true }}
                        />
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
                <Stack direction="row" spacing={1} justifyContent="center" pt={2}>
                  <Button large color="inherit" variant="outlined" sx={{ borderRadius: 7 }}>キャンセル</Button>
                  <Button large variant="contained" sx={{ borderRadius: 7 }}>プレビュー</Button>
                  <Button large color="warning" variant="contained" sx={{ borderRadius: 7 }}>作成</Button>
                </Stack>
              </DialogContent>
            </Dialog>

          </FormContainer>
        </Stack>
      </Container>
    </Stack>
  );
}

export default ComprehensionTestAdd;
