<?php

namespace App\Services;

use App\Http\Requests\DepartmentStoreUpdateRequest;
use App\Http\Resources\DepartmentResource;
use App\Models\Department;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class DepartmentService
{
    public function index(array $pagination, mixed $affiliation_id)
    {
        return DepartmentResource::collection(
            Department::with('childDepartments')
                ->whereNull('parent_id')
                ->when(
                    $affiliation_id,
                    fn ($q) => $q->where('affiliation_id', $affiliation_id)
                )->orderBy($pagination['sort'] ?? 'id', $pagination['order'] ?? 'asc')
                ->paginate($pagination['per_page'] ?? 10)
        )->additional([
            'message' => 'Departments successfully fetched!',
            'meta' => [
                'sort' => $pagination['sort'] ?? 'id',
                'order' => $pagination['order'] ?? 'asc',
            ]
        ]);
    }


    public function store(array $valid)
    {
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


    public function update(array $valid, Department $department)
    {
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


    public function deleteIds(Collection $ids)
    {
        return Department::destroy($ids);
    }
}
