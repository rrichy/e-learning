<?php

namespace App\Http\Controllers\AdminCorporate;

use App\Http\Controllers\Controller;
use App\Http\Requests\SignatureStoreUpdateRequest;
use App\Models\Signature;
use App\Services\SignatureService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class SignatureController extends Controller
{
    public function index(Request $request, SignatureService $service)
    {
        Gate::authorize('check-membership', [['admin']]);

        $pagination = $request->validate([
            'order' => 'string|in:asc,desc',
            'per_page' => 'numeric',
            'sort' => 'string|in:id,name,from_name,from_email,content,priority'
        ]);

        try {
            $list = $service->index($pagination);
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return $list;
    }

    public function store(SignatureStoreUpdateRequest $request, SignatureService $service)
    {
        Gate::authorize('check-membership', [['admin']]);

        try {
            $service->store($request->validated());
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return response()->json([
            'message' => 'Successfully created a signature!',
        ]);
    }

    public function update(SignatureStoreUpdateRequest $request, Signature $signature, SignatureService $service)
    {
        Gate::authorize('check-membership', [['admin']]);

        try {
            $service->update($signature, $request->validated());
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return response()->json([
            'message' => 'Successfully updated a signature!',
        ]);
    }

    public function massDelete(string $ids, SignatureService $service)
    {
        $collection_ids = collect(explode(',', $ids));
        Gate::authorize('check-membership', [['admin']]);
        Gate::authorize('delete-signature', $collection_ids);

        try {
            $deleted_count = $service->deleteIds($collection_ids);
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return response()->json([
            'message' => 'Successfully deleted ' . $deleted_count . ' signatures!',
        ]);
    }
}
