<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AttendingCourseIndexResource extends JsonResource
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
            'id' => $this->id,
            'title' => $this->title,
            'progress_rate' => $this->progress_rate,
            'highest_score' => $this->highest_score,
            'latest_score' => $this->latest_score,
            'start_date' => $this->start_date,
            'completion_date' => $this->completion_date,
            'status' => $this->status,
        ];
    }
}
