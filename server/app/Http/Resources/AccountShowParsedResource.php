<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AccountShowParsedResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $departments = $this->departments->map(fn ($d) => [ 'id' => $d['id'], 'name' => $d['name'] ]);

        return [
            'id' => $this->id,
            'name' => $this->name,
            'image' => $this->image,
            'email' => $this->email,
            'sex' => $this->sex,
            'birthday' => $this->birthday,
            'membership_type_id' => $this->membership_type_id,
            'affiliation_id_parsed' => $this->affiliation->name ?? null,
            'department_1_parsed' => $departments[0]['name'] ?? null,
            'department_2_parsed' => $departments[1]['name'] ?? null,
            'remarks' => $this->remarks,
        ];
    }
}
