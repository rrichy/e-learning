import Button from "@/components/atoms/Button";
import { RadioGroup } from "@/components/atoms/HookForms";
import Link from "@/components/atoms/Link";
import { Selection, TextField } from "@/components/molecules/LabeledHookForms";
import useChapter, {
  QuestionAttributes,
} from "@/hooks/pages/Students/useChapter";
import useAlerter from "@/hooks/useAlerter";
import { CourseScreenType } from "@/interfaces/CommonInterface";
import { ArrowForward } from "@mui/icons-material";
import { Box, Checkbox, Grid, Link as MUILink, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { FormContainer } from "react-hook-form-mui";
import { useParams } from "react-router-dom";

const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type TestDetails = {
  questions: QuestionAttributes[];
  mappedQuestions: Map<number, QuestionAttributes>;
};

// ENSURE NO DATA FETCHING IN THIS COMPONENT

function TestAnswerScreen({
  screenFn,
}: {
  screenFn?: (s: CourseScreenType) => void;
}) {
  const [initialized, setInitialized] = useState(false);
  const { itemNumber } = useParams();
  const [questions, setQuestions] = useState<QuestionAttributes[]>([]);
  const [mappedQuestions, setMappedQuestions] = useState(
    new Map<number, QuestionAttributes>()
  );
  const { errorSnackbar } = useAlerter();
  const chapter = useChapter(Boolean(screenFn));

  useEffect(() => {
    if (chapter && !initialized) {
      if (chapter.questions.length) {
        setQuestions(chapter.questions);
        setMappedQuestions(chapter.mappedQuestions);
        setInitialized(true);
      } else {
        chapter.fetchQuestions(+itemNumber!);
      }
    }
  }, [chapter, errorSnackbar, initialized]);

  const currentItem = chapter.itemNumber;
  const currentQuestion = mappedQuestions.get(currentItem);

  const checkboxes = chapter.form
    .watch("answers")
    .map((a) => a.every((b) => Boolean(b.answer)));

  return (
    <>
      <Grid item xs={12} md={8}>
        <Paper variant="softoutline" sx={{ width: 1, height: 1 }}>
          <Typography variant="sectiontitle1" component="h3">
            {currentQuestion?.title}
          </Typography>
          <Box p={4}>
            <Typography
              variant="sectiontitle2"
              fontWeight="unset"
              fontSize={16}
              whiteSpace="pre-line"
            >
              {currentQuestion?.statement}
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
              <FormContainer
                formContext={chapter.form}
                handleSubmit={chapter.handleSubmit}
              >
                <Stack spacing={2}>
                  {currentQuestion?.format === 1 && (
                    <RadioGroup
                      name={`answers.${currentItem - 1}.${0}.answer`}
                      options={currentQuestion?.options}
                      labelKey="description"
                      valueKey="description"
                    />
                  )}
                  {currentQuestion?.format === 2 &&
                    Array(currentQuestion.correct_answers_count)
                      .fill("")
                      .map((_, index) => (
                        <Selection
                          key={currentItem + "-selection-" + index}
                          label={alpha[index] + ":"}
                          name={`answers.${currentItem - 1}.${index}.answer`}
                          options={currentQuestion?.options}
                          labelKey="description"
                          valueKey="description"
                        />
                      ))}
                  {currentQuestion?.format === 3 &&
                    Array(currentQuestion.correct_answers_count)
                      .fill("")
                      .map((_, index) => (
                        <TextField
                          key={currentItem + "-textfield-" + index}
                          label={alpha[index] + ":"}
                          name={`answers.${currentItem - 1}.${index}.answer`}
                        />
                      ))}
                </Stack>
              </FormContainer>
            </Paper>
            <Stack
              spacing={2}
              direction="row"
              justifyContent="space-around"
              mt={2}
            >
              <Button
                variant="outlined"
                onClick={() => chapter.handleNext(false, false)}
                disabled={currentItem === questions.length}
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
                onClick={() => chapter.handleNext()}
                endIcon={<ArrowForward />}
                disabled={currentItem === questions.length}
                sx={{
                  height: 38.5,
                  width: 150,
                }}
              >
                次の問題へ
                {/* {currentItem === questions.length ? "完了" : "次の問題へ"} */}
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper variant="softoutline" sx={{ width: 1, height: 1 }}>
          <Typography variant="sectiontitle1" component="h3">
            解答状況
          </Typography>
          <Stack direction="row" m={2} gap={1} flexWrap="wrap">
            {checkboxes.map((checked, index) =>
              screenFn ? (
                <MUILink
                  key={index}
                  component="button"
                  onClick={() => screenFn(`${chapter?.prefix!}/${index + 1}`)}
                  color={index + 1 === currentItem ? "secondary" : "primary"}
                  flex={1}
                  whiteSpace="nowrap"
                >
                  {index + 1}
                  <Checkbox checked={checked} disableRipple size="small" />
                </MUILink>
              ) : (
                <Link
                  key={index}
                  to={`${chapter?.prefix}/${index + 1}`}
                  color={index + 1 === currentItem ? "secondary" : "primary"}
                  flex={1}
                  whiteSpace="nowrap"
                >
                  {index + 1}
                  <Checkbox checked={checked} disableRipple size="small" />
                </Link>
              )
            )}
            <Button
              variant="contained"
              color="tertiary"
              endIcon={<ArrowForward />}
              sx={{ mt: 3 }}
              disabled={!checkboxes.every(Boolean)}
              onClick={() => chapter.handleSubmit()}
            >
              受験を終了する
            </Button>
          </Stack>
        </Paper>
      </Grid>
    </>
  );
}

export default TestAnswerScreen;
