<?php

namespace App\Http\Resources;

use App\Models\Course;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseShowResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $default = [
            'id' => $this->id,
            'status' => $this->status,
            'category_id' => $this->category_id,
            'image' => $this->image,
            'title' => $this->title,
            'content' => $this->content,
            'study_time' => $this->study_time,
            'priority' => $this->priority,
            'is_whole_period' => $this->is_whole_period,
            'start_period' => $this->start_period,
            'end_period' => $this->end_period,
            'target' => $this->target,
            'chapters' => ChapterResource::collection($this->whenLoaded('chapters')),
        ];

        if (request()->input('tabulated') == true) {
            $category = $this->category;
            $this->loadCount(['attendingCourses as attendees', 'attendingCourses as current_attendees' => fn ($q) => $q->isActive()]);
            
            // used details page
            $default['attendees_information'] = [
                'category_start_period' => $category->start_period,
                'category_end_period' => $category->end_period,
                'status_parsed' => $this->status === Course::PRIVATE ? '非公開' : '公開',
                'target_parsed' => $this->target === Course::TARGET['everyone'] ? '全員' : ($this->target === Course::TARGET['group'] ? 'グループ' : '個別'),
                'attendees' => $this->attendees,
                'current_attendees' => $this->current_attendees,
            ];
        }

        return $default;
    }
}
