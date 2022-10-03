<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CategoryStoreUpdateRequest extends FormRequest
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
            'name' => ['required', 'string', Rule::unique('categories', 'name')->when(request()->id > 0, fn ($q) => $q->ignore(request()->id))],
            'start_period' => 'required|date',
            'end_period' => 'required|date|after:start_period',
            'child_categories' => 'present|array',
            'child_categories.*.name' => 'required|string|distinct',
            'child_categories.*.priority' => 'required|numeric|min:1|distinct',
            'priority' => ['required', 'numeric', 'min:1', Rule::unique('categories')->where(fn ($q) => $q->whereNull('parent_id'))->when(request()->id > 0, fn ($q) => $q->ignore(request()->id))],
        ];

        if (request()->method() === 'POST') {
            $rules['affiliation_id'] = 'nullable|integer|exists:affiliations,id';
        }

        return $rules;
    }
}
