<?php

namespace App\Services;

use App\Http\Requests\NoticeStoreUpdateRequest;
use App\Http\Requests\SubmitTestRequest;
use App\Http\Resources\ListVideoResource;
use App\Http\Resources\NoticeHomepageResource;
use App\Http\Resources\NoticeIndexResource;
use App\Http\Resources\NoticeShowResource;
use App\Http\Resources\QuestionResource;
use App\Http\Resources\Student\StudentQuestionResource;
use App\Http\Resources\TestDetailResource;
use App\Models\Chapter;
use App\Models\Course;
use App\Models\Notice;
use App\Models\Test;
use App\Models\TestResult;
use App\Models\UserAnswer;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class ChapterService
{
    public function listVideos(Chapter $chapter)
    {
        return ListVideoResource::collection(
            $chapter->explainerVideos()
                ->with(['viewingInformations' => fn ($q) => $q->whoseUserIdIs(auth()->id())])
                ->orderBy('item_number', 'asc')
                ->get()
        )->additional(['chapterNumber' => $chapter->item_number]);
    }


    public function testDetails(Chapter $chapter, string $test_type)
    {
        $this->check_if_chapter_is_accessible($chapter);

        // APPEND is_not_allowed if user has reached the max tries
        return new TestDetailResource(
            $chapter->load([
                $test_type => fn ($q) => $q->withCount('questions')->withSum('questions', 'score')
            ])
        );
    }


    public function proceedTest(Chapter $chapter, string $test_type)
    {
        $this->check_if_chapter_is_accessible($chapter);

        // check if user is allowed to take/submit test
        //here

        $test = $chapter[$test_type];

        $req_item_number = request('item_number');

        $item_number = intval($req_item_number)
            ?: $test->questions()
            ->whereHas('userAnswers', fn ($u) => $u->where('user_id', auth()->id())->whereNull('answer'))
            ->first()
            ?: 1;

        $this->check_if_item_number_exists($test, $item_number);

        return StudentQuestionResource::collection(
            $test->questions()
                ->with('options')
                ->withCount(['options as correct_answers_count' => fn ($q) => $q->whereNotNull('correction_order')])
                ->get()
        )->additional([
            'current_item' => $item_number,
        ]);
    }

    public function submitTest(array $valid, Chapter $chapter, string $test_type)
    {
        $this->check_if_chapter_is_accessible($chapter);
        // if test_type is comprehensionTest, check if student is eligible in taking the test
        // here

        // check if user is allowed to take/submit test
        //here

        $test = $chapter[$test_type];
        $user_answers = [];
        $calculated_result = "";
        DB::transaction(function () use ($valid, &$user_answers, &$calculated_result, $test) {
            foreach ($valid['answers'] as $v) {
                $user_answers[] = UserAnswer::create(array_merge($v, [
                    'user_id' => auth()->id(),
                    'date_submitted' => now(),
                ]))->id;
            }

            $calculated_result =
                $this->calculateResult(
                    $test,
                    $user_answers,
                    true
                )
                + [
                    'number_of_tries' => (TestResult::where([['user_id', auth()->id()], ['test_id', $test->id]])->max('number_of_tries') ?? 0) + 1,
                    'test_id' => $test->id,
                    'user_id' => auth()->id(),
                ];

            $result = TestResult::create($calculated_result);

            UserAnswer::whereIn('id', $user_answers)->update(['test_result_id' => $result->id]);
        });

        return response()->json([
            'message' => 'Successfully submitted test answers!',
            'result' => $calculated_result,
        ]);
    }

    public function calculateResult(Test $test, array $user_answers_id)
    {
        $test->load([
            'questions.userAnswers' => function ($ua) use ($user_answers_id) {
                $ua->whereIn('id', $user_answers_id);
            },
            'questions.options'
        ]);

        $total = 0;
        $score = 0;
        $questions = [];

        $test['questions']->each(function ($question) use (&$total, &$score, &$questions) {
            $total += $question['score'];

            $user_correct_count = 0;
            $user_answers = $question['userAnswers'];
            $correct_answers = $question['options']->where('correction_order', '>', 0);

            $correct_answers->each(function ($correct_option) use (&$user_correct_count, $user_answers) {
                $user_correct_count += $user_answers->where('order', $correct_option['correction_order'])
                    ->where('answer', trim($correct_option['description']))->count();
            });

            if ($correct_answers->count() === $user_correct_count) $score += $question['score'];

            $questions[] = [
                'id' => $question['id'],
                'item_number' => $question['item_number'],
                'title' => $question['title'],
                'statement' => $question['statement'],
                'format' => $question['format'],
                'score' => $question['score'],
                'user_answer' => $question['userAnswers']->map(fn ($u) => ['answer' => $u['answer'], 'order' => $u['order']]),
                'explanation' => $question['explanation'],
                'options' => $question['options']->map(fn ($o) => [
                    'correction_order' => $o['correction_order'],
                    'description' => $o['description'],
                    'item_number' => $o['item_number'],
                ]),
                'answered_correctly' => $correct_answers->count() === $user_correct_count
            ];
        });

        $passed = $score >= $test['passing_score'];

        $result = compact('total', 'score', 'passed', 'questions');

        return $result;
    }
    // public function store(NoticeStoreUpdateRequest $request)
    // {
    //     $valid = $request->validated();

    //     $notice = Notice::create(array_merge(
    //         $valid,
    //         [
    //             'shown_in_bulletin' => in_array(1, $valid['posting_method']),
    //             'shown_in_mail' => in_array(2, $valid['posting_method']),
    //             'priority' => Notice::max('priority') + 1,
    //         ]
    //     ));

    //     // event(new NoticePost($notice));

    //     return $notice;
    // }

    // public function update(NoticeStoreUpdateRequest $request, Notice $notice)
    // {
    //     abort_if(
    //         auth()->user()->isCorporate() && auth()->user()->affiliation_id !== $notice->affiliation_id,
    //         403,
    //         "This action is unauthorized."
    //     );

    //     $valid = $request->validated();

    //     $notice->update(array_merge(
    //         $valid,
    //         [
    //             'shown_in_bulletin' => in_array(1, $valid['posting_method']),
    //             'shown_in_mail' => in_array(2, $valid['posting_method']),
    //         ]
    //     ));

    //     // event(new NoticePost($notice));

    //     return $notice;
    // }


    // public function deleteIds(string $ids)
    // {
    //     $auth = auth()->user();
    //     $ids = explode(',', $ids);

    //     if ($auth->isAdmin()) return Notice::destroy($ids);

    //     $validIdCount = Notice::where('affiliation_id', $auth->affiliation_id)->whereIn('id', $ids)->count();
    //     abort_if(
    //         count($ids) !== $validIdCount,
    //         403,
    //         'You have no authority of deleting some of these notices'
    //     );

    //     return Notice::destroy($ids);
    // }

    private function check_if_chapter_is_accessible(Chapter $chapter)
    {
        // check if auth()->user() is individual/student
        // -> already done in api middleware ['membership:individual']

        // check if course.chapter is accessible
        abort_if(
            $chapter->course->status !== Course::PUBLIC,
            403,
            'This chapter is not accessible'
        );
    }

    private function check_if_item_number_exists(Test $test, int $item_number)
    {
        abort_if(
            $test->questions()->where('item_number', $item_number) === null,
            404,
            'No such item_number found'
        );
    }
}
