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
            'affiliation_id' => $this->affiliation->id ?? null,
            'department_1' => $this->departments[0]->id ?? null,
            'department_2' => $this->departments[1]->id ?? null,
            'affiliation_id_parsed' => $this->affiliation->name ?? null,
            'department_1_parsed' => $this->departments[0]->name ?? null,
            'department_2_parsed' => $this->departments[1]->name ?? null,
            'remarks' => $this->remarks,
        ];
    }
}
