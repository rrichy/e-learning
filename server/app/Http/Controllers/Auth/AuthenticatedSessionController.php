<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\MembershipType;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     *
     * @param  \App\Http\Requests\Auth\LoginRequest  $request
     * @return \Illuminate\Http\Response
     */
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

    public function show(Request $request)
    {
        switch (auth()->user()->membership_type_id) {
            case 4:
                // Count all users that are not admin
                return response()->json([
                    'user' => auth()->user(),
                    'users_count' => User::where('membership_type_id', '<', MembershipType::ADMIN)
                        ->select(DB::raw('count(membership_type_id) as count, (CASE WHEN membership_type_id = 1 THEN "trial" WHEN membership_type_id = 2 THEN "individual" ELSE "corporate" END) AS membership_type'))
                        ->groupBy('membership_type_id')->get()
                        ->mapWithKeys(fn ($item) => [$item['membership_type'] => $item['count']]),
                    'message' => 'Login Successful!',
                ]);
            case 3:
                // Count individuals under the same affiliation as the Corporate (UNFINISHED)
                return response()->json([
                    'user' => auth()->user(),
                    'users_count' => [
                        'individual' => User::query()
                            ->where('membership_type_id', MembershipType::INDIVIDUAL)
                            ->where('affiliation_id', auth()->user()->affiliation_id)
                            ->count()
                    ],
                    'message' => 'Login Successful!',
                ]);
            case 1:
                // Get Categories and its courses (UNFINISHED)
                return response()->json([
                    'user' => auth()->user(),
                    'message' => 'Login Successful!',
                ]);
            default:
                return response()->json([
                    'user' => auth()->user(),
                    'message' => 'Login Successful!',
                ]);
        }
    }

    /**
     * Update the authenticated user
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $valid = $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users,email,' . auth()->id(),
            'image' => 'nullable|string'
        ]);

        auth()->user()->update($valid);

        return response()->json([
            'message' => 'Update successful!',
            'user' => auth()->user(),
        ]);
    }

    /**
     * Destroy an authenticated session.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        auth()->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout Successful!',
        ]);
    }
}
