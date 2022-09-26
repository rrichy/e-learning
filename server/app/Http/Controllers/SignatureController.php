<?php

namespace App\Http\Controllers;

use App\Http\Resources\SignatureIndexResource;
use App\Models\Signature;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class SignatureController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $order = request()->input('order', 'asc');
        $per_page = request()->input('per_page', '10');
        $sort = request()->input('sort', 'id');

        return SignatureIndexResource::collection(Signature::orderBy($sort, $order)->paginate($per_page))->additional(['message' => 'Signatures successfully fetched!']);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $valid = $request->validate([
            'name' => 'required|string',
            'from_email' => 'required|string|email',
            'from_name' => 'required|string',
            'content' => 'required|string',
            'priority' => 'required|integer|min:1|unique:signatures',
        ]);

        Signature::create($valid);

        return response()->json([
            'message' => 'Successfully created a signature!',
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Signature
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, \App\Models\Signature $signature)
    {
        $valid = $request->validate([
            'name' => 'required|string',
            'from_email' => 'required|string|email',
            'from_name' => 'required|string',
            'content' => 'required|string',
            'priority' => 'required|integer|min:1|unique:signatures,priority,' . $signature->id,
        ]);

        $signature->update($valid);

        return response()->json([
            'message' => 'Successfully updated a signature!',
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
        $deleted_count = \App\Models\Signature::destroy($ids);

        return response()->json([
            'message' => 'Successfully deleted ' . $deleted_count . ' signatures!',
        ]);
    }
}
