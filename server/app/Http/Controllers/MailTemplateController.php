<?php

namespace App\Http\Controllers;

use App\Http\Resources\MailTemplateIndexResource;
use App\Models\MailTemplate;
use Illuminate\Http\Request;

class MailTemplateController extends Controller
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

        return MailTemplateIndexResource::collection(MailTemplate::orderBy($sort, $order)->paginate($per_page))->additional(['message' => 'Mail templates successfully fetched!']);
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
            'title' => 'required|string',
            'content' => 'required|string',
            'signature_id' => 'required|integer|exists:signatures,id',
        ]);

        MailTemplate::create(array_merge($valid, ['priority' => MailTemplate::max('priority') + 1]));

        return response()->json([
            'message' => 'Successfully created a mail template!',
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\MailTemplate  $mail_template
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, \App\Models\MailTemplate $mail_template)
    {
        $valid = $request->validate([
            'title' => 'required|string',
            'content' => 'required|string',
            'signature_id' => 'required|integer|exists:signatures,id',
        ]);

        $mail_template->update($valid);

        return response()->json([
            'message' => 'Successfully updated a mail template!',
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
        $deleted_count = \App\Models\MailTemplate::destroy($ids);

        return response()->json([
            'message' => 'Successfully deleted ' . $deleted_count . ' templates!',
        ]);
    }
}
