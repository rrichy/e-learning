<?php

namespace App\Http\Controllers\AdminCorporate;

use App\Http\Controllers\Controller;
use App\Http\Requests\NoticeStoreUpdateRequest;
use App\Models\Notice;
use App\Services\NoticeService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class NoticeController extends Controller
{
    public function index(Request $request, NoticeService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate', 'individual']]);

        $valid = $request->validate([
            'order' => 'string|in:asc,desc',
            'per_page' => 'numeric',
            'sort' => 'string|in:id,author,subject,priority,created_at'
        ]);

        try {
            $notices = $service->index($valid, auth()->user());
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return $notices;
    }

    public function store(NoticeStoreUpdateRequest $request, NoticeService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        try {
            $service->store($request->validated());
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return response()->json([
            'message' => 'Successfully posted a new notice!'
        ]);
    }

    public function show(Notice $notice, NoticeService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate', 'individual']]);
        Gate::authorize('view-notice', $notice);

        try {
            $notices = $service->details($notice);
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return $notices;
    }

    public function update(NoticeStoreUpdateRequest $request, Notice $notice, NoticeService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);
        Gate::authorize('update-notice', $notice);

        try {
            $service->update($request->validated(), $notice);
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return response()->json([
            'message' => 'Successfully updated notice!'
        ]);
    }

    public function massDelete(string $ids, NoticeService $service)
    {
        $collection_id = collect(explode(',', $ids));
        Gate::authorize('check-membership', [['admin', 'corporate']]);
        Gate::authorize('delete-notice', $collection_id);

        try {
            $deleted_count = $service->deleteIds($collection_id);
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return response()->json([
            'message' => 'Successfully deleted ' . $deleted_count . ' notices!',
        ]);
    }
}
