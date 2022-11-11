<?php

namespace App\Http\Controllers\AdminCorporate;

use App\Http\Controllers\Controller;
use App\Http\Requests\DepartmentStoreUpdateRequest;
use App\Models\Department;
use App\Services\DepartmentService;
use Illuminate\Support\Facades\Gate;

class DepartmentController extends Controller
{
    public function index(DepartmentService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        return $service->list();
    }

    public function store(DepartmentStoreUpdateRequest $request, DepartmentService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        $service->store($request);

        return response()->json([
            'message' => 'Successfully created a department!',
        ]);
    }

    public function update(DepartmentStoreUpdateRequest $request, Department $department, DepartmentService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        $service->update($request, $department);

        return response()->json([
            'message' => 'Successfully updated a department!',
        ]);
    }

    public function destroy(string $department, DepartmentService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        $deleted_count = $service->deleteIds($department);

        return response()->json([
            'message' => 'Successfully deleted ' . $deleted_count . ' departments!',
        ]);
    }
}
