<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AttendeeListRequest extends FormRequest
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
            'affiliation_id' => 'numeric',
            'name' => 'string',
            'email' => 'string',
            'remarks' => 'string',
            'never_logged_in' => 'boolean',
            'logged_in_min_date' => 'required_with:logged_in_max_date',
            'logged_in_max_date' => 'required_with:logged_in_min_date',
            'narrowed_by' => 'numeric|in:1,2,3',
            'order' => 'string|in:desc,asc',
            'per_page' => 'numeric',
            'sort' => 'string|in:id,name,email,start_date,progress_rate,highest_score,latest_score,completion_date'
        ];
    }
}
