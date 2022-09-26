<?php

namespace App\Http\Resources;

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
        return [
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
    }
}
