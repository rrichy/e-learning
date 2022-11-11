<?php

namespace App\Http\Controllers\AdminCorporate;

use App\Http\Controllers\Controller;
use App\Http\Requests\DepartmentStoreUpdateRequest;
use App\Models\Department;
use App\Services\DepartmentService;
use Exception;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index(Request $request, DepartmentService $service)
    {
        $valid = $request->validate([
            'order' => 'string|in:asc,desc',
            'per_page' => 'numeric',
            'sort' => 'string|in:id,name,priority'
        ]);

        try {
            $departments = $service->index($valid);
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return $departments;
    }

    public function store(DepartmentStoreUpdateRequest $request, DepartmentService $service)
    {
        $service->store($request);

        return response()->json([
            'message' => 'Successfully created a department!',
        ]);
    }

    public function update(DepartmentStoreUpdateRequest $request, Department $department, DepartmentService $service)
    {
        $service->update($request, $department);

        return response()->json([
            'message' => 'Successfully updated a department!',
        ]);
    }

    public function destroy(string $department, DepartmentService $service)
    {
        $deleted_count = $service->deleteIds($department);

        return response()->json([
            'message' => 'Successfully deleted ' . $deleted_count . ' departments!',
        ]);
    }
}
