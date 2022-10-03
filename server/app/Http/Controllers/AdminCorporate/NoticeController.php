<?php

namespace App\Http\Controllers\AdminCorporate;

use App\Http\Controllers\Controller;
use App\Http\Requests\NoticeStoreUpdateRequest;
use App\Models\Notice;
use App\Services\NoticeService;

class NoticeController extends Controller
{
    public function index(NoticeService $service)
    {
        return $service->list();
    }

    public function store(NoticeStoreUpdateRequest $request, NoticeService $service)
    {
        $service->store($request);

        return response()->json([
            'message' => 'Successfully posted a new notice!'
        ]);
    }

    public function show(Notice $notice, NoticeService $service)
    {
        return $service->details($notice);
    }

    public function update(NoticeStoreUpdateRequest $request, Notice $notice, NoticeService $service)
    {
        $service->update($request, $notice);

        return response()->json([
            'message' => 'Successfully updated notice!'
        ]);
    }

    public function massDelete(string $ids, NoticeService $service)
    {
        $deleted_count = $service->deleteIds($ids);

        return response()->json([
            'message' => 'Successfully deleted ' . $deleted_count . ' notices!',
        ]);
    }
}
