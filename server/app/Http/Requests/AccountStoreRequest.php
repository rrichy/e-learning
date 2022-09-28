<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;

class AccountStoreRequest extends FormRequest
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
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'sex' => ['required', 'integer', 'in:1,2'],
            'birthday' => ['required', 'date', 'before:today'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
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
    }
}
