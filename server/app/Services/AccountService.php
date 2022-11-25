<?php

namespace App\Services;

use App\Http\Resources\AccountIndexResource;
use App\Http\Resources\AccountShowParsedResource;
use App\Http\Resources\AccountShowResource;
use App\Models\MembershipType;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AccountService
{
    public function index(array $filters, User $auth)
    {
        $order = $filters['order'] ?? 'asc';
        $per_page = $filters['per_page'] ?? 10;
        $sort = $filters['sort'] ?? 'id';

        return AccountIndexResource::collection(
            User::select(
                'users.id',
                'users.affiliation_id',
                'users.created_at',
                'users.email',
                'users.last_login_date',
                'users.name',
                'parent_departments.name as department_1',
                'child_departments.name as department_2',
            )->leftJoin('department_users as department_users_1', function ($join) {
                $join->on('department_users_1.user_id', '=', 'users.id')
                    ->where('department_users_1.order', 1);
            })->leftJoin('department_users as department_users_2', function ($join) {
                $join->on('department_users_2.user_id', '=', 'users.id')
                    ->where('department_users_2.order', 2);
            })->leftJoin('departments as parent_departments', 'parent_departments.id', '=', 'department_users_1.department_id')
                ->leftJoin('departments as child_departments', 'child_departments.id', '=', 'department_users_2.department_id')
                ->leftJoin('affiliations', 'affiliations.id', '=', 'users.affiliation_id')
                ->when($auth->isCorporate(), fn ($q) => $q->where('users.affiliation_id', $auth->affiliation_id))
                ->when(!empty($filters), fn ($query) => $this->filterUsers($query, $filters))
                ->orderBy($sort === 'affiliation_id' ? 'affiliations.name' : $sort, $order)
                ->paginate($per_page)
        )->additional([
            'message' => 'Users successfully fetched!',
            'meta' => compact('sort', 'order')
        ]);
    }


    public function store(array $valid, User $auth)
    {
        $s3_image_url = $auth->temporaryUrls()->where('directory', 'profiles/')->first();

        if ($s3_image_url) {
            $s3_image_url->delete();
            abort_if($s3_image_url->url !== $valid['image'], 403, 'Image url mismatch!');
        }

        $parsed = array_merge($valid, [
            'password' => bcrypt($valid['password']),
        ]);

        $user = User::create($parsed);

        $newdepartments = [];
        if (isset($valid['department_1'])) {
            $newdepartments[$valid['department_1']] = ['order' => 1];

            if (isset($valid['department_2'])) {
                $newdepartments[$valid['department_2']] = ['order' => 2];
            }
        }
        $user->departments()->attach($newdepartments);

        // ignore but do not comment out
        event(new Registered($user));
    }


    public function show(User $user, bool $parsed = false, User $auth)
    {
        if ($parsed) {
            return new AccountShowParsedResource($user->load([
                'affiliation' => fn ($q) => $q->select('id', 'name'),
                'departments',
            ]));
        }

        return new AccountShowResource($user->load('departments'));
    }


    public function update(array $valid, User $user, User $auth)
    {
        DB::transaction(function () use ($valid, $user, $auth) {
            $s3_image_url = $auth->temporaryUrls()->where('directory', 'profiles/')->first();

            if ($s3_image_url) {
                $s3_image_url->delete();
                abort_if($s3_image_url->url !== $valid['image'], 403, 'Image url mismatch!');
            }

            $old_image = $user->image;

            $user->update($valid);

            $newdepartments = [];
            if (isset($valid['department_1'])) {
                $newdepartments[$valid['department_1']] = ['order' => 1];

                if (isset($valid['department_2'])) {
                    $newdepartments[$valid['department_2']] = ['order' => 2];
                }
            }
            $user->departments()->sync($newdepartments);

            if ($s3_image_url) {
                Storage::delete(str_replace(config('constants.prefixes.s3'), '', $old_image));
            }
        });
    }


    public function deleteIds(Collection $ids)
    {
        return User::destroy($ids);
    }


    // Helper functions
    private function filterUsers($query, $filters)
    {
        $query->when(isset($filters['membership_type_id']), fn ($q) => $q->where('users.membership_type_id', $filters['membership_type_id']))
            ->when(isset($filters['affiliation_id']), fn ($q) => $q->where('users.affiliation_id', $filters['affiliation_id']))
            ->when(isset($filters['department_1']), fn ($q) => $q->where('parent_departments.id', $filters['department_1']))
            ->when(isset($filters['department_2']), fn ($q) => $q->where('child_departments.id', $filters['department_2']))
            ->when(isset($filters['name']), fn ($q) => $q->where('users.name', 'like', '%' . $filters['name'] . '%'))
            ->when(isset($filters['email']), fn ($q) => $q->where('users.email', 'like', '%' . $filters['email'] . '%'))
            ->when(isset($filters['remarks']), fn ($q) => $q->where('users.remarks', 'like', '%' . $filters['remarks'] . '%'))
            ->when(
                isset($filters['registered_min_date']) && isset($filters['registered_max_date']),
                fn ($q) => $q->whereDate('users.created_at', '>=', $filters['registered_min_date'])
                    ->whereDate('users.created_at', '<=', $filters['registered_max_date'])
            )->when(isset($filters['never_logged_in']), fn ($q) => $q->whereNull('users.last_login_date'))
            ->when(
                isset($filters['logged_in_min_date']) && isset($filters['logged_in_max_date']),
                fn ($q) => $q->whereDate('users.last_login_date', '>=', $filters['logged_in_min_date'])
                    ->whereDate('users.last_login_date', '<=', $filters['logged_in_max_date'])
            );
    }
}
