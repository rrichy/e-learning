<?php

namespace App\Services;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\UpdateSelfRequest;
use App\Http\Resources\AccountShowResource;
use App\Models\Category;
use App\Models\Course;
use App\Models\MembershipType;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AuthenticatedService
{
    public function details()
    {
        return $this->getAuthData('Login Successful!');
    }


    public function update(UpdateSelfRequest $request)
    {
        $valid = $request->validated();

        DB::transaction(function () use ($valid) {
            $auth = auth()->user();

            $auth->update($valid);

            $newdepartments = [];
            if (isset($valid['department_1'])) {
                $newdepartments[] = $auth->departmentUsers()->updateOrCreate([
                    'department_id' => $valid['department_1'],
                    'order' => 1,
                ])->id;

                if (isset($valid['department_2'])) {
                    $newdepartments[] = $auth->departmentUsers()->updateOrCreate([
                        'department_id' => $valid['department_2'],
                        'order' => 2,
                    ])->id;
                }
            }

            $auth->departmentUsers()->whereNotIn('id', $newdepartments)->delete();
        });

        return response()->json([
            'message' => 'Update successful!',
            'user' => new AccountShowResource(auth()->user()->load('departments')),
        ]);
    }


    public function store(LoginRequest $request)
    {
        $request->authenticate();

        $auth = $request->user();
        $token = $auth->createToken('access_token')->plainTextToken;
        $auth->last_login_date = now();
        $auth->save();

        return response()->json([
            'access_token' => $token,
            'message' => 'Login Successful!',
        ]);
    }


    public function logout()
    {
        auth()->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout Successful!',
        ]);
    }


    private function getAuthData(string $message)
    {
        switch (auth()->user()->membership_type_id) {
            case MembershipType::ADMIN:
                return response()->json([
                    'user' => auth()->user(),
                    'users_count' => User::where('membership_type_id', '<', MembershipType::ADMIN)
                        ->select(DB::raw('count(membership_type_id) as count, (CASE WHEN membership_type_id = 1 THEN "trial" WHEN membership_type_id = 2 THEN "individual" ELSE "corporate" END) AS membership_type'))
                        ->groupBy('membership_type_id')->get()
                        ->mapWithKeys(fn ($item) => [$item['membership_type'] => $item['count']]),
                    'message' => $message,
                ]);
            case MembershipType::CORPORATE:
                // Count individuals under the same affiliation as the Corporate (UNFINISHED)
                return response()->json([
                    'user' => new AccountShowResource(auth()->user()->load('departments')),
                    'users_count' => [
                        'individual' => User::query()
                            ->where('membership_type_id', MembershipType::INDIVIDUAL)
                            ->where('affiliation_id', auth()->user()->affiliation_id)
                            ->count()
                    ],
                    'message' => $message,
                ]);
            case MembershipType::INDIVIDUAL:
                return response()->json([
                    'user' => new AccountShowResource(auth()->user()->load('departments')),
                    'message' => $message,
                    'categories' => Category::query()
                        ->whereHas('courses', fn ($q) => $q->where('status', Course::STATUS['public']))
                        ->with(
                            ['courses' => fn ($q) => $q->where('status', Course::STATUS['public'])->select('id', 'title', 'category_id')]
                        )->get(['id', 'name'])
                ]);
            default:
                return response()->json([
                    'user' => auth()->user(),
                    'message' => $message,
                ]);
        }
    }
}
