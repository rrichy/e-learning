<?php

namespace App\Http\Controllers;

use App\Models\Affiliation;
use App\Models\Category;
use Illuminate\Http\Request;

class OptionsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Grab all fields from a request params, put into a collection where only unique fields are retained
        $fields = collect(explode(',', request()->input('fields', '')))->unique()->values();

        $options = $fields->mapWithKeys(function ($field, $_) {
            $value = [];
            switch ($field) {
                case 'affiliations': {
                        $value = Affiliation::get(['id', 'name']);
                        break;
                    }
                case 'categories': {
                        $value = Category::get(['id', 'name']);
                        break;
                    }
            }

            return [$field => $value];
        });

        return response()->json($options);
    }
}
