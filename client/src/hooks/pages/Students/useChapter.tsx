import { ChapterPreviewContext } from "@/providers/ChapterPreviewProvider";
import {
  QuestionAttributes as FQuestionAttributes,
  TestAttributes,
} from "@/validations/CourseFormValidation";
import { useContext } from "react";
import { UseFormReturn } from "react-hook-form";
import { useOutletContext } from "react-router-dom";

export type QuestionAttributes = FQuestionAttributes & {
  correct_answers_count: number;
  id: number;
  user_answer: { question_id: number; answer: string | null; order: number }[];
  item_number: number;
  answered_correctly: boolean;
};

export type ChapterContextAttribute = {
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
  hasSubmitted: boolean;
  result: {
    passed: boolean;
    score: number;
    total: number;
    questions: QuestionAttributes[];
  };
  itemNumber: number;
  chapterId: number;
};

function useChapter(
  preview = false
): ChapterContextAttribute | Partial<ChapterContextAttribute> {
  if (preview) return useContext(ChapterPreviewContext);

  return useOutletContext<ChapterContextAttribute>();
}

export default useChapter;
