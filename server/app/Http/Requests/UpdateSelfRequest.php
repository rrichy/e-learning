<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSelfRequest extends FormRequest
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
        $auth = auth()->user();

        if ($auth->isAdmin()) {
            $this->merge([
                'name' => $this->name,
                'email' => $this->email,
                'image' => $this->image,
            ]);
        } else if ($auth->isCorporate() || $auth->isIndividual()) {
            $this->merge([
                'name' => $this->name,
                'email' => $this->email,
                'image' => $this->image,
                'sex' => $this->sex,
                'birthday' => $this->birthday,
                'department_1' => $this->department_1 ?: null,
                'department_2' => $this->department_2 ?: null,
                'remarks' => $this->remarks,
            ]);
        } else {
            $this->merge([
                'name' => $this->name,
                'email' => $this->email,
                'image' => $this->image,
                'sex' => $this->sex,
                'birthday' => $this->birthday,
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        $auth = auth()->user();
        $image_prefix = config('constants.prefixes.s3') . ',' . config('constants.prefixes.picsum');

        if ($auth->isAdmin()) {
            return [
                'name' => 'required|string',
                'email' => 'required|string|email|unique:users,email,' . auth()->id(),
                'image' => 'nullable|string|starts_with:' . $image_prefix,
            ];
        } else if ($auth->isCorporate() || $auth->isIndividual()) {
            return [
                'name' => 'required|string',
                'email' => 'required|string|email|unique:users,email,' . auth()->id(),
                'image' => 'nullable|string|starts_with:' . $image_prefix,
                'sex' => 'required|integer|in:1,2',
                'birthday' => ['required', 'date_format:Y-m-d'],
                'department_1' => [
                    'nullable',
                    'required_with:department_2',
                    'integer',
                    Rule::exists('departments', 'id')->where(fn ($q) => $q->where('affiliation_id', auth()->user()->affiliation_id))
                ],
                'department_2' => [
                    'nullable',
                    'integer',
                    Rule::exists('departments', 'id')->where(fn ($q) => $q->where('parent_id', request()->department_1))
                ],
                'remarks' => 'nullable|string',
            ];
        } else {
            return [
                'name' => 'required|string',
                'email' => 'required|string|email|unique:users,email,' . auth()->id(),
                'image' => 'nullable|string|starts_with:' . $image_prefix,
                'sex' => 'required|integer|in:1,2',
                'birthday' => ['required', 'date_format:Y-m-d'],
            ];
        }
    }
}
