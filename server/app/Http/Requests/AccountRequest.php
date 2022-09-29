<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;

class AccountRequest extends FormRequest
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
            'affiliation_id' => request()->affiliation_id ?: null,
            'department_1' => request()->department_1 ?: null,
            'department_2' => request()->department_2 ?: null,
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
            'name' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'string', 'max:255'],
            'sex' => ['required', 'integer', 'in:1,2'],
            'birthday' => ['required', 'date_format:Y-m-d', 'before:today'],
            'affiliation_id' => ['nullable', 'required_with:department_1,department_2', 'integer', 'exists:affiliations,id'],
            'department_1' => [
                'nullable',
                'required_with:department_2',
                'integer',
                Rule::exists('departments', 'id')->where(fn ($q) => $q->where('affiliation_id', request()->affiliation_id))
            ],
            'department_2' => [
                'nullable',
                'integer',
                Rule::exists('departments', 'id')->where(fn ($q) => $q->where('parent_id', request()->department_1))
            ],
            'remarks' => ['nullable', 'string'],
        ];

        if (request()->method() === 'POST') {
            $rules['password'] = ['required', 'confirmed', Rules\Password::defaults()];
            $rules['email'] = ['required', 'string', 'email', 'max:255', 'unique:users'];
        } else {
            $rules['email'] = ['required', 'string', 'email', 'max:255', 'unique:users,email,' . request()->id];
        }

        return $rules;
    }
}
