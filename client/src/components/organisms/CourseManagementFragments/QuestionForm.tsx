import Button from "@/components/atoms/Button";
import {
  TextField as ATextField,
  Selection as ASelection,
} from "@/components/atoms/HookForms";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { QuestionAttributes } from "@/validations/CourseFormValidation";
import RadioQuestion from "@/components/molecules/RadioQuestion";
import PulldownQuestion from "@/components/molecules/PulldownQuestion";
import FreeQuestion from "@/components/molecules/FreeQuestion";
import { FormContainer } from "react-hook-form-mui";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

interface QuestionFormProps {
  open: boolean;
  closeFn: () => void;
  itemNumber: number;
  formContext: UseFormReturn<QuestionAttributes>;
  onSubmit: (
    e: React.BaseSyntheticEvent<QuestionAttributes>
  ) => void | Promise<void>;
}

const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

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
    getValues,
  } = formContext;
  const [preview, setPreview] = useState<Partial<QuestionAttributes> | null>(
    null
  );

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="md"
      PaperProps={{ sx: { bgcolor: "#f7f7f7", overflowY: "unset" } }}
    >
      {Boolean(preview) && (
        <Button
          startIcon={<ArrowBack fontSize="large" sx={{ color: "white" }} />}
          size="large"
          onClick={() => setPreview(null)}
          sx={{ position: "absolute", right: 0, top: 10, color: "white" }}
          fit
          disableRipple
        >
          戻る
        </Button>
      )}
      <DialogTitle sx={{ px: 0, pt: 0 }}>
        <Typography variant="sectiontitle1">
          {!preview ? "問題を作成" : "問題プレービュー"}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {!preview ? (
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
                  <Button
                    variant="contained"
                    type="button"
                    onClick={() => setPreview(getValues())}
                  >
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
        ) : (
          <Paper variant="softoutline" sx={{ width: 1, height: 1 }}>
            <Typography variant="sectiontitle1" component="h3">
              {preview?.title}
            </Typography>
            <Box p={4}>
              <Typography
                variant="sectiontitle2"
                fontWeight="unset"
                fontSize={16}
                whiteSpace="pre-line"
              >
                {preview?.statement}
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  borderRadius: 0,
                  bgcolor: "#f7f7f7",
                  mt: 2,
                  p: "16px !important",
                }}
              >
                <Stack spacing={2}>
                  {preview?.format === 1 && (
                    <RadioGroup
                      value={preview!.options?.findIndex(
                        (a) => (a.correction_order || 0) > 0
                      )}
                    >
                      {preview!.options?.map((a, index) => (
                        <FormControlLabel
                          key={"radio-" + index}
                          value={index}
                          label={a.description}
                          control={<Radio />}
                        />
                      ))}
                    </RadioGroup>
                  )}
                  {preview?.format === 2 && (
                    <Stack spacing={1}>
                      {preview.correct_indexes?.map((a, index) => (
                        <Stack
                          direction="row"
                          spacing={2}
                          width={1}
                          flex={1}
                          alignItems="center"
                          key={"selection-" + index}
                        >
                          <Typography
                            width={50}
                            fontWeight="bold"
                            textAlign="right"
                          >
                            {alpha[index]}:
                          </Typography>
                          <TextField
                            value={preview.options?.[a].description}
                            select
                            size="small"
                            fullWidth
                            InputProps={{
                              readOnly: true,
                            }}
                          >
                            <MenuItem value={preview.options?.[a].description}>
                              {preview.options?.[a].description}
                            </MenuItem>
                          </TextField>
                        </Stack>
                      ))}
                    </Stack>
                  )}
                  {preview?.format === 3 && (
                    <Stack spacing={1}>
                      {preview.options?.map((a, index) => (
                        <Stack
                          direction="row"
                          spacing={2}
                          width={1}
                          flex={1}
                          alignItems="center"
                          key={"textfield-" + index}
                        >
                          <Typography
                            width={50}
                            fontWeight="bold"
                            textAlign="right"
                          >
                            {alpha[index]}:
                          </Typography>
                          <TextField
                            value={a.description}
                            size="small"
                            fullWidth
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </Stack>
                      ))}
                    </Stack>
                  )}
                </Stack>
              </Paper>
              <Stack
                spacing={2}
                direction="row"
                justifyContent="space-around"
                mt={2}
              >
                <Button
                  variant="outlined"
                  disabled
                  sx={{
                    width: 150,
                    boxShadow: (t) => `0 3px ${t.palette.primary.main}`,
                    "&.Mui-disabled": {
                      boxShadow: "0 3px #0000001f",
                    },
                  }}
                >
                  あとで解答する
                </Button>
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  disabled
                  sx={{
                    height: 38.5,
                    width: 150,
                  }}
                >
                  次の問題へ
                </Button>
              </Stack>
            </Box>
          </Paper>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default QuestionForm;
