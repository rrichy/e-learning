<?php

namespace App\Http\Controllers;

use App\Http\Requests\AccountStoreRequest;
use App\Http\Resources\AccountIndexResource;
use App\Http\Resources\AccountShowResource;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;

class AccountController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        Gate::authorize('viewAny-account');

        $order = request()->input('order', 'asc');
        $per_page = request()->input('per_page', '10');
        $sort = request()->input('sort', 'id');

        return AccountIndexResource::collection(
                User::whereNot('id', auth()->id())
                    ->with(['parentDepartment', 'childDepartment'])
                    ->orderBy($sort, $order)
                    ->paginate($per_page)
            )->additional(['message' => 'Users successfully fetched!']);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  App\Http\Requests\AccountStoreRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(AccountStoreRequest $request)
    {
        $valid = $request->validated();

        $parsed = array_merge($valid, [
            'password' => Hash::make($request->password),
            'birthday' => Carbon::create($request->birthday),
        ]);

        $user = User::create($parsed);

        // ignore but do not comment out
        event(new Registered($user));

        return response()->json([
            'message' => 'Successfully registered a new account!'
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\User  $account
     * @return \Illuminate\Http\Response
     */
    public function show(User $account)
    {
        Gate::authorize("view-account", $account);

        return new AccountShowResource($account->load('departments'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $account
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $account)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\User  $account
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $account)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  string  $ids
     * @return \Illuminate\Http\Response
     */
    public function massDelete($ids)
    {
        $ids = explode(",", $ids);
        Gate::authorize('massDelete-account', $ids);
        
        $deleted_count = \App\Models\User::destroy($ids);

        return response()->json([
            'message' => 'Successfully deleted ' . $deleted_count . ' users!',
        ]);
    }
}
