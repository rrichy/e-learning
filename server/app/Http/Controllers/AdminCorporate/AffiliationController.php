<?php

namespace App\Http\Controllers\AdminCorporate;

use App\Http\Controllers\Controller;
use App\Http\Resources\AffiliationResource;
use App\Models\Affiliation;
use App\Services\AffiliationService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class AffiliationController extends Controller
{
    public function index(Request $request, AffiliationService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        $valid = $request->validate([
            'order' => 'string|in:asc,desc',
            'per_page' => 'numeric',
            'sort' => 'string|in:id,name,from_name,from_email,content,priority'
        ]);

        try {
            $affiliations = $service->list($valid, auth()->user()->affiliation_id);
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return $affiliations;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, AffiliationService $service)
    {
        Gate::authorize('check-membership', [['admin']]);

        $valid = $request->validate([
            'name' => 'required|string|unique:affiliations,name',
            'priority' => 'required|numeric|min:1|unique:affiliations,priority',
        ]);

        try {
            $service->store($valid);
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

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
    public function update(Request $request, Affiliation $affiliation, AffiliationService $service)
    {
        Gate::authorize('check-membership', [['admin']]);

        $valid = $request->validate([
            'name' => 'required|string|unique:affiliations,name,' . $affiliation->id,
            'priority' => 'required|numeric|min:1|unique:affiliations,priority,' . $affiliation->id,
        ]);

        try {
            $service->update($valid, $affiliation);
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

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
    public function destroy(string $affiliation, AffiliationService $service)
    {
        $ids = collect(explode(",", $affiliation));
        Gate::authorize('check-membership', [['admin']]);

        try {
            $deleted_count = $service->deleteIds($ids);
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return response()->json([
            'message' => 'Successfully deleted ' . $deleted_count . ' affiliations!',
        ]);
    }
}
