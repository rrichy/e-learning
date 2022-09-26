import {
  Card,
  CardContent,
  CardHeader,
  Container,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import Button from "@/components/atoms/Button";
import { FormContainer } from "react-hook-form-mui";
import {
  DatePicker,
  Selection,
  TextField,
  RadioGroup,
} from "../../molecules/LabeledHookForms";
import Trash from "@/assets/icon-trash.svg";
// import { RadioGroup } from "@/components/atoms/HookForms";
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';

function NoticeManagementAdd() {
  return (
    <Stack justifyContent="space-between">
      <Container>
        <Stack spacing={3} sx={{ p: 3 }}>
          <FormContainer>
            <Paper variant="softoutline" sx={{ p: 6 }}>
              <Stack spacing={3}>
                {/* <Typography
                  fontWeight="bold"
                  variant="h6"
                  pl={1}
                  sx={{ borderLeft: "5px solid #00c2b2" }}
                >
                  コースを作成
                </Typography> */}

                <Card>
                  <CardHeader
                    title="お知らせ登録"
                    sx={{
                      fontWeight: "bold",
                      background: "#000000",
                      color: "#ffffff",
                      fontSize: "1.25rem",
                    }}
                  />
                  <CardContent>
                    <Stack spacing={2}>
                      <TextField
                        name="subject"
                        label="Subject Name"
                        placeholder="Subject Name"
                      />
                      <TextField
                        name="content"
                        label="content"
                        placeholder="content"
                        multiline
                        rows={3}
                      />
                      <RadioGroup
                        name="gender"
                        label="Posting method"
                        row={false}
                        options={[
                          { id: 1, name: "post notice" },
                          { id: 2, name: "Deliver mail" },
                        ]}
                      />
                      <RadioGroup
                        name="target"
                        label="Target"
                        row={false}
                        options={[
                          { id: 1, name: "everyone" },
                          { id: 2, name: "group" },
                          { id: 3, name: "individual" },
                          { id: 4, name: "course" },
                        ]}
                      />
                      <DatePicker
                        name="birthday"
                        label="posting period"
                        maxDate={new Date()}
                      />
                      <DatePicker
                        name="birthday"
                        maxDate={new Date()}
                      />
                      <Selection name="sex" label="signature" />
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>

              <Stack direction="row" spacing={2} pt={5} justifyContent="center">
                {/* <Button large color="inherit" variant="outlined" sx={{ borderRadius: 7 }}>キャンセル</Button> */}
                <Button large color="warning" variant="contained" sx={{ borderRadius: 7 }}>Cancel</Button>
                <Button large variant="contained" sx={{ borderRadius: 7 }}>Confirmation</Button>
              </Stack>
            </Paper>
          </FormContainer>
        </Stack>
      </Container>
    </Stack>
  );
}

export default NoticeManagementAdd;
