<?php

namespace App\Http\Controllers;

use App\Http\Requests\AccountIndexRequest;
use App\Http\Requests\AccountStoreUpdateRequest;
use App\Models\User;
use App\Services\AccountService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AccountController extends Controller
{
    public function index(AccountIndexRequest $request, AccountService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        try {
            $list = $service->index($request->validated(), auth()->user());
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }
        
        return $list;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\AccountStoreUpdateRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(AccountStoreUpdateRequest $request, AccountService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        $service->store($request);

        return response()->json([
            'message' => 'Successfully registered a new account!'
        ]);
    }

    public function show(Request $request, User $account, AccountService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);
        Gate::authorize('view-account', $account);
        
        return $service->details($account, $request->boolean('parsed'));
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
        Gate::authorize('check-membership', [['admin', 'corporate']]);
        Gate::authorize('update-account', $account);

        $service->update($request->validated(), $account, auth()->user());

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
        Gate::authorize('check-membership', [['admin', 'corporate']]);
        // TODO: when membership is corporate, check if all ids are under the same affiliation

        $deleted_count = $service->deleteIds($ids);

        return response()->json([
            'message' => 'Successfully deleted ' . $deleted_count . ' users!',
        ]);
    }
}
