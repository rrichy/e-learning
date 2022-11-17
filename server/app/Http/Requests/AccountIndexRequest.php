<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AccountIndexRequest extends FormRequest
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
            'membership_type_id' => 'numeric',
            'affiliation_id' => 'numeric',
            'department_1' => 'numeric',
            'department_2' => 'numeric',
            'name' => 'string',
            'email' => 'string',
            'remarks' => 'string',
            'registered_min_date' => 'required_with:registered_min_date',
            'registered_max_date' => 'required_with:registered_max_date',
            'never_logged_in' => 'boolean',
            'logged_in_min_date' => 'required_with:logged_in_max_date',
            'logged_in_max_date' => 'required_with:logged_in_min_date',
            'order' => 'string|in:asc,desc',
            'per_page' => 'numeric',
            'sort' => 'string|in:id,email,name,affiliation_id,created_at,last_login_date,department_1,department_2'
        ];
    }
}
