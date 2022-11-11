<?php

namespace App\Http\Controllers\AdminCorporate;

use App\Http\Controllers\Controller;
use App\Http\Resources\AffiliationResource;
use App\Models\Affiliation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class AffiliationController extends Controller
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

        return AffiliationResource::collection(
            Affiliation::orderBy($pagination['sort'] ?? 'id', $pagination['order' ?? 'asc'])
                ->when(auth()->user()->isCorporate(), fn ($q) => $q->where('id', auth()->user()->affiliation_id))
                ->paginate($pagination['per_page'] ?? 10)
        )->additional([
            'message' => 'Affiliations successfully fetched!',
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
            'name' => 'required|string|unique:affiliations,name',
            'priority' => 'required|numeric|min:1|unique:affiliations,priority',
        ]);

        Affiliation::create($valid);

        return response()->json([
            'message' => 'Successfully created an affiliation!',
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Affiliation  $affiliation
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Affiliation $affiliation)
    {
        $valid = $request->validate([
            'name' => 'required|string|unique:affiliations,name,' . $affiliation->id,
            'priority' => 'required|numeric|min:1|unique:affiliations,priority,' . $affiliation->id,
        ]);

        $affiliation->update($valid);

        return response()->json([
            'message' => 'Successfully updated an affiliation!',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  string  $affiliation
     * @return \Illuminate\Http\Response
     */
    public function destroy(string $affiliation)
    {
        $ids = explode(",", $affiliation);
        $deleted_count = \App\Models\Affiliation::destroy($ids);

        return response()->json([
            'message' => 'Successfully deleted ' . $deleted_count . ' affiliations!',
        ]);
    }
}
