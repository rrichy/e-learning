<?php

namespace App\Services;

use App\Http\Resources\AttendingCourseIndexResource;
use App\Models\AttendingCourse;
use App\Models\User;

class AttendingCourseService
{
    public function index (array $pagination = [], $auth)
    {
        $order = $pagination['order'] ?? 'asc';
        $per_page = $pagination['per_page'] ?? 10;
        $sort = $pagination['sort'] ?? 'id';

        return AttendingCourseIndexResource::collection(
            AttendingCourse::query()
                ->join('courses', 'courses.id', '=', 'attending_courses.course_id')
                ->select([
                    'attending_courses.id',
                    'attending_courses.progress_rate',
                    'attending_courses.completion_date',
                    'attending_courses.start_date',
                    'attending_courses.status',
                    'attending_courses.latest_score',
                    'attending_courses.highest_score',
                    'courses.title',
                ])
                ->where('user_id', $auth->id)
                ->orderBy($sort, $order)
                ->paginate($per_page)
        )->additional([
            'meta' => compact('sort', 'order')
        ]);
    }
}
