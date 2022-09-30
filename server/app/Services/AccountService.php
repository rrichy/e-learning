<?php

namespace App\Services;

use App\Http\Requests\AccountStoreUpdateRequest;
use App\Http\Resources\AccountIndexResource;
use App\Http\Resources\AccountShowParsedResource;
use App\Http\Resources\AccountShowResource;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AccountService
{
    public function list()
    {
        $order = request()->input('order', 'asc');
        $per_page = request()->input('per_page', '10');
        $sort = request()->input('sort', 'id');

        return AccountIndexResource::collection(
            User::whereNot('id', auth()->id())
                ->with(['parentDepartment', 'childDepartment'])
                ->when(
                    auth()->user()->isCorporate(),
                    fn ($q) => $q->where('affiliation_id', auth()->user()->affiliation_id)
                )
                ->orderBy($sort, $order)
                ->paginate($per_page)
        )->additional(['message' => 'Users successfully fetched!']);
    }


    public function details(User $user)
    {
        if (request()->input('parsed') === 'true') {
            return new AccountShowParsedResource($user->load([
                'affiliation' => fn ($q) => $q->select('id', 'name'),
                'departments',
            ]));
        }

        return new AccountShowResource($user->load('departments'));
    }


    public function update(AccountStoreUpdateRequest $request, User $user)
    {
        $valid = $request->validated();
        
        DB::transaction(function () use ($valid, $user) {
            $user->update($valid);

            $newdepartments = [];
            if (isset($valid['department_1'])) {
                $newdepartments[] = $user->departmentUsers()->updateOrCreate([
                    'department_id' => $valid['department_1'],
                    'order' => 1,
                ])->id;

                if (isset($valid['department_2'])) {
                    $newdepartments[] = $user->departmentUsers()->updateOrCreate([
                        'department_id' => $valid['department_2'],
                        'order' => 2,
                    ])->id;
                }
            }

            $user->departmentUsers()->whereNotIn('id', $newdepartments)->delete();
        });
    }


    public function store(AccountStoreUpdateRequest $request)
    {
        $valid = $request->validated();

        $parsed = array_merge($valid, [
            'password' => Hash::make($request->password),
        ]);

        $user = User::create($parsed);

        if (isset($valid['department_1'])) {
            $newdepartments[] = $user->departmentUsers()->updateOrCreate([
                'department_id' => $valid['department_1'],
                'order' => 1,
            ])->id;

            if (isset($valid['department_2'])) {
                $newdepartments[] = $user->departmentUsers()->updateOrCreate([
                    'department_id' => $valid['department_2'],
                    'order' => 2,
                ])->id;
            }
        }

        // ignore but do not comment out
        event(new Registered($user));
    }


    public function deleteIds(string $ids)
    {
        $auth = auth()->user();
        $ids = explode(',', $ids);

        if($auth->isAdmin()) return User::destroy($ids);

        $validIdCount = User::where('affiliation_id', $auth->affiliation_id)->whereIn('id', $ids)->count();
        abort_if(
            count($ids) !== $validIdCount,
            403,
            'You have no authority of deleting some of these accounts'
        );

        return User::destroy($ids);
    }
}
