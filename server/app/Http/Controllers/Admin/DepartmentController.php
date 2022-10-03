<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\DepartmentStoreUpdateRequest;
use App\Models\Department;
use App\Services\DepartmentService;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(DepartmentService $service)
    {
        return $service->list();
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

    /**
     * Remove the specified resource from storage.
     *
     * @param  string  $department
     * @return \Illuminate\Http\Response
     */
    public function destroy(string $department, DepartmentService $service)
    {
        $deleted_count = $service->deleteIds($department);

        return response()->json([
            'message' => 'Successfully deleted ' . $deleted_count . ' departments!',
        ]);
    }
}
