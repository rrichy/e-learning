<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CoursePriorityUpdateRequest extends FormRequest
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
        $rules = [
            'payload' => 'array',
            'payload.*.category_id' => 'required|integer',
            'payload.*.changes' => 'array',
            'payload.*.changes.*.id' => 'required|integer|distinct|exists:courses,id',
        ];

        foreach (request()->payload as $index => $category) {
            $course_ids = array_map(fn ($q) => $q['id'], $category['changes']);
            $rules['payload.' . $index . '.changes.*.priority'] = [
                'required',
                'integer',
                'distinct',
                'min:1',
                Rule::unique('courses', 'priority')
                    ->where(function ($q) use ($category, $course_ids) {
                        $q->where('category_id', $category['category_id'])
                            ->whereNotIn('id', $course_ids);
                    })
            ];
        }

        return $rules;
    }
}
