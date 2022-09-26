<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CourseIndexResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $category = [[
            'category_id' => $this->id,
            'category_priority' => $this->priority,
            'category_name' => $this->name,
            'course_title' => null,
            'course_priority' => null,
            'course_status' => null,
            'course_id' => null,
            'course_size' => null,
        ]];

        foreach ($this->courses as $course) {
            $category[] = [
                'category_id' => $course->category_id,
                'category_priority' => null,
                'category_name' => null,
                'course_title' => $course->title,
                'course_priority' => $course->priority,
                'course_status' => $course->status,
                'course_id' => $course->id,
                'course_size' => null,
            ];
        }

        return $category;
    }
}
