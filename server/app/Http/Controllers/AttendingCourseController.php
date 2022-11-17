<?php

namespace App\Http\Controllers;

use App\Http\Resources\AttendingCourseHomepageResource;
use App\Models\AttendingCourse;
use App\Services\AttendingCourseService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AttendingCourseController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, AttendingCourseService $service)
    {
        Gate::authorize('check-membership', [['individual']]);

        $valid = $request->validate([
            'order' => 'string|in:asc,desc',
            'per_page' => 'numeric',
            'sort' => 'string|in:id,title,start_date,completion_date,progress_rate,latest_score'
        ]);

        try {
            $attending_courses = $service->index($valid, auth()->user());
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return $attending_courses;

        // return AttendingCourseHomepageResource::collection(AttendingCourse::where('user_id', auth()->user()->id)->orderBy($sort, $order)->paginate($per_page))->additional(['message' => 'Signatures successfully fetched!']);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
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
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
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
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
