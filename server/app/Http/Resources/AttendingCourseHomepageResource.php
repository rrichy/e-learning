<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AttendingCourseHomepageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        // return parent::toArray($request);
        return [
            'progress_rate' => $this->progress_rate,
            'completion_date' => $this->completion_date,
            'start_date' => $this->start_date,
            'status' => $this->status,
            'latest_score' => $this->latest_score,
            'highest_score' => $this->highest_score,
            'course_id' => $this->course_id,
        ];
    }
}
