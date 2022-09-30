<?php

namespace App\Http\Controllers;

use App\Http\Requests\AccountStoreUpdateRequest;
use App\Models\User;
use App\Services\AccountService;
use Illuminate\Support\Facades\Gate;

class AccountController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(AccountService $service)
    {
        Gate::authorize('viewAny-account');

        return $service->list();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\AccountStoreUpdateRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(AccountStoreUpdateRequest $request, AccountService $service)
    {
        Gate::authorize('create-account');

        $service->store($request);

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
    public function show(User $account, AccountService $service)
    {
        Gate::authorize('view-account', $account);
        
        return $service->details($account);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\AccountStoreUpdateRequest  $request
     * @param  \App\Models\User  $account
     * @return \Illuminate\Http\Response
     */
    public function update(AccountStoreUpdateRequest $request, User $account, AccountService $service)
    {
        Gate::authorize('update-account', $account);

        $service->update($request, $account);

        return response()->json([
            'message' => 'Successfully updated an account!'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  string  $ids
     * @return \Illuminate\Http\Response
     */
    public function massDelete(string $ids, AccountService $service)
    {
        Gate::authorize('massDelete-account', $ids);

        $deleted_count = $service->deleteIds($ids);

        return response()->json([
            'message' => 'Successfully deleted ' . $deleted_count . ' users!',
        ]);
    }
}
