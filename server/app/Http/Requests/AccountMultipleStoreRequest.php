<?php

namespace App\Http\Requests;

use App\Models\Affiliation;
use App\Models\Department;
use App\Models\MembershipType;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class AccountMultipleStoreRequest extends FormRequest
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

    public function prepareForValidation()
    {
        $file = [];

        foreach ($this->file as $account) {
            $validator = Validator::make(
                [
                    'email' => $account['email'],
                    'password' => $account['password']
                ],
                [
                    'email' => 'unique:users,email',
                    'password' => ['required', Password::defaults()]
                ]
            );

            if ($validator->fails()) {
                continue;
            }

            if (!in_array(intval($account['sex']), [1, 2])) {
                $account['sex'] = 1;
            }
            if (
                !in_array(intval($account['membership_type_id']), MembershipType::TYPES)
                || ($this->user()->isCorporate() && $account['membership_type_id'] != MembershipType::INDIVIDUAL)
                || (in_array($account['membership_type_id'], [MembershipType::INDIVIDUAL, MembershipType::CORPORATE]) && empty($account['affiliation_id']))
            ) {
                $account['membership_type_id'] = MembershipType::TRIAL;
            }
            if (in_array(intval($account['membership_type_id']), [MembershipType::TRIAL, MembershipType::ADMIN])) {
                $account['affiliation_id'] = null;
                $account['department_1'] = null;
                $account['department_2'] = null;
            } else {
                $account['affiliation_id'] = Affiliation::where('id', $account['affiliation_id'])->exists() ? $account['affiliation_id'] : null;
                $account['department_1'] = Department::where('affiliation_id', $account['affiliation_id'])->where('id', $account['department_1'])->exists() ? $account['department_1'] : null;
                $account['department_2'] = Department::where('parent_id', $account['department_1'])->where('id', $account['department_2'])->exists() ? $account['department_2'] : null;
            }

            if ($account['membership_type_id'] == MembershipType::ADMIN) {
                $account['remarks'] = null;
            }

            $file[] = $account;
        }

        $title = $this->title ?: null;
        $content = $this->string('content') ?: null;
        $signature_id = $this->boolean('checked') ? $this->signature_id : null;

        $this->merge(compact('file', 'title', 'content', 'signature_id'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        $rules = [
            'file' => 'required|array',
            'file.*.name' => 'required|string',
            'file.*.email' => 'required|string|email|max:255|unique:users,email|distinct',
            'file.*.sex' => 'required|numeric|in:1,2',
            'file.*.birthday' => 'required|date_format:Y-m-d|before:today',
            'file.*.password' => ['required', Password::defaults()],
            'file.*.remarks' => ['nullable', 'string'],
            'checked' => 'required|boolean',
            'title' => 'nullable|required_if:checked,true',
            'content' => 'nullable|required_if:checked,true',
            'signature_id' => 'nullable|required_if:checked,true|exists:signatures,id',
        ];

        foreach ($this->file as $index => $account) {
            $rules['file.' . $index . '.membership_type_id'] = ['required', 'integer', Rule::in(MembershipType::TYPES)];
            $rules['file.' . $index . '.affiliation_id'] = [
                'nullable',
                'required_with:department_1,department_2',
                'integer',
                'exists:affiliations,id',
                Rule::requiredIf(fn () => in_array($account['membership_type_id'], [MembershipType::INDIVIDUAL, MembershipType::CORPORATE])),
            ];
            $rules['file.' . $index . '.department_1'] = [
                'nullable',
                'required_with:department_2',
                'integer',
                Rule::exists('departments', 'id')->where(fn ($q) => $q->where('affiliation_id', $account['affiliation_id']))
            ];
            $rules['file.' . $index . '.department_2'] = [
                'nullable',
                'integer',
                Rule::exists('departments', 'id')->where(fn ($q) => $q->where('parent_id', $account['department_1']))
            ];
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'file.required' => 'No valid rows in your CSV!'
        ];
    }
}
