<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use App\Services\InquiryService;
use Exception;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    public function index(Request $request, InquiryService $service)
    {
        $valid = $request->validate([
            'order' => 'string|in:asc,desc',
            'per_page' => 'numeric',
            'sort' => 'string|in:id,email,name,content,created_at'
        ]);

        try {
            $inquiries = $service->list($valid);
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return $inquiries;
    }

    public function store(Request $request, InquiryService $service)
    {
        $valid = $request->validate([
            'content' => 'required|string',
        ]);

        try {
            $result = $service->store($valid['content'], auth()->user());
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return response()->json([
            'message' => $result ? 'Successfully sent an inquiry!' : 'Failed to send inquiry'
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Inquiry  $inquiry
     * @return \Illuminate\Http\Response
     */
    public function show(Inquiry $inquiry)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Inquiry  $inquiry
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Inquiry $inquiry)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Inquiry  $inquiry
     * @return \Illuminate\Http\Response
     */
    public function destroy(Inquiry $inquiry)
    {
        //
    }
}
