<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubmitTestRequest extends FormRequest
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
        // lowercase and trimming of answers
        $answers = [];

        foreach($this->answers as $question) {
            foreach($question as $q) {
                $answers[] = [
                    'question_id' => $q['question_id'],
                    'order' => $q['order'],
                    'answer' => trim(strtolower($q['answer'])),
                ];
            }
        }
        
        $this->merge([
            'answers' => $answers,
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'answers' => 'present|array',
            'answers.*.question_id' => 'required|integer|exists:questions,id',
            'answers.*.order' => 'required|integer|min:1',
            'answers.*.answer' => 'required|string',
        ];
    }
}
