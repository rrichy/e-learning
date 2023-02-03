<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class UpdateSelfRequest extends FormRequest
{
    private $auth;

    public function __construct()
    {
        $this->auth = auth()->user();
    }

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
        // dd(request()->all());
        if ($this->auth->isAdmin()) {
            $this->merge([
                'name' => $this->name,
                'email' => $this->email,
                'image' => $this->image,
            ]);
        } else if ($this->auth->isCorporate() || $this->auth->isIndividual()) {
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
        $image_prefix = config('constants.prefixes.s3') . ',' . config('constants.prefixes.picsum');

        if ($this->auth->isAdmin()) {
            return [
                'name' => 'required|string',
                'email' => 'required|string|email|unique:users,email,' . $this->auth->id,
                // 'image' => 'nullable|string' . (config('filesystem.default') === 's3' ? '|starts_with:' . $image_prefix : ''),
                'image' => config('filesystems.default') === 's3' ? 'nullable|string|starts_with:' . $image_prefix : 'nullable|file',
            ];
        } else if ($this->auth->isCorporate() || $this->auth->isIndividual()) {
            return [
                'name' => 'required|string',
                'email' => 'required|string|email|unique:users,email,' . $this->auth->id,
                // 'image' => 'nullable|string' . (config('filesystem.default') === 's3' ? '|starts_with:' . $image_prefix : ''),
                'image' => config('filesystems.default') === 's3' ? 'nullable|string|starts_with:' . $image_prefix : 'nullable|file',
                'sex' => 'required|integer|in:1,2',
                'birthday' => ['required', 'date_format:Y-m-d'],
                'department_1' => [
                    'nullable',
                    'required_with:department_2',
                    'integer',
                    Rule::exists('departments', 'id')->where(fn ($q) => $q->where('affiliation_id', $this->auth->affiliation_id))
                ],
                'department_2' => [
                    'nullable',
                    'integer',
                    Rule::exists('departments', 'id')->where(fn ($q) => $q->where('parent_id', $this->department_1))
                ],
                'remarks' => 'nullable|string',
            ];
        } else {
            return [
                'name' => 'required|string',
                'email' => 'required|string|email|unique:users,email,' . auth()->id(),
                // 'image' => 'nullable|string' . (config('filesystem.default') === 's3' ? '|starts_with:' . $image_prefix : ''),
                'image' => config('filesystems.default') === 's3' ? 'nullable|string|starts_with:' . $image_prefix : 'nullable|file',
                'sex' => 'required|integer|in:1,2',
                'birthday' => ['required', 'date_format:Y-m-d'],
            ];
        }
    }

    protected function failedValidation(Validator $validator)
    {
        if (config('filesystems.default') === 's3' && isset($this->image)) {
            $s3_image_url = $this->auth->temporaryUrls()
                ->where('directory', 'profiles/')
                ->where('url', explode('?', $this->image)[0])
                ->first();

            if ($s3_image_url) {
                Storage::delete(str_replace(config('constants.prefixes.s3'), '', $s3_image_url->url));
                $s3_image_url->delete();
            }
        }

        parent::failedValidation($validator);
    }
}
