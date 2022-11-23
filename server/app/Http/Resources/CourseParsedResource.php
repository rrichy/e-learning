<?php

namespace App\Http\Resources;

use App\Models\Course;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseParsedResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'start_period' => $this->start_period,
            'end_period' => $this->end_period,
            'attendees_information' => [
            'category_start_period' => $this->category->start_period,
            'category_end_period' => $this->category->end_period,
            'status_parsed' => $this->status === Course::PRIVATE ? '非公開' : '公開',
            'target_parsed' => $this->target === Course::TARGET['everyone'] ? '全員' : ($this->target === Course::TARGET['group'] ? 'グループ' : '個別'),
            'attendees' => $this->attendees,
            'current_attendees' => $this->current_attendees,
            ]
        ];
    }
}
