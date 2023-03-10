<?php

namespace App\Http\Controllers\AdminCorporate;

use App\Http\Controllers\Controller;
use App\Models\Affiliation;
use App\Models\Category;
use App\Models\Department;
use App\Models\MailTemplate;
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
        $raw_fields = request()->input('fields');
        if ($raw_fields) {
            $fields = collect(explode(',', $raw_fields))->unique()->values();

            $options = $fields->mapWithKeys(function ($field, $_) {
                $value = [];
                switch ($field) {
                    case 'affiliations': {
                            $value = Affiliation::query()
                                ->when(!auth()->user()->isAdmin(), fn ($q) => $q->where('id', auth()->user()->affiliation_id))
                                ->get(['id', 'name']);

                            break;
                        }
                        // parent_departments
                    case 'departments': {
                            $value = Department::query()
                                ->when(!auth()->user()->isAdmin(), fn ($q) => $q->where('affiliation_id', auth()->user()->affiliation_id))
                                ->whereNull('parent_id')
                                ->get(['id', 'name', 'affiliation_id']);

                            break;
                        }
                    case 'child_departments': {
                            $value = Department::query()
                                ->when(!auth()->user()->isAdmin(), fn ($q) => $q->where('affiliation_id', auth()->user()->affiliation_id))
                                ->whereNotNull('parent_id')
                                ->get(['id', 'name', 'affiliation_id', 'parent_id']);

                            break;
                        }
                    case 'categories': {
                            $value = Category::query()
                                ->when(!auth()->user()->isAdmin(), fn ($q) => $q->where('affiliation_id', auth()->user()->affiliation_id)->whereNull('parent_id'))
                                ->get(['id', 'name']);
                            break;
                        }
                    case 'mail_templates': {
                            $value = MailTemplate::query()
                                ->when(!auth()->user()->isAdmin(), fn ($q) => $q->where('affiliation_id', auth()->user()->affiliation_id))
                                ->get(['id', 'title as name']);
                            break;
                        }
                    case 'signatures': {
                            $value = Signature::get(['id', 'name']);
                            break;
                        }
                }

                return [$field => $value];
            });

            return response()->json($options);
        } else {
            $options = [];

            // get departments of a given affiliation_id
            $affiliation_id = request()->input('affiliation_id');
            if ($affiliation_id) $options['departments'] = Department::where('affiliation_id', $affiliation_id)->whereNull('parent_id')->get(['id', 'name']);

            // get child_departments of a given department_id
            $department_id = request()->input('department_id');
            if ($department_id) $options['child_departments'] = Department::where('parent_id', $department_id)->get(['id', 'name']);

            return response()->json($options);
        }
    }
}
