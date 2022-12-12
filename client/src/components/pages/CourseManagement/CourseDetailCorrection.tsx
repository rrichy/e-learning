import { Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import Button from "@/components/atoms/Button";
import { FormContainer } from "react-hook-form-mui";
import {
  DatePicker,
  Selection,
  TextField,
} from "../../molecules/LabeledHookForms";

function CourseDetailCorrection() {
  return (
    <FormContainer>
      <Paper variant="outlined">
        <Stack spacing={3}>
          <Typography variant="sectiontitle2">受講詳細修正</Typography>
          <Paper variant="sectionsubpaper">
            <Typography variant="sectiontitle3">更新</Typography>
            <Paper variant="outlined" sx={{ m: { xs: 2, md: 4 }, p: 2 }}>
              <Typography variant="sectiontitle2">
                Course Information
              </Typography>
              <Stack spacing={2} p={2} alignItems="center">
                <TextField
                  name="title"
                  label="Course name"
                  placeholder="コースタイトルを入力"
                  disabled
                />
                <Selection name="category_id" label="Status" />
              </Stack>
              <Typography variant="sectiontitle2">User Info</Typography>
              <Stack spacing={2} p={2} alignItems="center">
                <TextField
                  name="title"
                  label="Name"
                  placeholder="コースタイトルを入力"
                  disabled
                />
              </Stack>
              <Typography variant="sectiontitle2">Course Info</Typography>
              <Stack spacing={2} p={2} alignItems="center">
                <DatePicker
                  name="start_date"
                  label="Start Date"
                  maxDate={new Date()}
                />
                <DatePicker
                  name="course_start_date"
                  label="Course Start Date"
                  maxDate={new Date()}
                />
                <TextField
                  name="progress_rate"
                  label="Progress Rate"
                  placeholder="コースタイトルを入力"
                />
                <TextField
                  name="score"
                  label="Score"
                  placeholder="コースタイトルを入力"
                />
                <DatePicker
                  name="course_end_date"
                  label="Course End Date"
                  maxDate={new Date()}
                />
                <DatePicker
                  name="end_date"
                  label="End Date"
                  maxDate={new Date()}
                />
              </Stack>
              <Typography variant="sectiontitle2">Detailed Info</Typography>
              <Stack spacing={2} p={2} alignItems="center">
                <TextField
                  name="suspended_data"
                  label="Suspended Data"
                  placeholder="コースタイトルを入力"
                />
                <TextField
                  name="work_sheet_data"
                  label="Work Sheet Data"
                  placeholder="コースタイトルを入力"
                />
                <TextField
                  name="questionnaire_data"
                  label="Questionnaire Data"
                  placeholder="コースタイトルを入力"
                />
                <TextField
                  name="position"
                  label="Position"
                  placeholder="コースタイトルを入力"
                />
              </Stack>
            </Paper>
          </Paper>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              color="dull"
              variant="outlined"
              rounded
              large
              type="button"
              to="/course-management"
            >
              キャンセル
            </Button>
            <Button
              color="secondary"
              variant="contained"
              rounded
              large
              type="submit"
            >
              Update (Confirmation first)
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </FormContainer>
  );
}

export default CourseDetailCorrection;
