<?php

namespace App\Http\Controllers;

use App\Http\Resources\NoticeIndexResource;
use App\Models\Notice;
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
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
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
        $deleted_count = \App\Models\Notice::destroy($ids);

        return response()->json([
            'message' => 'Successfully deleted ' . $deleted_count . ' notices!',
        ]);
    }
}
