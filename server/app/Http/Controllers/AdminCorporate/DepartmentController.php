<?php

namespace App\Http\Controllers\AdminCorporate;

use App\Http\Controllers\Controller;
use App\Http\Requests\DepartmentStoreUpdateRequest;
use App\Models\Department;
use App\Services\DepartmentService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class DepartmentController extends Controller
{
    public function index(Request $request, DepartmentService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        $valid = $request->validate([
            'order' => 'string|in:asc,desc',
            'per_page' => 'numeric',
            'sort' => 'string|in:id,name,priority'
        ]);

        try {
            $departments = $service->index($valid, auth()->user()->affiliation_id);
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return $departments;
    }

    public function store(DepartmentStoreUpdateRequest $request, DepartmentService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        try {
            $service->store($request->validated());
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return response()->json([
            'message' => 'Successfully created a department!',
        ]);
    }

    public function update(DepartmentStoreUpdateRequest $request, Department $department, DepartmentService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);
        Gate::authorize('update-department', $department);

        try {
            $service->update($request->validated(), $department);
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return response()->json([
            'message' => 'Successfully updated a department!',
        ]);
    }

    public function destroy(string $department, DepartmentService $service)
    {
        $collection_id = collect(explode(',', $department));
        Gate::authorize('check-membership', [['admin', 'corporate']]);
        Gate::authorize('delete-department', $collection_id);

        try {
            $deleted_count = $service->deleteIds($collection_id);
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return response()->json([
            'message' => 'Successfully deleted ' . $deleted_count . ' departments!',
        ]);
    }
}
