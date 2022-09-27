<?php

namespace App\Http\Controllers;

use App\Http\Resources\MailTemplateIndexResource;
use App\Models\MailTemplate;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

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

    /**
     * Mass update priority number of mail templates
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function massUpdate(Request $request)
    {
        // Gate::authorize('massUpdate-mail-template', $course);
        $template_ids = array_map(fn ($q) => $q['id'], $request->payload);

        $rules = [
            'payload' => 'array',
            'payload.*.id' => 'required|integer|distinct|exists:mail_templates,id',
            'payload.*.priority' => [
                'required',
                'integer',
                'distinct',
                'min:1',
                Rule::unique('mail_templates', 'priority')
                    ->where(function ($q) use ($template_ids) {
                        $q->whereNotIn('id', $template_ids);
                    })
            ]
        ];

        $count = 0;
        foreach ($request->validate($rules)['payload'] as $template) {
            MailTemplate::find($template['id'])->update(['priority' => $template['priority']]);
            $count++;
        }

        return response()->json([
            'message' => 'Successfully updated ' . $count . ' mail templates!',
        ]);
    }
}
