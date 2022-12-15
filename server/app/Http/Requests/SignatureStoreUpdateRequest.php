<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SignatureStoreUpdateRequest extends FormRequest
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
            'name' => 'required|string',
            'from_email' => 'required|string|email',
            'from_name' => 'required|string',
            'content' => 'required|string',
            // 'priority' => [
            //     'required',
            //     'integer',
            //     'min:1',
            //     Rule::unique('signatures')->when($this->signature, fn ($q) => $q->ignore($this->signature))
            // ]
        ];
    }
}
