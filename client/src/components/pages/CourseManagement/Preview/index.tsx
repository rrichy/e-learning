import Button from "@/components/atoms/Button";
import CommonHeader from "@/components/organisms/Student/CommonHeader";
import TestAnswerScreen from "@/components/organisms/Student/TestAnswerScreen";
import TestDetailsDisplay from "@/components/organisms/Student/TestDetailsDisplay";
import TestResult from "@/components/organisms/Student/TestResultV2";
import {
  ChapterContextAttribute,
  QuestionAttributes,
} from "@/hooks/pages/Students/useChapter";
import { CourseScreenType } from "@/interfaces/CommonInterface";
import ChapterPreviewProvider from "@/providers/ChapterPreviewProvider";
import calculateResult from "@/utils/calculateResult";
import createMap from "@/utils/createMap";
import {
  CourseFormAttribute,
  courseFormInit,
  testInit,
} from "@/validations/CourseFormValidation";
import { Close } from "@mui/icons-material";
import {
  AppBar,
  Container,
  Dialog,
  Grid,
  Slide,
  Toolbar,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form-mui";
import CourseDetailPreview from "./CourseDetailPreview";
import LecturePreview from "./LecturePreview";

interface PreviewProps {
  onClose: () => void;
  course: CourseFormAttribute | null;
  toScreen?: CourseScreenType;
}

const lectureRegex = /^chapter\/\d+\/lecture$/;
const chapterTestRegex = /^chapter\/\d+\/chapter-test$/;
const answerScreenRegex = /^chapter\/\d+\/chapter-test\/\d+$/;
// const resultRegex = /^chapter\/\d+\/chapter-test\/result$/;

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Preview({
  onClose,
  course: coursePreview,
  toScreen = "course",
}: PreviewProps) {
  const [templateScreen, setTemplateScreen] =
    useState<CourseScreenType>(toScreen);
  const [course, setCourse] = useState<CourseFormAttribute>(courseFormInit);
  const [initialized, setInitialized] = useState(false);
  const [result, setResult] = useState<ChapterContextAttribute["result"]>({
    passed: true,
    score: 0,
    total: 0,
    questions: [],
  });

  const form = useForm<{ answers: QuestionAttributes["user_answer"][] }>({
    mode: "onChange",
    defaultValues: { answers: [] },
  });

  const screen = useMemo(() => {
    if (templateScreen === "course") return "course";
    if (lectureRegex.test(templateScreen)) return "lecture";
    if (chapterTestRegex.test(templateScreen)) return "chapter-test";
    if (answerScreenRegex.test(templateScreen)) return "answer";
    return "result";
  }, [templateScreen]);

  const { chapterIndex, itemIndex } = useMemo(() => {
    if (templateScreen === "course") return {};

    const match = templateScreen.match(/\d+/gi);

    return {
      chapterIndex: Number(match?.[0]),
      itemIndex: match?.[1] ? Number(match?.[1]) : undefined,
    };
  }, [templateScreen]);

  const questions: any[] = useMemo(() => {
    return (
      course.chapters[chapterIndex ?? -1]?.chapter_test?.questions.map(
        (a, index) => ({
          ...a,
          item_number: index + 1,
          correct_answers_count: a.options.filter(
            (b) => (b.correction_order || 0) > 0
          ).length,
          user_answer:
            a.options
              .filter((b) => (b.correction_order || 0) > 0)
              .map((b, index) => ({
                question_id: index,
                answer: "",
                order: index + 1,
              })) || [],
        })
      ) || []
    );
  }, [course, chapterIndex]);

  const context = useMemo(() => {
    if (chapterIndex === undefined) return null;

    return {
      test:
        {
          ...course.chapters[chapterIndex].chapter_test,
          questions_count:
            course.chapters[chapterIndex].chapter_test?.questions.length,
        } ?? testInit,
      handleNext: (fetch = false, updateForm = true) => {
        if (!updateForm) {
          const question = questions[itemIndex ?? 0];
          form.setValue(
            `answers.${itemIndex ?? 0}`,
            Array(question.correct_answers_count)
              .fill("")
              .map((c, index) => ({
                question_id: index,
                answer: question.user_answer[index]?.answer || null,
                order: index + 1,
              }))
          );
        }
        setTemplateScreen(
          `chapter/${chapterIndex}/chapter-test/${(itemIndex ?? 0) + 1}`
        );
      },
      handleSubmit: () => {
        const result = calculateResult(
          course.chapters[chapterIndex].chapter_test?.passing_score || 0,
          questions,
          form.getValues()
        );

        setResult(result);
        setTemplateScreen(`chapter/${chapterIndex}/chapter-test/result`);
      },
      questions,
      mappedQuestions: createMap<any, number>(questions, "item_number"),
      itemNumber: itemIndex ?? 0,
      form,
      prefix: `chapter/${chapterIndex}/chapter-test`,
      result,
      hasSubmitted: Boolean(result),
    } as Partial<ChapterContextAttribute>;
  }, [course, chapterIndex, itemIndex, form, questions, result]);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setTemplateScreen("course");
      setInitialized(false);
    }, 200);
  };

  useEffect(() => {
    if (!initialized && coursePreview) {
      setTemplateScreen(toScreen);
      setCourse(coursePreview);
      setInitialized(true);
    }
  }, [initialized, coursePreview, toScreen]);

  useEffect(() => {
    form.reset({
      answers: questions.map((q: QuestionAttributes) =>
        Array(q.correct_answers_count)
          .fill("")
          .map((_c, index) => ({
            question_id: q.id,
            answer: q.user_answer?.[index]?.answer || null,
            order: index + 1,
          }))
      ),
    });
  }, [form, questions]);

  const headerTitle = `${chapterIndex! + 1}章 ${
    screen === "lecture"
      ? "理解度テスト"
      : screen === "chapter-test"
      ? "章末テスト"
      : "章末テスト結果"
  }`;

  return (
    <Dialog
      fullScreen
      open={Boolean(coursePreview)}
      TransitionComponent={Transition}
      PaperProps={{
        sx: { bgcolor: "#fafafa" },
      }}
    >
      <AppBar sx={{ position: "relative" }} elevation={0}>
        <Toolbar>
          <Typography
            sx={{ ml: 2, flex: 1 }}
            variant="h6"
            component="div"
            fontWeight="bold"
          >
            {screen === "course" && "コースプレービュー"}
            {screen === "lecture" && "解説動画プレービュー"}
            {screen === "chapter-test" && "章末テストプレービュー"}
            {screen === "answer" && "テストシミュレーター"}
            {screen === "result" && "章末テスト結果プレービュー"}
          </Typography>
          <Button
            color="inherit"
            onClick={handleClose}
            startIcon={<Close />}
            fit
          >
            CLOSE
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Grid container spacing={2}>
          {screen === "course" && (
            <CourseDetailPreview course={course} screenFn={setTemplateScreen} />
          )}
          {context && (
            <ChapterPreviewProvider context={context}>
              <CommonHeader image={course.image || null} title={headerTitle} />
              {screen === "chapter-test" && (
                <TestDetailsDisplay screenFn={setTemplateScreen} />
              )}
              {screen === "answer" && (
                <TestAnswerScreen screenFn={setTemplateScreen} />
              )}
              {screen === "result" && <TestResult preview />}
              {screen === "lecture" && (
                <LecturePreview
                  chapterNumber={(chapterIndex || 0) + 1}
                  lectures={
                    course.chapters[chapterIndex || 0].explainer_videos ?? []
                  }
                />
              )}
            </ChapterPreviewProvider>
          )}
        </Grid>
      </Container>
    </Dialog>
  );
}

export default Preview;
