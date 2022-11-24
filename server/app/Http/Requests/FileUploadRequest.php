<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FileUploadRequest extends FormRequest
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
            'type' => 'required|in:profile_image,course_image,chapter_video',
            'upload_id' => 'nullable',
            'part_number' => 'nullable',
            'parts' => 'nullable|array',
            'parts.*.ETag' => 'required|string',
            'parts.*.PartNumber' => 'required|numeric',
            'contentType' => 'required_with:parts|string',
            'filename' => 'required_with:part_number,parts',
        ];
    }
}
