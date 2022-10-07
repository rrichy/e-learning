import CommonHeader from "@/components/organisms/Student/CommonHeader";
import useAlerter from "@/hooks/useAlerter";
import { proceedTest, showTest } from "@/services/TestService";
import createMap from "@/utils/createMap";
import {
  QuestionAttributes as FQuestionAttributes,
  TestAttributes,
  testInit,
} from "@/validations/CourseFormValidation";
import { Grid } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Outlet, useNavigate, useParams } from "react-router-dom";

// Purpose of this component is to display the details of a chapter
// with an option to redisplay the chapter videos and test(chapter-test)
// states(test, videos, questions) will be shared among its subcomponents
// if available. Test state will always be available, while videos and
// questions will only be fetched when the subcomponents are loaded.
interface StudentChapterDisplayProps {}

type QuestionAttributes = FQuestionAttributes & {
  correct_answers_count: number;
  id: number;
  user_answer: { question_id: number; answer: string | null; order: number }[];
  item_number: number;
};

function StudentChapterDisplay({}: StudentChapterDisplayProps) {
  const mounted = useRef(true);
  const navigate = useNavigate();
  const { errorSnackbar } = useAlerter();
  const { courseId, chapterId, testType, itemNumber } = useParams();
  const [test, setTest] = useState<TestAttributes>(testInit);
  const [questions, setQuestions] = useState<QuestionAttributes[]>([]);
  const [mappedQuestions, setMappedQuestions] = useState(
    new Map<number, QuestionAttributes>()
  );

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

  const handleSubmit = form.handleSubmit((raw) => {
    console.log(raw);
  });

  useEffect(() => {
    mounted.current = true;

    if (chapterId) {
      (async () => {
        try {
          const res = await showTest(
            +chapterId!,
            testType === "chapter-test" ? 1 : 2
          );
          if (mounted.current) {
            setTest(res.data.data);
          }
        } catch (e: any) {
          errorSnackbar(e.message);
        }
      })();
    }

    return () => {
      mounted.current = false;
    };
  }, [chapterId, testType]);

  return (
    <Grid container spacing={2}>
      <CommonHeader
        image={test.image || null}
        title={test.chapter_title || ""}
      />
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
        }}
      />
    </Grid>
  );
}

export default StudentChapterDisplay;
