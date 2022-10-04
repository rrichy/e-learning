<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CourseListItemResource extends JsonResource
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
            'title' => $this->title, 
            'is_whole_period' => $this->is_whole_period, 
            'start_period' => $this->start_period, 
            'end_period' => $this->end_period,
            'image' => $this->when(auth()->user()->isIndividual(), $this->image),
        ];
    }
}
