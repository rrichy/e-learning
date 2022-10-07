<?php

namespace App\Services;

use App\Http\Requests\NoticeStoreUpdateRequest;
use App\Http\Requests\SubmitTestRequest;
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
use App\Models\UserAnswer;
use Illuminate\Support\Facades\DB;

class ChapterService
{
    // public function list()
    // {
    //     $order = request()->input('order', 'asc');
    //     $per_page = request()->input('per_page', '10');
    //     $sort = request()->input('sort', 'id');

    //     if (auth()->user()->isIndividual()) {
    //         return NoticeHomepageResource::collection(
    //             Notice::with('user')
    //                 ->where(fn ($q) => $q->where('affiliation_id', auth()->user()->affiliation_id)->orWhereNull('affiliation_id'))
    //                 ->where('shown_in_bulletin', true)
    //                 ->orderBy($sort, $order)
    //                 ->paginate($per_page)
    //         );
    //     }

    //     return NoticeIndexResource::collection(
    //         Notice::with('user')
    //             ->when(
    //                 auth()->user()->isCorporate(), 
    //                 fn ($q) => $q->where('affiliation_id', auth()->user()->affiliation_id)
    //             )->orderBy($sort, $order)
    //             ->paginate($per_page)
    //     )->additional(['message' => 'Notices successfully fetched!']);
    // }


    public function testDetails(Chapter $chapter)
    {
        $test_type = intval(request('test_type')) === Test::CHAPTER ? 'chapterTest' : 'comprehensionTest';

        $this->check_if_chapter_is_accessible($chapter);

        return new TestDetailResource(
            $chapter->load([
                $test_type => fn ($q) => $q->withCount('questions')->withSum('questions', 'score')
            ])
        );
    }


    public function proceedTest(Chapter $chapter)
    {
        $test_type = intval(request('test_type')) === Test::CHAPTER ? 'chapterTest' : 'comprehensionTest';

        $this->check_if_chapter_is_accessible($chapter);

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
            // 'test_details' => $req_item_number
            //     ?   [
            //         'chapter_title' => $chapter->item_number . "章 " . ($test_type === 'chapterTest' ? "章末テスト" : "理解度テスト"),
            //         'image' => $chapter->course->image,
            //     ]
            //     : null
        ]);
    }

    public function submitTest(SubmitTestRequest $request, Chapter $chapter)
    {
        $test_type = intval(request('test_type')) === Test::CHAPTER ? 'chapterTest' : 'comprehensionTest';

        $this->check_if_chapter_is_accessible($chapter);
        // if test_type is comprehensionTest, check if student is eligible in taking the test
        // here

        $valid = $request->validated();

        DB::transaction(function () use ($valid) {
            foreach ($valid['answers'] as $v) {
                UserAnswer::create(array_merge($v, [
                    'user_id' => auth()->id(),
                    'date_submitted' => now(),
                ]));
            }
        });

        return response()->json([
            'message' => 'Successfully submitted test answers!'
        ]);
    }

    // public function 
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
