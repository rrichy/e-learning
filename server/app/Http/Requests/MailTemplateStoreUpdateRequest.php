<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MailTemplateStoreUpdateRequest extends FormRequest
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
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        $this->merge([
            'affiliation_id' => auth()->user()->affiliation_id,
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
            'title' => 'required|string',
            'content' => 'required|string',
            'signature_id' => 'required|integer|exists:signatures,id',
        ];

        // Use the authenticated user's affiliation_id if creating a new resource
        if (request()->method() === 'POST') {
            $rules['affiliation_id'] = 'nullable|integer|exists:affiliations,id';
        }
        
        return $rules;
    }
}
