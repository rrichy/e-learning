<?php

namespace App\Services;

use App\Http\Requests\DepartmentStoreUpdateRequest;
use App\Http\Resources\DepartmentResource;
use App\Models\Department;
use Illuminate\Support\Facades\DB;

class DepartmentService
{
    public function list()
    {
        $order = request()->input('order', 'asc');
        $per_page = request()->input('per_page', '10');
        $sort = request()->input('sort', 'id');

        return DepartmentResource::collection(
            Department::with('childDepartments')
                ->whereNull('parent_id')
                ->when(
                    auth()->user()->isCorporate(), 
                    fn ($q) => $q->where('affiliation_id', auth()->user()->affiliation_id)
                )->orderBy($sort, $order)
                ->paginate($per_page)
        )->additional(['message' => 'Departments successfully fetched!']);
    }


    public function store(DepartmentStoreUpdateRequest $request)
    {
        $valid = $request->validated();

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
    }


    public function update(DepartmentStoreUpdateRequest $request, Department $department)
    {
        $valid = $request->validated();

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

        return $department;
    }


    public function deleteIds(string $ids)
    {
        $auth = auth()->user();
        $ids = explode(',', $ids);

        if($auth->isAdmin()) return Department::destroy($ids);

        $validIdCount = Department::where('affiliation_id', $auth->affiliation_id)->whereIn('id', $ids)->count();
        abort_if(
            count($ids) !== $validIdCount,
            403,
            'You have no authority of deleting some of these departments'
        );

        return Department::destroy($ids);
    }
}
