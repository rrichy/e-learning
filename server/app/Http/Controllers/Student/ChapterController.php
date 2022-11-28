<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubmitTestRequest;
use App\Models\Chapter;
use App\Models\Test;
use App\Services\ChapterService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ChapterController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    // public function index()
    // {
    //     //
    // }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    // public function create()
    // {
    //     //
    // }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    // public function store(Request $request)
    // {
    //     //
    // }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Chapter  $chapter
     * @return \Illuminate\Http\Response
     */
    public function showTest(Request $request, Chapter $chapter, ChapterService $service)
    {
        Gate::authorize('check-membership', [['individual']]);

        $valid = $request->validate([
            'test_type' => 'required|numeric',
        ]);

        $test_type = intval($valid) === Test::CHAPTER ? 'chapterTest' : 'comprehensionTest';

        try {
            $chapters = $service->testDetails($chapter, $test_type);
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return $chapters;
    }

    public function proceedTest(Request $request, Chapter $chapter, ChapterService $service)
    {
        Gate::authorize('check-membership', [['individual']]);

        $valid = $request->validate([
            'test_type' => 'required|numeric',
        ]);

        $test_type = intval($valid) === Test::CHAPTER ? 'chapterTest' : 'comprehensionTest';

        try {
            $chapters = $service->proceedTest($chapter, $test_type);
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return $chapters;
    }

    public function submitTest(SubmitTestRequest $request, Chapter $chapter, ChapterService $service)
    {
        Gate::authorize('check-membership', [['individual']]);

        $valid = $request->validate([
            'test_type' => 'required|numeric',
        ]);

        $test_type = intval($valid) === Test::CHAPTER ? 'chapterTest' : 'comprehensionTest';

        try {
            $chapters = $service->submitTest($request->validated(), $chapter, $test_type);
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return $chapters;
    }

    public function listVideos(Chapter $chapter, ChapterService $service)
    {
        Gate::authorize('check-membership', [['individual']]);

        try {
            $chapters = $service->listVideos($chapter);
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return $chapters;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Chapter  $chapter
     * @return \Illuminate\Http\Response
     */
    // public function edit(Chapter $chapter)
    // {
    //     //
    // }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Chapter  $chapter
     * @return \Illuminate\Http\Response
     */
    // public function update(Request $request, Chapter $chapter)
    // {
    //     //
    // }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Chapter  $chapter
     * @return \Illuminate\Http\Response
     */
    // public function destroy(Chapter $chapter)
    // {
    //     //
    // }
}
