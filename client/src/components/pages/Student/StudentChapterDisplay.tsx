import CommonHeader from "@/components/organisms/Student/CommonHeader";
import { ChapterContextAttribute, QuestionAttributes } from "@/hooks/pages/Students/useChapter";
import useAlerter from "@/hooks/useAlerter";
import useConfirm from "@/hooks/useConfirm";
import { proceedTest, showTest, submitAnswers } from "@/services/TestService";
import createMap from "@/utils/createMap";
import {
  TestAttributes,
  testInit,
} from "@/validations/CourseFormValidation";
import { Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Outlet, useNavigate, useParams } from "react-router-dom";

// Purpose of this component is to display the details of a chapter
// with an option to redisplay the chapter videos and test(chapter-test)
// states(test, videos, questions) will be shared among its subcomponents
// if available. Test state will always be available, while videos and
// questions will only be fetched when the subcomponents are loaded.
interface StudentChapterDisplayProps {}

function StudentChapterDisplay({}: StudentChapterDisplayProps) {
  const mounted = useRef(true);
  const navigate = useNavigate();
  const { isConfirmed } = useConfirm();
  const { errorSnackbar, successSnackbar } = useAlerter();
  const { courseId, chapterId, testType, itemNumber } = useParams();
  const [test, setTest] = useState<TestAttributes>(testInit);
  const [questions, setQuestions] = useState<QuestionAttributes[]>([]);
  const [mappedQuestions, setMappedQuestions] = useState(
    new Map<number, QuestionAttributes>()
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);
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

  const prefix = `/course/${courseId}/chapter/${chapterId}/${testType}`;

  const fetchQuestions = async (item_number?: number) => {
    try {
      const res = await proceedTest(
        +chapterId!,
        testType === "chapter-test" ? 1 : 2,
        item_number
      );
      if (mounted.current) {
        setQuestions(res.data.data);
        setMappedQuestions(
          createMap<QuestionAttributes, number>(res.data.data, "item_number")
        );
        form.reset({
          answers: res.data.data.map((q: QuestionAttributes) =>
            Array(q.correct_answers_count)
              .fill("")
              .map((c, index) => ({
                question_id: q.id,
                answer: q.user_answer[index]?.answer || null,
                order: index + 1,
              }))
          ),
        });
      }
      return res.data.current_item as number;
    } catch (e: any) {
      errorSnackbar(e.message);
    }
  };

  const handleNext = async (fetch = false, updateForm = true) => {
    if (!updateForm && itemNumber) {
      const qindex = +itemNumber! - 1;
      const question = questions[qindex];
      form.setValue(
        `answers.${qindex}`,
        Array(question.correct_answers_count)
          .fill("")
          .map((c, index) => ({
            question_id: question.id,
            answer: question.user_answer[index]?.answer || null,
            order: index + 1,
          }))
      );
    }

    if (fetch) {
      const current_item = await fetchQuestions();
      navigate(testType + "/" + current_item);
    } else {
      navigate(prefix + "/" + (+itemNumber! + 1));
    }
  };

  const handleSubmit = form.handleSubmit(async (raw) => {
    const confirmed = await isConfirmed({
      title: "final answer?",
      content: "bigyan ng dyaket yan!!",
    });

    if (confirmed) {
      try {
        const res = await submitAnswers(
          +chapterId!,
          testType === "chapter-test" ? 1 : 2,
          raw.answers
        );
        navigate(prefix + "/result");
        setResult(res.data.result);
        setHasSubmitted(true);
        successSnackbar(res.data.message);
      } catch (e: any) {
        errorSnackbar(e.message);
      }
    }
  });

  useQuery(
    ["student-chapter-display", +chapterId!],
    () => showTest(
        +chapterId!,
        testType === "chapter-test" ? 1 : 2
      ),
    {
      refetchOnWindowFocus: false,
      enabled: !!chapterId,
      onSuccess: (res) => setTest(res.data.data)
    }
  );

  const headerTitle =
    test?.chapter_title +
    (hasSubmitted
      ? "章末テスト結果"
      : testType === "chapter-test"
      ? "章末テスト"
      : "理解度テスト");

  return (
    <Grid container spacing={2}>
      <CommonHeader image={test?.image || null} title={headerTitle} />
      <Outlet
        context={{
          test,
          handleNext,
          questions,
          mappedQuestions,
          fetchQuestions,
          prefix,
          form,
          handleSubmit,
          hasSubmitted,
          result,
          itemNumber: itemNumber ? Number(itemNumber) : -1,
          chapterId,
        }}
      />
    </Grid>
  );
}

export default StudentChapterDisplay;
