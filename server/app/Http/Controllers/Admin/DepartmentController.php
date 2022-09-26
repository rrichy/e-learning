<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\DepartmentResource;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $order = request()->input('order', 'asc');
        $per_page = request()->input('per_page', '10');
        $sort = request()->input('sort', 'id');

        return DepartmentResource::collection(Department::with('childDepartments')->whereNull('parent_id')->orderBy($sort, $order)->paginate($per_page))->additional(['message' => 'Departments successfully fetched!']);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $valid = $request->validate([
            'affiliation_id' => 'required|numeric|exists:affiliations,id',
            'name' => 'required|string|unique:departments,name',
            'priority' => 'required|numeric|min:1|unique:departments,priority',
            'child_departments' => 'present|array',
            'child_departments.*.name' => 'required|string|distinct',
            'child_departments.*.priority' => 'required|numeric|min:1|distinct',
        ]);

        DB::transaction(function () use ($valid) {
            $department = Department::create($valid);
            $child_departments = collect($valid['child_departments']);

            $child_departments->each(function ($child) use ($department) {
                Department::create(array_merge($child, [
                    'affiliation_id' => $department->affiliation_id,
                    'parent_id' => $department->id,
                ]));
            });
        });

        return response()->json([
            'message' => 'Successfully created a department!',
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Department  $department
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Department $department)
    {
        $valid = $request->validate([
            'affiliation_id' => 'required|numeric|exists:affiliations,id',
            'name' => ['required', 'string', Rule::unique('departments')->where(fn ($q) => $q->where('affiliation_id', $department->affiliation_id)->whereNull('parent_id'))->ignore($department->id)],
            'priority' => ['required', 'numeric', 'min:1', Rule::unique('departments')->where(fn ($q) => $q->where('affiliation_id', $department->affiliation_id)->whereNull('parent_id'))->ignore($department->id)],
            'child_departments' => 'present|array',
            'child_departments.*.name' => 'required|string|distinct',
            'child_departments.*.priority' => 'required|numeric|min:1|distinct',
        ]);

        DB::transaction(function () use ($valid, $department) {
            $department->update($valid);
            $child_departments = collect($valid['child_departments']);

            $child_department_ids = collect();
            $child_departments->each(function ($child) use ($department, &$child_department_ids) {
                $child_department = Department::updateOrCreate(array_merge($child, [
                    'affiliation_id' => $department->affiliation_id,
                    'parent_id' => $department->id,
                ]));

                $child_department_ids->push($child_department->id);
            });

            $department->childDepartments()->whereNotIn('id', $child_department_ids)->delete();
        });

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
    public function destroy(string $department)
    {
        $ids = explode(",", $department);
        $deleted_count = \App\Models\Department::destroy($ids);

        return response()->json([
            'message' => 'Successfully deleted ' . $deleted_count . ' departments!',
        ]);
    }
}
