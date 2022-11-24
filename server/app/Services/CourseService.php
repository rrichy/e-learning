<?php

namespace App\Services;

use App\Http\Requests\CourseRequest;
use App\Http\Resources\AttendeeResource;
use App\Http\Resources\CourseIndexResource;
use App\Http\Resources\CourseListResource;
use App\Http\Resources\CourseParsedResource;
use App\Http\Resources\CourseShowResource;
use App\Http\Resources\Student\StudentCourseShowResource;
use App\Models\AttendingCourse;
use App\Models\Category;
use App\Models\Chapter;
use App\Models\Course;
use App\Models\ExplainerVideo;
use App\Models\MembershipType;
use App\Models\Question;
use App\Models\QuestionOption;
use App\Models\Test;
use App\Models\User;
use Exception;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class CourseService
{
    public function index(string $status, User $user)
    {
        if ($user->isIndividual()) {
            return CourseListResource::collection(
                Category::whereHas('courses', fn ($q) => $q->isPublic())
                    ->with(
                        ['courses' => fn ($q) => $q->isPublic()]
                    )->get()
            );
        }

        if ($status === "both") {
            return CourseIndexResource::collection(
                Category::with(['courses' => function ($q) {
                    $q->orderBy('priority', 'asc');
                }])->when(
                    $user->isCorporate(),
                    function ($q) use ($user) {
                        $q->where('affiliation_id', $user->affiliation_id);
                    }
                )->orderBy('priority', 'asc')
                    ->get()
            );
        }

        return CourseListResource::collection(
            Category::with(['courses' => function ($q) use ($status) {
                $q->where('status', Course::STATUS[$status] ?? Course::STATUS['public'])
                    ->withCount([
                        'attendingCourses as attendees',
                        'attendingCourses as current_attendees' => fn ($q) => $q->isActive()
                    ]);
            }])
                ->when(
                    $user->isCorporate(),
                    function ($q) use ($user) {
                        $q->where('affiliation_id', $user->affiliation_id);
                    }
                )->get()
        );
    }


    public function details(Course $course, User $user, bool $parsed = false)
    {
        if ($user->isIndividual()) {
            return new StudentCourseShowResource(
                $course->load([
                    'chapters' => fn ($chapter) => $chapter->orderBy('item_number', 'asc')->orderBy('item_number', 'asc')
                ])
            );
        }

        abort_if(
            $user->isCorporate() && $user->affiliation_id !== $course->category->affiliation_id,
            403,
            'You have no authority of viewing this course!'
        );

        if ($parsed) return new CourseParsedResource(
            $course->loadCount([
                'attendingCourses as attendees',
                'attendingCourses as current_attendees' => fn ($q) => $q->isActive()
            ])->load([
                'category',
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


    public function update(CourseRequest $request, Course $course)
    {
        abort_if(
            auth()->user()->isCorporate() && auth()->user()->affiliation_id !== $course->category->affiliation_id,
            403,
            'You have no authority of updating this course!'
        );

        $valid = $request->validated();

        DB::transaction(function () use ($course, $valid) {
            $s3_image_url = auth()->user()->temporaryUrls()->where('directory', 'courses/')->first();

            if ($s3_image_url) {
                $s3_image_url->delete();
                abort_if($s3_image_url->url !== $valid['image'], 403, 'Image url mismatch!');
            }

            $s3_video_urls = auth()->user()->temporaryUrls()->where('directory', 'chapters/')->delete();
            // abort if some $valid['chapters.*.video_file_path'] mismatch
            // abort_if($s3_video_urls->url !== $valid['image'], 403, 'Image url mismatch!');

            $old_image = $course->image;

            $course->update($valid);

            $this->updateChapters($course, $valid['chapters']);

            if ($s3_image_url) {
                Storage::delete(str_replace(config('constants.prefixes.s3'), '', $old_image));
            }
            // delete old videos
            // if ($s3_video_urls) {
            //     Storage::delete(str_replace(config('constants.prefixes.s3'), '', $old_image));
            // }
        });
    }


    public function store(CourseRequest $request)
    {
        $valid = $request->validated();
        $message = 'Failed to create a course';

        DB::transaction(function () use ($valid, &$message) {
            $course = Course::create($valid);

            $s3_image_url = auth()->user()->temporaryUrls()->where('directory', 'courses/')->first();

            if ($s3_image_url) {
                $s3_image_url->delete();
                abort_if($s3_image_url->url !== $valid['image'], 403, 'Image url mismatch!');
            }

            $s3_video_urls = auth()->user()->temporaryUrls()->where('directory', 'chapters/')->delete();
            // abort if some $valid['chapters.*.video_file_path'] mismatch
            // abort_if($s3_video_urls->url !== $valid['image'], 403, 'Image url mismatch!');

            $this->createChapters($course, $valid['chapters']);

            $message = 'Successfully created a course!';
        });
    }


    public function deleteIds(string $ids)
    {
        $auth = auth()->user();
        $ids = explode(',', $ids);

        if ($auth->isAdmin()) return Course::destroy($ids);

        $validIdCount = Course::where('affiliation_id', $auth->affiliation_id)->whereIn('id', $ids)->count();
        abort_if(
            count($ids) !== $validIdCount,
            403,
            'You have no authority of deleting some of these courses'
        );
    }


    public function updatePriorities(Request $request)
    {
        $auth = auth()->user();
        $course_ids = array_map(fn ($q) => $q['category_id'], $request->payload);

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

        $valid = $request->validate($rules);

        if ($auth->isCorporate()) {
            $ids = array_map(fn ($item) => $item['id'], $valid['payload']);
            $validIdCount = Course::whereHas(
                'category',
                function ($q) use ($auth) {
                    $q->where('affiliation_id', $auth->affiliation_id);
                }
            )->whereIn('id', $ids)
                ->count();

            abort_if(
                count($ids) !== $validIdCount,
                403,
                'You have no authority of updating some of these courses!'
            );
        }

        $count = 0;
        foreach ($valid['payload'] as $category) {
            foreach ($category['changes'] as $course) {
                Course::find($course['id'])->update(['priority' => $course['priority']]);
                $count++;
            }
        }
    }


    public function updateStatus(Request $request)
    {
        $valid = $request->validate([
            'ids' => 'array',
            'ids.*' => 'numeric|exists:courses,id',
            'status' => 'required|string|in:public,private',
        ]);

        if (auth()->user()->isCorporate()) {
            $ids = array_map(fn ($item) => $item['id'], $valid['ids']);
            $validIdCount = Course::whereHas(
                'category',
                fn ($q) =>  $q->where('affiliation_id', auth()->user()->affiliation_id)
            )->whereIn('id', $ids)
                ->count();

            abort_if(
                count($ids) !== $validIdCount,
                403,
                'You have no authority of updating some of these courses!'
            );
        }

        Course::whereIn('id', $valid['ids'])->update(['status' => Course::STATUS[$valid['status']]]);
    }


    public function listAttendees(array $filters, Course $course, $auth)
    {
        if ($auth->isCorporate() && $auth->affiliation_id !== $course->category->affiliation_id) {
            throw new Exception('You do not own this course!');
        }

        $order = $filters['order'] ?? 'asc';
        $per_page = $filters['per_page'] ?? 10;
        $sort = $filters['sort'] ?? 'id';

        return AttendeeResource::collection(
            $course->attendingCourses()
                ->select([
                    'users.name',
                    'users.email',
                    'attending_courses.id',
                    'attending_courses.start_date',
                    'attending_courses.progress_rate',
                    'attending_courses.highest_score',
                    'attending_courses.latest_score',
                    'attending_courses.completion_date'
                ])
                ->join('users', 'users.id', '=', 'attending_courses.user_id')
                ->where('users.membership_type_id', MembershipType::INDIVIDUAL)
                ->when(!empty($filters), fn ($query) => $this->filterAttendees($query, $filters))
                ->orderBy($sort, $order)
                ->paginate($per_page)
        )->additional(['meta' => compact('sort', 'order')]);
    }


    // Helper functions
    private function filterAttendees($query, $filters)
    {
        $query->when(isset($filters['affiliation_id']), fn ($q) => $q->where('users.affiliation_id', $filters['affiliation_id']))
            ->when(isset($filters['name']), fn ($q) => $q->where('users.name', 'like', '%' . $filters['name'] . '%'))
            ->when(isset($filters['email']), fn ($q) => $q->where('users.email', 'like', '%' . $filters['email'] . '%'))
            ->when(isset($filters['remarks']), fn ($q) => $q->where('users.remarks', 'like', '%' . $filters['remarks'] . '%'))
            ->when(isset($filters['never_logged_in']), fn ($q) => $q->whereNull('users.last_login_date'))
            ->when(
                isset($filters['logged_in_min_date']) && isset($filters['logged_in_max_date']),
                fn ($q) => $q->whereDate('users.last_login_date', '>=', $filters['logged_in_min_date'])
                    ->whereDate('users.last_login_date', '<=', $filters['logged_in_max_date'])
            )->when(isset($filters['narrowed_by']) && $filters['narrowed_by'] != 3, function ($q) use ($filters) {
                if ($filters['narrowed_by'] == 1) $q->where('attending_courses.status', AttendingCourse::ATTENDING);
                if ($filters['narrowed_by'] == 2) $q->where('attending_courses.status', AttendingCourse::COMPLETE);
            });
    }

    private function appendAttribute(array $arr, string $att, mixed $val)
    {
        return array_map(function ($item) use ($att, $val) {
            $item[$att] = $val;
            return $item;
        }, $arr);
    }

    private function createChapters(Course $course, array $chapters)
    {
        foreach ($chapters as $chapter_data) {
            $chapter = Chapter::create(array_merge($chapter_data, ['course_id' => $course->id]));
            $chapter_test = Test::create(array_merge($chapter_data['chapter_test'], [
                'chapter_id' => $chapter->id,
                'test_type' => Test::TEST_TYPES['chapter']
            ]));

            $this->createQuestions($chapter_test, $chapter_data['chapter_test']['questions']);

            $this->createExplainerVideos($chapter, $chapter_data['explainer_videos']);
        }
    }

    private function createQuestions(Test $test, array $questions)
    {
        foreach ($questions as $question_data) {
            $question = Question::create(array_merge($question_data, [
                'test_id' => $test->id,
            ]));

            // upsert on leaf models
            QuestionOption::upsert(
                $this->appendAttribute($question_data['options'], 'question_id', $question->id),
                ['id'],
                [
                    'question_id',
                    'correction_order',
                    'item_number',
                    'description',
                ]
            );
        }
    }

    private function createExplainerVideos(Chapter $chapter, array $videos)
    {
        ExplainerVideo::upsert(
            $this->appendAttribute($videos, 'chapter_id', $chapter->id),
            ['id'],
            [
                'chapter_id',
                'item_number',
                'title',
                'content',
                'video_file_path',
            ]
        );
    }

    private function updateChapters(Course $course, array $chapters)
    {
        $chapter_ids = [];
        foreach ($chapters as $chapter_data) {
            $chapter = Chapter::updateOrCreate(
                ['id' => $chapter_data['id']],
                array_merge($chapter_data, ['course_id' => $course->id])
            );
            if (isset($chapter_data['chapter_test'])) {
                $test = Test::updateOrCreate([
                    'chapter_id' => $chapter->id,
                    'test_type' => Test::TEST_TYPES['chapter']
                ], $chapter_data['chapter_test']);

                $this->updateQuestions($test, $chapter_data['chapter_test']['questions']);
            }

            $this->updateExplainerVideos($chapter, $chapter_data['explainer_videos']);

            $chapter_ids[] = $chapter->id;
        }

        $course->chapters()->whereNotIn('id', $chapter_ids)->delete();
    }

    private function updateQuestions(Test $test, array $questions)
    {
        $before = now();
        $question_ids = [];
        foreach ($questions as $question_data) {
            $question = Question::updateOrCreate([
                'id' => $question_data['id'],
                'test_id' => $test->id,
            ], $question_data);

            // upsert on leaf models
            QuestionOption::upsert(
                $this->appendAttribute($question_data['options'], 'question_id', $question->id),
                ['id'],
                [
                    'question_id',
                    'correction_order',
                    'item_number',
                    'description',
                ]
            );
            $question->options()->where('updated_at', '<', $before)->delete();

            $question_ids[] = $question->id;
        }
        $test->questions()->whereNotIn('id', $question_ids)->delete();
    }

    private function updateExplainerVideos(Chapter $chapter, array $videos)
    {
        $before = now();
        ExplainerVideo::upsert(
            $this->appendAttribute($videos, 'chapter_id', $chapter->id),
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
    }
}
