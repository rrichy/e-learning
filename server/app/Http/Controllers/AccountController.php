<?php

namespace App\Http\Controllers;

use App\Http\Requests\AccountIndexRequest;
use App\Http\Requests\AccountMultipleStoreRequest;
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

    public function store(AccountStoreUpdateRequest $request, AccountService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        try {
            $service->store($request->validated(), auth()->user());
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return response()->json([
            'message' => 'Successfully registered a new account!'
        ]);
    }

    public function show(Request $request, User $account, AccountService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);
        Gate::authorize('view-account', $account);
        
        return $service->show($account, $request->boolean('parsed'), auth()->user());
    }

    public function update(AccountStoreUpdateRequest $request, User $account, AccountService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);
        Gate::authorize('update-account', $account);

        try {
            $service->update($request->validated(), $account, auth()->user());
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return response()->json([
            'message' => 'Successfully updated an account!'
        ]);
    }

    public function massDelete(string $ids, AccountService $service)
    {
        $collection_id = collect(explode(',', $ids));
        Gate::authorize('check-membership', [['admin', 'corporate']]);
        Gate::authorize('delete-account', $collection_id);

        try {
            $deleted_count = $service->deleteIds($collection_id, auth()->user());
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return response()->json([
            'message' => 'Successfully deleted ' . $deleted_count . ' users!',
        ]);
    }

    public function multipleStore(AccountMultipleStoreRequest $request, AccountService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        try {
            $json = $service->multipleStore($request->validated());
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return response()->json($json);
    }
}
