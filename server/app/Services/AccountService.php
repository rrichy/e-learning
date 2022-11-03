<?php

namespace App\Services;

use App\Http\Requests\AccountStoreUpdateRequest;
use App\Http\Resources\AccountIndexResource;
use App\Http\Resources\AccountShowParsedResource;
use App\Http\Resources\AccountShowResource;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class AccountService
{
    public function list(Request $request, $auth)
    {
        $filters = $request->validate([
            'membership_type_id' => 'numeric',
            'affiliation_id' => 'numeric',
            'department_1' => 'numeric',
            'department_2' => 'numeric',
            'name' => 'string',
            'email' => 'string',
            'remarks' => 'string',
            'registered_min_date' => 'required_with:registered_min_date',
            'registered_max_date' => 'required_with:registered_max_date',
            'never_logged_in' => 'boolean',
            'logged_in_min_date' => 'required_with:logged_in_max_date',
            'logged_in_max_date' => 'required_with:logged_in_min_date',
            'order' => 'string|in:asc,desc',
            'per_page' => 'numeric',
            'sort' => 'string|in:id,email,name,affiliation_id,created_at,last_login_date'
        ]);

        $order = $request->input('order', 'asc');
        $per_page = $request->input('per_page', '10');
        $sort = $request->input('sort', 'id');

        return AccountIndexResource::collection(
            User::whereNot('id', $auth->id)
                ->when($auth->isCorporate(), fn ($q) => $q->where('affiliation_id', $auth->affiliation_id))
                ->when(!empty($filters), fn ($query) => $this->filterUsers($query, $filters))
                ->orderBy($sort, $order)
                ->paginate($per_page)
        )->additional([
            'message' => 'Users successfully fetched!',
            'meta' => compact('sort', 'order')
        ]);
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
            $s3_image_url = auth()->user()->temporaryUrls()->where('directory', 'profiles/')->first();

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


    public function store(AccountStoreUpdateRequest $request)
    {
        $valid = $request->validated();

        $s3_image_url = auth()->user()->temporaryUrls()->where('directory', 'profiles/')->first();

        if ($s3_image_url) {
            $s3_image_url->delete();
            abort_if($s3_image_url->url !== $valid['image'], 403, 'Image url mismatch!');
        }

        $parsed = array_merge($valid, [
            'password' => Hash::make($request->password),
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


    public function deleteIds(string $ids)
    {
        $auth = auth()->user();
        $ids = explode(',', $ids);

        if ($auth->isAdmin()) return User::destroy($ids);

        $validIdCount = User::where('affiliation_id', $auth->affiliation_id)->whereIn('id', $ids)->count();
        abort_if(
            count($ids) !== $validIdCount,
            403,
            'You have no authority of deleting some of these accounts'
        );

        return User::destroy($ids);
    }


    // Helper functions
    private function filterUsers($query, $filters)
    {
        $query->when(isset($filters['membership_type_id']), fn ($q) => $q->where('membership_type_id', $filters['membership_type_id']))
            ->when(isset($filters['affiliation_id']), fn ($q) => $q->where('affiliation_id', $filters['affiliation_id']))
            ->when(isset($filters['department_1']), fn ($q) => $q->whereHas('departments', fn ($w) => $w->where('departments.id', $filters['department_1'])))
            ->when(isset($filters['department_2']), fn ($q) => $q->whereHas('departments', fn ($w) => $w->where('departments.id', $filters['department_2'])))
            ->when(isset($filters['name']), fn ($q) => $q->where('name', 'like', '%' . $filters['name'] . '%'))
            ->when(isset($filters['email']), fn ($q) => $q->where('email', 'like', '%' . $filters['email'] . '%'))
            ->when(isset($filters['remarks']), fn ($q) => $q->where('remarks', 'like', '%' . $filters['remarks'] . '%'))
            ->when(
                isset($filters['registered_min_date']) && isset($filters['registered_max_date']),
                fn ($q) => $q->whereDate('created_at', '>=', $filters['registered_min_date'])
                    ->whereDate('created_at', '<=', $filters['registered_max_date'])
            )->when(isset($filters['never_logged_in']), fn ($q) => $q->whereNull('last_login_date'))
            ->when(
                isset($filters['logged_in_min_date']) && isset($filters['logged_in_max_date']),
                fn ($q) => $q->whereDate('last_login_date', '>=', $filters['logged_in_min_date'])
                    ->whereDate('last_login_date', '<=', $filters['logged_in_max_date'])
            );
    }
}
