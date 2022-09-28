<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AccountIndexResource extends JsonResource
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
            'email' => $this->email,
            'name' => $this->name,
            'affiliation_id' => $this->affiliation_id,
            'department_1' => $this->parentDepartment?->id,
            'department_2' => $this->childDepartment?->id,
            'created_at' => $this->created_at,
            'last_login_date' => $this->last_login_date,
        ];
    }
}
