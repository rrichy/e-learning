import { QuestionAttributes } from "@/hooks/pages/Students/useChapter";

export default function calculateResult(
  passing_score: number,
  questions: QuestionAttributes[],
  user_answers: { answers: QuestionAttributes["user_answer"][] }
) {
  let score = 0;
  let total = 0;
  const checked: QuestionAttributes[] = [];

  questions.forEach((question, index) => {
    let answered_correctly = false;
    total += +question.score!;
    if (
      user_answers.answers[index].every(({ order, answer }) =>
        question.options.some(
          ({ description, correction_order }) =>
            description.trim() === answer?.trim() && order === correction_order
        )
      )
    ) {
      score += +question.score!;
      answered_correctly = true;
    }

    checked.push({
      ...question,
      answered_correctly,
      user_answer: user_answers.answers[index],
    });
  });

  const passed = score >= passing_score;

  return {
    passed,
    score,
    total,
    questions: checked,
  };
}
