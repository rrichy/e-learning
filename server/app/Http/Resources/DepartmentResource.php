<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DepartmentResource extends JsonResource
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
            'affiliation_id' => $this->affiliation_id,
            'parent_id' => $this->parent_id,
            'name' => $this->name,
            'priority' => $this->priority,
            'child_departments' => DepartmentShowResource::collection($this->whenLoaded('childDepartments')),
        ];
    }
}
