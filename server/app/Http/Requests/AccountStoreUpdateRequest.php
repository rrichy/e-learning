<?php

namespace App\Http\Requests;

use App\Models\MembershipType;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;

class AccountStoreUpdateRequest extends FormRequest
{
    public $auth;

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
    
    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        $merge = $this->membership_type_id == MembershipType::TRIAL ? [
            'affiliation_id' => null,
            'department_1' => null,
            'department_2' => null,
        ] : [
            'affiliation_id' => $this->affiliation_id ?: null,
            'department_1' => $this->department_1 ?: null,
            'department_2' => $this->department_2 ?: null,
        ];
        
        if($this->auth->isCorporate()) {
            $merge['membership_type_id'] = MembershipType::INDIVIDUAL;
            $merge['affiliation_id'] = $this->auth->affiliation_id;
        }

        $this->merge($merge);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        $image_prefix = config('constants.prefixes.s3') . ',' . config('constants.prefixes.picsum');
        
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'string', 'max:255', 'starts_with:' . $image_prefix],
            'sex' => ['required', 'integer', 'in:1,2'],
            'birthday' => ['required', 'date_format:Y-m-d', 'before:today'],
            'membership_type_id' => ['required', 'integer', Rule::in(MembershipType::TYPES)],
            'affiliation_id' => ['nullable', 'required_if:membership_type_id,' . MembershipType::CORPORATE, 'required_with:department_1,department_2', 'integer', 'exists:affiliations,id'],
            'department_1' => [
                'nullable',
                'required_with:department_2',
                'integer',
                Rule::exists('departments', 'id')->where(fn ($q) => $q->where('affiliation_id', $this->affiliation_id))
            ],
            'department_2' => [
                'nullable',
                'integer',
                Rule::exists('departments', 'id')->where(fn ($q) => $q->where('parent_id', $this->department_1))
            ],
            'remarks' => ['nullable', 'string'],
        ];

        if (request()->method() === 'POST') {
            $rules['password'] = ['required', 'confirmed', Rules\Password::defaults()];
            $rules['email'] = ['required', 'string', 'email', 'max:255', 'unique:users'];
        } else {
            $rules['email'] = ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $this->id];
        }

        return $rules;
    }

    protected function failedValidation(Validator $validator)
    {
        if (isset($this->image)) {
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
