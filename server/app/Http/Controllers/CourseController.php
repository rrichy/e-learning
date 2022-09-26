<?php

namespace App\Http\Controllers;

use App\Http\Requests\CourseRequest;
use App\Http\Resources\CourseIndexResource;
use App\Models\Course;
use App\Http\Resources\CourseListResource;
use App\Http\Resources\CourseShowResource;
use App\Models\Category;
use App\Models\Chapter;
use App\Models\ExplainerVideo;
use App\Models\Question;
use App\Models\QuestionOption;
use App\Models\Test;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     * Display a listing of the resource. Requests may have search parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $status = request()->input('status');

        abort_if($status === null, 400, "No status parameter");

        if ($status === "both") {
            return CourseIndexResource::collection(Category::with(['courses' => function ($q) {
                $q->orderBy('priority', 'asc');
            }])->orderBy('priority', 'asc')->get());
        }

        return CourseListResource::collection(Category::with(['courses' => function ($q) use ($status) {
            $q->where('status', Course::STATUS[$status] ?? Course::STATUS['public']);
        }])->get());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\CourseRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CourseRequest $request)
    {
        $valid = $request->validated();
        $message = 'Failed to create a course';

        DB::transaction(function () use ($valid, &$message) {
            $course = Course::create($valid);

            foreach ($valid['chapters'] as $chapter_data) {
                $chapter = Chapter::create(array_merge($chapter_data, ['course_id' => $course->id]));
                $chapter_test = Test::create(array_merge($chapter_data['chapter_test'], [
                    'chapter_id' => $chapter->id,
                    'test_type' => Test::TEST_TYPES['chapter']
                ]));

                foreach ($chapter_data['chapter_test']['questions'] as $question_data) {
                    $question = Question::create(array_merge($question_data, [
                        'test_id' => $chapter_test->id,
                    ]));

                    // upsert on leaf models
                    QuestionOption::upsert(
                        parent::appendAttribute($question_data['options'], 'question_id', $question->id),
                        ['id'],
                        [
                            'question_id',
                            'correction_order',
                            'item_number',
                            'description',
                        ]
                    );
                }

                // explainer videos
                ExplainerVideo::upsert(
                    parent::appendAttribute($chapter_data['explainer_videos'], 'chapter_id', $chapter->id),
                    ['id'],
                    [
                        'chapter_id',
                        'item_number',
                        'title',
                        'content',
                        'video_file_path',
                    ]
                );

                $chapter_ids[] = $chapter->id;
            }

            $message = 'Successfully created a course!';
        });

        return response()->json([
            'message' => $message,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Course  $course
     * @return \Illuminate\Http\Response
     */
    public function show(Course $course)
    {
        return new CourseShowResource(
            $course->load([
                'chapters' => fn ($chapter) => $chapter->with([
                    'chapterTest' => fn ($q) => $q->with([
                        'questions' => fn ($question) => $question->with([
                            'options' => fn ($w) => $w->orderBy('item_number', 'asc')
                        ])->orderBy('item_number', 'asc')
                    ]),
                    'explainerVideos'
                ])->orderBy('item_number', 'asc')
            ])
        );
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\CourseRequest  $request
     * @param  \App\Models\Course  $course
     * @return \Illuminate\Http\Response
     */
    public function update(CourseRequest $request, Course $course)
    {
        Gate::authorize('update-course', $course);

        $valid = $request->validated();
        DB::transaction(function () use ($course, $valid) {
            $before = now();
            $course->update($valid);

            $chapter_ids = [];
            foreach ($valid['chapters'] as $chapter_data) {
                $chapter = Chapter::updateOrCreate(
                    ['id' => $chapter_data['id']],
                    array_merge($chapter_data, ['course_id' => $course->id])
                );
                if (isset($chapter_data['chapter_test'])) {
                    $test = Test::updateOrCreate([
                        'chapter_id' => $chapter->id,
                        'test_type' => Test::TEST_TYPES['chapter']
                    ], $chapter_data['chapter_test']);

                    $questions = [];
                    foreach ($chapter_data['chapter_test']['questions'] as $question_data) {
                        $question = Question::updateOrCreate([
                            'id' => $question_data['id'],
                            'test_id' => $test->id,
                        ], $question_data);

                        // upsert on leaf models
                        QuestionOption::upsert(
                            parent::appendAttribute($question_data['options'], 'question_id', $question->id),
                            ['id'],
                            [
                                'question_id',
                                'correction_order',
                                'item_number',
                                'description',
                            ]
                        );
                        $question->options()->where('updated_at', '<', $before)->delete();

                        $questions[] = $question->id;
                    }
                    $test->questions()->whereNotIn('id', $questions)->delete();

                    // Question::upsert(
                    //     parent::appendAttribute($chapter_data['chapter_test']['questions'], 'test_id', $test->id),
                    //     ['id'],
                    //     [
                    //         'test_id',
                    //         'item_number',
                    //         'title',
                    //         'statement',
                    //         'format',
                    //         'score',
                    //         'explaination'
                    //     ]
                    // );
                    // $test->questions()->where('updated_at', '<', $before)->delete();
                }

                // slow approach
                // $xvideo_ids = [];
                // foreach($chapter_data['explainer_videos'] as $xvideo_data) {
                //     $xvideo = ExplainerVideo::updateOrCreate([
                //         'id' => $xvideo_data['id'],
                //         'chapter_id' => $chapter->id,
                //     ], $xvideo_data);
                //     $xvideo_ids[] = $xvideo->id;
                // }
                // $chapter->explainerVideos()->whereNotIn('id', $xvideo_ids)->delete();

                // experimental approach
                ExplainerVideo::upsert(
                    parent::appendAttribute($chapter_data['explainer_videos'], 'chapter_id', $chapter->id),
                    ['id'],
                    [
                        'chapter_id',
                        'item_number',
                        'title',
                        'content',
                        'video_file_path',
                    ]
                );
                $chapter->explainerVideos()->where('updated_at', '<', $before)->delete();

                $chapter_ids[] = $chapter->id;
            }

            $course->chapters()->whereNotIn('id', $chapter_ids)->delete();
        });

        return response()->json([
            'message' => 'Successfully updated a course!',
        ]);
    }

    /**
     * Mass delete courses given the ids
     *
     * @param  string  $ids
     * @return \Illuminate\Http\Response
     */
    public function massDelete(string $ids)
    {
        $ids = explode(",", $ids);
        $deleted_count = \App\Models\Course::destroy($ids);

        return response()->json([
            'message' => 'Successfully deleted ' . $deleted_count . ' courses!',
        ]);
    }

    /**
     * Mass update priority number of courses
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function massUpdate(Request $request)
    {
        // Gate::authorize('massUpdate-course', $course);

        $rules = [
            'payload' => 'array',
            'payload.*.category_id' => 'required|integer',
            'payload.*.changes' => 'array',
            'payload.*.changes.*.id' => 'required|integer|distinct|exists:courses,id',
        ];
        
        foreach ($request->payload as $index => $category) {
            $course_ids = array_map(fn ($q) => $q['id'], $category['changes']);
            $rules['payload.' . $index . '.changes.*.priority'] = [
                'required',
                'integer',
                'distinct',
                'min:1',
                Rule::unique('courses', 'priority')
                    ->where(function ($q) use ($category, $course_ids) {
                        $q->where('category_id', $category['category_id'])
                            ->whereNotIn('id', $course_ids);
                    })
            ];
        }

        $count = 0;
        foreach ($request->validate($rules)['payload'] as $category) {
            foreach ($category['changes'] as $course) {
                Course::find($course['id'])->update(['priority' => $course['priority']]);
                $count++;
            }
        }

        return response()->json([
            'message' => 'Successfully updated ' . $count . ' courses!',
        ]);
    }

    /**
     * Mass update of the resource toggling its resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function toggleStatus(Request $request)
    {
        $valid = $request->validate([
            'ids' => 'array',
            'ids.*' => 'numeric|exists:courses,id',
            'status' => 'required|string|in:public,private',
        ]);

        Course::whereIn('id', $valid['ids'])->update(['status' => Course::STATUS[$valid['status']]]);

        return response()->json([
            'message' => 'Successfully updated the courses!',
        ]);
    }
}
