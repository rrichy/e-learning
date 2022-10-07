import {
  QuestionAttributes as FQuestionAttributes,
  TestAttributes,
} from "@/validations/CourseFormValidation";
import { UseFormReturn } from "react-hook-form";
import { useOutletContext } from "react-router-dom";

export type QuestionAttributes = FQuestionAttributes & {
  correct_answers_count: number;
  id: number;
  user_answer: { question_id: number; answer: string | null; order: number }[];
  item_number: number;
};

type ContextAttribute = {
  test: TestAttributes;
  handleNext: (b?: boolean, c?: boolean) => void;
  questions: QuestionAttributes[];
  setQuestions: React.Dispatch<React.SetStateAction<QuestionAttributes[]>>;
  mappedQuestions: Map<number, QuestionAttributes>;
  setMappedQuestions: React.Dispatch<
    React.SetStateAction<Map<number, QuestionAttributes>>
  >;
  fetchQuestions: (i?: number) => void;
  prefix: string;

  form: UseFormReturn<
    {
      answers: {
        question_id: number;
        answer: string | null;
        order: number;
      }[][];
    },
    any
  >;
  handleSubmit: (
    e?: React.BaseSyntheticEvent<object, any, any> | undefined
  ) => Promise<void>;
};

function useChapter(preview = false) {
  // if preview {}

  return useOutletContext<ContextAttribute>();
}

export default useChapter;
