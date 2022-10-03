<?php

namespace App\Http\Controllers\AdminCorporate;

use App\Http\Controllers\Controller;
use App\Http\Requests\NoticeStoreUpdateRequest;
use App\Http\Resources\NoticeIndexResource;
use App\Http\Resources\NoticeShowResource;
use App\Models\Notice;
use App\Services\NoticeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class NoticeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        Gate::authorize('viewAny-notice');

        $order = request()->input('order', 'asc');
        $per_page = request()->input('per_page', '10');
        $sort = request()->input('sort', 'id');

        return NoticeIndexResource::collection(Notice::with('user')->orderBy($sort, $order)->paginate($per_page))->additional(['message' => 'Notices successfully fetched!']);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\NoticeStoreUpdateRequest  $request
     * @param  \App\Services\NoticeService  $service
     * @return \Illuminate\Http\Response
     */
    public function store(NoticeStoreUpdateRequest $request, NoticeService $service)
    {
        Gate::authorize('create-notice');

        $service->store($request);

        return response()->json([
            'message' => 'Successfully posted a new notice!'
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Notice  $notice
     * @return \Illuminate\Http\Response
     */
    public function show(Notice $notice)
    {
        Gate::authorize('view-notice', $notice);

        return new NoticeShowResource($notice);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\NoticeStoreUpdateRequest  $request
     * @param  \App\Models\Notice  $notice
     * @return \Illuminate\Http\Response
     */
    public function update(NoticeStoreUpdateRequest $request, Notice $notice, NoticeService $service)
    {
        Gate::authorize('update-notice', $notice);

        $service->update($request, $notice);

        return response()->json([
            'message' => 'Successfully updated notice!'
        ]);
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
        $deleted_count = \App\Models\Notice::destroy($ids);

        return response()->json([
            'message' => 'Successfully deleted ' . $deleted_count . ' notices!',
        ]);
    }
}
