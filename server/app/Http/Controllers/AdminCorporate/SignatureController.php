<?php

namespace App\Http\Controllers\AdminCorporate;

use App\Http\Controllers\Controller;
use App\Http\Resources\SignatureIndexResource;
use App\Models\Signature;
use Illuminate\Http\Request;

// TODO: TRANSFER ALL LOGIC INTO A SERVICE CLASS
class SignatureController extends Controller
{
    public function index(Request $request)
    {
        $pagination = $request->validate([
            'order' => 'string|in:asc,desc',
            'per_page' => 'numeric',
            'sort' => 'string|in:id,name,from_name,from_email,content,priority'
        ]);

        // $order = request()->input('order', 'asc');
        // $per_page = request()->input('per_page', '10');
        // $sort = request()->input('sort', 'id');

        return SignatureIndexResource::collection(
            Signature::orderBy($pagination['sort'] ?? 'id', $pagination['order'] ?? 'desc')
                ->paginate($pagination['per_page'] ?? 10)
            )->additional([
            'message' => 'Signatures successfully fetched!',
            'meta' => [
                'sort' => $pagination['sort'] ?? 'id',
                'order' => $pagination['order'] ?? 'desc',
            ],
        ]);
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
