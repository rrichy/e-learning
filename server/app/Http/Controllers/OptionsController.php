<?php

namespace App\Http\Controllers;

use App\Http\Resources\AffiliationOptionsResource;
use App\Http\Resources\DepartmentOptionsResource;
use App\Models\Affiliation;
use App\Models\Category;
use App\Models\Department;
use App\Models\MembershipType;
use App\Models\Signature;
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
                        $value = auth()->user()->membership_type_id === MembershipType::ADMIN
                            ? AffiliationOptionsResource::collection(Affiliation::with('departments.childDepartments')->get())
                            : [];
                        break;
                    }
                case 'departments': {
                        $value = DepartmentOptionsResource::collection(Department::whereNull('parent_id')->with('childDepartments')->get());
                        // use commented upon creating the relationship between affiliation and user
                        // $value = auth()->user()->membership_type_id === MembershipType::ADMIN 
                        //     ? DepartmentOptionsResource::collection(Department::with('childDepartments')->get())
                        //     : Department::where('affiliation_id', auth()->user()->affiliation)->get(['id', 'name', 'parent_id']);
                        break;
                    }
                case 'categories': {
                        $value = Category::get(['id', 'name']);
                        break;
                    }
                case 'signatures': {
                        $value = auth()->user()->membership_type_id === MembershipType::ADMIN ? Signature::get(['id', 'name']) : [];
                        break;
                    }
            }

            return [$field => $value];
        });

        return response()->json($options);
    }
}
