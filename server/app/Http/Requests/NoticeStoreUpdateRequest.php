<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class NoticeStoreUpdateRequest extends FormRequest
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

    protected function prepareForValidation()
    {
        $auth = auth()->user();
        
        $this->merge([
            'user_id' => auth()->id(),
            'affiliation_id' => $auth->isCorporate() ? $auth->affiliation_id : request()->affiliation_id,
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        $rules = [
            'subject' => 'required|string',
            'content' => 'required|string',
            'posting_method' => 'array|min:1', // not a model attribute
            'posting_method.*' => 'integer|in:1,2',            
            'date_publish_start' => ['required', 'date_format:Y-m-d'],
            'date_publish_end' => ['required', 'date_format:Y-m-d', 'after:date_publish_start'],
            'signature_id' => 'required|integer|exists:signatures,id',
            'affiliation_id' => 'nullable|integer|exists:affiliations,id',
        ];

        if (request()->method() === 'POST') {
            $rules['user_id'] = 'required|integer|exists:users,id';
        }

        return $rules;
    }
}
