<?php

namespace App\Services;

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
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CourseService
{
    public function index(string $status, mixed $affiliation_id)
    {
        if ($status === "both") {
            return CourseIndexResource::collection(
                Category::with(['courses' => function ($q) {
                    $q->orderBy('priority', 'asc');
                }])->when(
                    $affiliation_id,
                    fn ($q) => $q->where('affiliation_id', $affiliation_id)
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
                    $affiliation_id,
                    fn ($q) => $q->where('affiliation_id', $affiliation_id)
                )->get()
        );
    }

    public function individualIndex()
    {
        return CourseListResource::collection(
            Category::whereHas('courses', fn ($q) => $q->isPublic())
                ->with(
                    ['courses' => fn ($q) => $q->isPublic()]
                )->get()
        );
    }


    public function store(array $valid, User $auth)
    {
        $message = 'Failed to create a course';

        DB::transaction(function () use ($valid, &$message, $auth) {
            if (isset($valid['image']) && !$auth->temporaryUrls()->where('url', $valid['image'])->exists()) {
                throw new Exception("Temporary url does not exists!");
            }

            $course = Course::create($valid);

            $this->createChapters($course, $valid['chapters']);

            $message = 'Successfully created a course!';
        });

        return $message;
    }


    public function show(Course $course, bool $parsed = false)
    {
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

    public function individualShow(Course $course)
    {
        return new StudentCourseShowResource(
            $course->load([
                'chapters' => fn ($chapter) => $chapter->orderBy('item_number', 'asc')->orderBy('item_number', 'asc')
            ])
        );
    }

    public function update(array $valid, Course $course, User $auth)
    {
        DB::transaction(function () use ($course, $valid, $auth) {
            $has_new_image = isset($valid['image']) && $valid['image'] !== $course->image;

            if ($has_new_image && !$auth->temporaryUrls()->where('url', $valid['image'])->exists()) {
                throw new Exception("Temporary url does not exists!");
            }

            $old_image = $course->image;

            $course->update($valid);

            $this->updateChapters($course, $valid['chapters']);

            if ($has_new_image && $old_image) {
                Storage::delete(str_replace(config('constants.prefixes.s3'), '', $old_image));
            }
        });

        return $course;
    }


    public function deleteIds(Collection $ids)
    {
        return Course::destroy($ids);
    }


    public function updatePriorities(array $valid)
    {
        $count = 0;
        foreach ($valid['payload'] as $category) {
            foreach ($category['changes'] as $course) {
                Course::find($course['id'])->update(['priority' => $course['priority']]);
                $count++;
            }
        }

        return $count;
    }


    public function updateStatus(array $valid)
    {
        Course::whereIn('id', $valid['ids'])->update(['status' => Course::STATUS[$valid['status']]]);

        return count($valid['ids']);
    }


    public function listAttendees(array $filters, Course $course)
    {
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
