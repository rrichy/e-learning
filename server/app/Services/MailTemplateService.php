<?php

namespace App\Services;

use App\Http\Resources\MailTemplateIndexResource;
use App\Http\Resources\ShowMailTemplateResource;
use App\Models\MailTemplate;
use Illuminate\Support\Collection;

class MailTemplateService
{
    public function index(array $pagination = [], mixed $affiliation_id)
    {
        $sort = $pagination['sort'] ?? 'id';
        $order = $pagination['order'] ?? 'desc';
        $per_page = $pagination['per_page'] ?? 10;

        return MailTemplateIndexResource::collection(
            MailTemplate::when(
                $affiliation_id,
                fn ($q) => $q->where('affiliation_id', $affiliation_id)
            )->orderBy($sort, $order)
                ->paginate($per_page)
        )->additional([
            'message' => 'Mail templates successfully fetched!',
            'meta' => compact('sort', 'order'),
        ]);
    }


    public function store(array $valid)
    {
        return MailTemplate::create(array_merge($valid, ['priority' => MailTemplate::max('priority') + 1]));
    }


    public function show(MailTemplate $mail_template)
    {
        return new ShowMailTemplateResource($mail_template);
    }


    public function update(array $valid, MailTemplate $mail_template)
    {
        return $mail_template->update($valid);
    }


    public function deleteIds(Collection $ids)
    {
        return MailTemplate::destroy($ids);
    }


    public function updatePriorities(array $valid)
    {
        $count = 0;
        foreach ($valid['payload'] as $template) {
            MailTemplate::find($template['id'])->update(['priority' => $template['priority']]);
            $count++;
        }

        return $count;
    }
}
