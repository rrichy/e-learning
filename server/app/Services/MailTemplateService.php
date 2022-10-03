<?php

namespace App\Services;

use App\Http\Requests\MailTemplateStoreUpdateRequest;
use App\Http\Resources\MailTemplateIndexResource;
use App\Models\MailTemplate;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MailTemplateService
{
    public function list()
    {
        $order = request()->input('order', 'asc');
        $per_page = request()->input('per_page', '10');
        $sort = request()->input('sort', 'id');

        return MailTemplateIndexResource::collection(
            MailTemplate::when(
                auth()->user()->isCorporate(),
                fn ($q) => $q->where('affiliation_id', auth()->user()->affiliation_id)
            )->orderBy($sort, $order)->paginate($per_page)
        )->additional(['message' => 'Mail templates successfully fetched!']);
    }


    public function update(MailTemplateStoreUpdateRequest $request, MailTemplate $mail_template)
    {
        abort_if(
            auth()->user()->isCorporate() && auth()->user()->affiliation_id !== $mail_template->affiliation_id,
            403,
            "This action is unauthorized."
        );
        
        $valid = $request->validated();

        $mail_template->update($valid);
    }


    public function store(MailTemplateStoreUpdateRequest $request)
    {
        $valid = $request->validated();

        MailTemplate::create(array_merge($valid, ['priority' => MailTemplate::max('priority') + 1]));
    }


    public function deleteIds(string $ids)
    {
        $auth = auth()->user();
        $ids = explode(',', $ids);

        if ($auth->isAdmin()) return MailTemplate::destroy($ids);

        $validIdCount = MailTemplate::where('affiliation_id', $auth->affiliation_id)->whereIn('id', $ids)->count();
        abort_if(
            count($ids) !== $validIdCount,
            403,
            'You have no authority of deleting some of these departments'
        );

        return MailTemplate::destroy($ids);
    }


    public function updatePriorities(Request $request)
    {
        $auth = auth()->user();
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

        $valid = $request->validate($rules);

        if ($auth->isCorporate()) {
            $ids = array_map(fn ($item) => $item['id'], $valid['payload']);
            $validIdCount = MailTemplate::where('affiliation_id', $auth->affiliation_id)->whereIn('id', $ids)->count();
            abort_if(
                count($ids) !== $validIdCount,
                403,
                'You have no authority of updating some of there mail templates!'
            );
        }

        $count = 0;
        foreach ($valid['payload'] as $template) {
            MailTemplate::find($template['id'])->update(['priority' => $template['priority']]);
            $count++;
        }

        return $count;
    }
}
