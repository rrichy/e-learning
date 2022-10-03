<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DepartmentStoreUpdateRequest extends FormRequest
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
        $auth = auth()->user();

        $this->merge([
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
            'affiliation_id' => 'required|numeric|exists:affiliations,id',
            'name' => [
                'required', 
                'string', 
                Rule::unique('departments')
                    ->where(fn ($q) => $q->where('affiliation_id', request()->affiliation_id)->whereNull('parent_id'))
                    ->when(request()->id, fn ($q) => $q->ignore(request()->id))
            ],
            'priority' => [
                'required', 
                'numeric', 
                'min:1', 
                Rule::unique('departments')
                    ->where(function ($q) {
                        $q->where('affiliation_id', request()->affiliation_id)->whereNull('parent_id');
                    })->when(request()->id, fn ($q) => $q->ignore(request()->id))
            ],
            'child_departments' => 'present|array',
            'child_departments.*.name' => 'required|string|distinct',
            'child_departments.*.priority' => 'required|numeric|min:1|distinct',
        ];

        return $rules;
    }
}
