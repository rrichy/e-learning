<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
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
            'parent_id' => $this->parent_id,
            'name' => $this->name,
            'priority' => $this->priority,
            'start_period' => $this->start_period,
            'end_period' => $this->end_period,
            'child_categories' => CategoryShowResource::collection($this->whenLoaded('childCategories')),
        ];
    }
}
