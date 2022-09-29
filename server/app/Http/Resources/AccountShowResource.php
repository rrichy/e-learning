<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AccountShowResource extends JsonResource
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
            'name' => $this->name,
            'image' => $this->image,
            'email' => $this->email,
            'sex' => $this->sex,
            'birthday' => $this->birthday,
            'membership_type_id' => $this->membership_type_id,
            'affiliation_id' => $this->affiliation_id,
            'departments' => $this->departments->map(fn ($d) => $d['id']),
            'remarks' => $this->remarks,
        ];
    }
}
