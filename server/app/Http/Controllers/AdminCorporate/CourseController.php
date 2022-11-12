<?php

namespace App\Http\Controllers\AdminCorporate;

use App\Http\Controllers\Controller;
use App\Http\Requests\CourseRequest;
use App\Http\Resources\AttendeeResource;
use App\Models\Course;
use App\Services\CourseService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CourseController extends Controller
{
    public function index(Request $request, CourseService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate', 'individual']]);

        $valid = $request->validate([
            'status' => 'required|string|in:both,private,public',
        ]);
        
        return $service->index($valid['status'], auth()->user());
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
        Gate::authorize('check-membership', [['admin', 'corporate', 'individual']]);

        return $service->details($course);
    }

    public function update(CourseRequest $request, Course $course, CourseService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        $service->update($request, $course);

        return response()->json([
            'message' => 'Successfully updated a course!',
        ]);
    }

    public function massDelete(string $ids, CourseService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        $deleted_count = $service->deleteIds($ids);

        return response()->json([
            'message' => 'Successfully deleted ' . $deleted_count . ' courses!',
        ]);
    }

    public function massUpdate(Request $request, CourseService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        $count = $service->updatePriorities($request);

        return response()->json([
            'message' => 'Successfully updated ' . $count . ' courses!',
        ]);
    }

    public function toggleStatus(Request $request, CourseService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        $service->updateStatus($request);

        return response()->json([
            'message' => 'Successfully updated the courses!',
        ]);
    }

    public function attendees(Request $request, Course $course, CourseService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        try {
            $attendees = $service->listAttendees($request, $course, auth()->user());
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return $attendees;
    }
}
