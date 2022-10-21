<?php

namespace App\Http\Controllers\AdminCorporate;

use App\Http\Controllers\Controller;
use App\Http\Requests\CourseRequest;
use App\Models\Course;
use App\Services\CourseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CourseController extends Controller
{
    public function index(CourseService $service)
    {
        return $service->list();
    }

    public function store(CourseRequest $request, CourseService $service)
    {
        $message = $service->store($request);

        return response()->json([
            'message' => $message,
        ]);
    }
    
    public function show(Course $course, CourseService $service)
    {
        return $service->details($course);
    }

    public function update(CourseRequest $request, Course $course, CourseService $service)
    {
        Gate::authorize('update-course', $course);

        $service->update($request, $course);

        return response()->json([
            'message' => 'Successfully updated a course!',
        ]);
    }

    public function massDelete(string $ids, CourseService $service)
    {
        $deleted_count = $service->deleteIds($ids);

        return response()->json([
            'message' => 'Successfully deleted ' . $deleted_count . ' courses!',
        ]);
    }

    public function massUpdate(Request $request, CourseService $service)
    {
        $count = $service->updatePriorities($request);

        return response()->json([
            'message' => 'Successfully updated ' . $count . ' courses!',
        ]);
    }

    public function toggleStatus(Request $request, CourseService $service)
    {
        $service->updateStatus($request);

        return response()->json([
            'message' => 'Successfully updated the courses!',
        ]);
    }

    public function attendees(Course $course, CourseService $service)
    {
        return $service->listAttendees($course);
    }
}
