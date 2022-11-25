<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MailTemplatePriorityUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        $template_ids = array_map(fn ($q) => $q['id'], request()->payload);

        return [
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
    }
}
