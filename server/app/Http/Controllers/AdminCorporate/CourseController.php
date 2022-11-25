<?php

namespace App\Http\Controllers\AdminCorporate;

use App\Http\Controllers\Controller;
use App\Http\Requests\AttendeeListRequest;
use App\Http\Requests\CoursePriorityUpdateRequest;
use App\Http\Requests\CourseRequest;
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

        try {
            $auth = auth()->user();
            if ($auth->isIndividual()) $list = $service->individualIndex();
            else $list = $service->index($valid['status'], $auth->affiliation_id);
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return $list;
    }

    public function store(CourseRequest $request, CourseService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        try {
            $message = $service->store($request->validated(), auth()->user());
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return response()->json([
            'message' => $message,
        ]);
    }

    public function show(Request $request, Course $course, CourseService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate', 'individual']]);
        Gate::authorize('view-course', $course);

        try {
            $auth = auth()->user();
            if ($auth->isIndividual()) $details = $service->individualShow($course);
            else $details = $service->show($course, $request->boolean('tabulated'));
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return $details;
    }

    public function update(CourseRequest $request, Course $course, CourseService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);
        Gate::authorize('update-course', $course);

        try {
            $service->update($request->validated(), $course, auth()->user());
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return response()->json([
            'message' => 'Successfully updated a course!',
        ]);
    }

    public function massDelete(string $ids, CourseService $service)
    {
        $collection_id = collect(explode(',', $ids));
        Gate::authorize('check-membership', [['admin', 'corporate']]);
        Gate::authorize('delete-course', $collection_id);

        try {
            $deleted_count = $service->deleteIds($collection_id);
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return response()->json([
            'message' => 'Successfully deleted ' . $deleted_count . ' courses!',
        ]);
    }

    public function massUpdate(CoursePriorityUpdateRequest $request, CourseService $service)
    {
        $valid = $request->validated();
        $course_ids = [];

        foreach ($valid['payload'] as $category) {
            $course_ids = array_merge($course_ids, array_map(fn ($change) => $change['id'], $category['changes']));
        }

        Gate::authorize('check-membership', [['admin', 'corporate']]);
        Gate::authorize('mass-update-course', collect($course_ids));

        try {
            $count = $service->updatePriorities($valid);
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return response()->json([
            'message' => 'Successfully updated ' . $count . ' courses!',
        ]);
    }

    public function toggleStatus(Request $request, CourseService $service)
    {
        $valid = $request->validate([
            'ids' => 'array',
            'ids.*' => 'numeric|exists:courses,id',
            'status' => 'required|string|in:public,private',
        ]);

        Gate::authorize('check-membership', [['admin', 'corporate']]);
        Gate::authorize('mass-update-course', collect($valid['ids']));

        try {
            $service->updateStatus($valid);
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return response()->json([
            'message' => 'Successfully updated the courses!',
        ]);
    }

    public function attendees(AttendeeListRequest $request, Course $course, CourseService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);
        Gate::authorize('view-course', $course);

        try {
            $attendees = $service->listAttendees($request->validated(), $course);
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return $attendees;
    }
}
