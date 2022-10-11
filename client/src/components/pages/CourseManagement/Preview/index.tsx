import Button from "@/components/atoms/Button";
import CommonHeader from "@/components/organisms/Student/CommonHeader";
import TestDetailsDisplay from "@/components/organisms/Student/TestDetailsDisplay";
import { ChapterContextAttribute } from "@/hooks/pages/Students/useChapter";
import { CourseScreenType } from "@/interfaces/CommonInterface";
import ChapterPreviewProvider from "@/providers/ChapterPreviewProvider";
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
  Paper,
  Slide,
  Toolbar,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React, { useEffect, useMemo, useState } from "react";
import CourseDetailPreview from "./CourseDetailPreview";

interface PreviewProps {
  onClose: () => void;
  course: CourseFormAttribute | null;
  toScreen?: CourseScreenType;
}

const lectureRegex = /^chapter\/\d+\/lecture$/;
const chapterTestRegex = /^chapter\/\d+\/chapter-test$/;
const answerScreenRegex = /^chapter\/\d+\/chapter-test\/\d+$/;
const resultRegex = /^chapter\/\d+\/chapter-test\/result$/;

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

  const context = useMemo(() => {
    if (chapterIndex === undefined) return null;

    return {
      test:
        {
          ...course.chapters[chapterIndex].chapter_test,
          questions_count:
            course.chapters[chapterIndex].chapter_test?.questions.length,
        } ?? testInit,
      handleNext: () =>
        setTemplateScreen(`chapter/${chapterIndex}/chapter-test/1`),
    } as Partial<ChapterContextAttribute>;
  }, [course, chapterIndex]);

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

  console.log({ templateScreen, toScreen });
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
            {screen === "lecture" && "lecture"}
            {screen === "chapter-test" && "章末テストプレービュー"}
            {screen === "answer" && "テストシミュレーター"}
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
              <CommonHeader
                image={course.image || null}
                title={chapterIndex! + 1 + "章 章末テスト" || ""}
              />
              {screen === "chapter-test" && (
                <TestDetailsDisplay screenFn={setTemplateScreen} />
              )}
              {screen === "answer" && "テストシミュレーター"}
            </ChapterPreviewProvider>
          )}
        </Grid>
      </Container>
    </Dialog>
  );
}

export default Preview;
