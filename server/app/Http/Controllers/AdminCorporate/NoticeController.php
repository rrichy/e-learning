<?php

namespace App\Http\Controllers\AdminCorporate;

use App\Http\Controllers\Controller;
use App\Http\Requests\NoticeStoreUpdateRequest;
use App\Models\Notice;
use App\Services\NoticeService;
use Illuminate\Support\Facades\Gate;

class NoticeController extends Controller
{
    public function index(NoticeService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate', 'individual']]);

        return $service->list();
    }

    public function store(NoticeStoreUpdateRequest $request, NoticeService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        $service->store($request);

        return response()->json([
            'message' => 'Successfully posted a new notice!'
        ]);
    }

    public function show(Notice $notice, NoticeService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate', 'individual']]);

        return $service->details($notice);
    }

    public function update(NoticeStoreUpdateRequest $request, Notice $notice, NoticeService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        $service->update($request, $notice);

        return response()->json([
            'message' => 'Successfully updated notice!'
        ]);
    }

    public function massDelete(string $ids, NoticeService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        $deleted_count = $service->deleteIds($ids);

        return response()->json([
            'message' => 'Successfully deleted ' . $deleted_count . ' notices!',
        ]);
    }
}
