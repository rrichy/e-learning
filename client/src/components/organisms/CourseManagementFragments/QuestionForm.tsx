import Button from "@/components/atoms/Button";
import {
  TextField as ATextField,
  Selection as ASelection,
} from "@/components/atoms/HookForms";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { QuestionAttributes } from "@/validations/CourseFormValidation";
import RadioQuestion from "@/components/molecules/RadioQuestion";
import PulldownQuestion from "@/components/molecules/PulldownQuestion";
import FreeQuestion from "@/components/molecules/FreeQuestion";
import { FormContainer } from "react-hook-form-mui";

interface QuestionFormProps {
  open: boolean;
  closeFn: () => void;
  itemNumber: number;
  formContext: UseFormReturn<QuestionAttributes>;
  onSubmit: (
    e: React.BaseSyntheticEvent<QuestionAttributes>
  ) => void | Promise<void>;
}

function QuestionForm({
  open,
  closeFn,
  itemNumber,
  formContext,
  onSubmit,
}: QuestionFormProps) {
  const {
    setValue,
    formState: { isDirty, isValid },
  } = formContext;

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="md"
      PaperProps={{ sx: { bgcolor: "#f7f7f7", overflowY: "unset" } }}
    >
      <DialogTitle sx={{ px: 0, pt: 0 }}>
        <Typography variant="sectiontitle1">問題を作成</Typography>
      </DialogTitle>
      <DialogContent>
        <FormContainer formContext={formContext} handleSubmit={onSubmit}>
          <Paper variant="subpaper">
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="sectiontitle2">
                  {`問${itemNumber}`}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <ATextField
                  fullWidth
                  size="small"
                  name="score"
                  label="配点"
                  type="number"
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={3}>
                <Button variant="contained" type="button">
                  プレビュー
                </Button>
              </Grid>
              <Grid item xs={12}>
                <ATextField
                  fullWidth
                  size="small"
                  name="title"
                  label="問題名"
                />
              </Grid>
              <Grid item xs={12}>
                <ATextField
                  fullWidth
                  size="small"
                  name="statement"
                  label="問題文"
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={6}>
                <ASelection
                  fullWidth
                  size="small"
                  name="format"
                  label="問題形式"
                  onChange={() => {
                    setValue("options", []);
                    setValue("correct_indexes", []);
                  }}
                  options={[
                    { id: 0, name: "未選択", selectionType: "disabled" },
                    { id: 1, name: "ラディオボタン" },
                    { id: 2, name: "プルダウン" },
                    { id: 3, name: "自由記述" },
                  ]}
                />
              </Grid>
              <RadioQuestion />
              <PulldownQuestion />
              <FreeQuestion />
              <Grid item xs={12}>
                <ATextField
                  fullWidth
                  size="small"
                  name="explanation"
                  label="説明"
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </Paper>

          <Stack direction="row" spacing={1} justifyContent="center" pt={2}>
            <Button
              type="button"
              large
              rounded
              color="inherit"
              variant="outlined"
              onClick={closeFn}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              large
              rounded
              color="secondary"
              variant="contained"
              disabled={!(isDirty && isValid)}
            >
              作成
            </Button>
          </Stack>
        </FormContainer>
      </DialogContent>
    </Dialog>
  );
}

export default QuestionForm;
