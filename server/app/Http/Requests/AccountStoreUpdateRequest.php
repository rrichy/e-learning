<?php

namespace App\Http\Requests;

use App\Models\MembershipType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;

class AccountStoreUpdateRequest extends FormRequest
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
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        $auth = auth()->user();

        $merge = request()->membership_type_id == MembershipType::TRIAL ? [
            'affiliation_id' => null,
            'department_1' => null,
            'department_2' => null,
        ] : [
            'affiliation_id' => request()->affiliation_id ?: null,
            'department_1' => request()->department_1 ?: null,
            'department_2' => request()->department_2 ?: null,
        ];
        
        if($auth->isCorporate()) {
            $merge['membership_type_id'] = MembershipType::INDIVIDUAL;
            $merge['affiliation_id'] = $auth->affiliation_id;
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
                Rule::exists('departments', 'id')->where(fn ($q) => $q->where('affiliation_id', request()->affiliation_id))
            ],
            'department_2' => [
                'nullable',
                'integer',
                Rule::exists('departments', 'id')->where(fn ($q) => $q->where('parent_id', request()->department_1))
            ],
            'remarks' => ['nullable', 'string'],
        ];

        if (request()->method() === 'POST') {
            $rules['password'] = ['required', 'confirmed', Rules\Password::defaults()];
            $rules['email'] = ['required', 'string', 'email', 'max:255', 'unique:users'];
        } else {
            $rules['email'] = ['required', 'string', 'email', 'max:255', 'unique:users,email,' . request()->id];
        }

        return $rules;
    }
}
