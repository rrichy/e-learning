<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AttendeeResource extends JsonResource
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
            'name'=> $this->user->name,
            'email'=> $this->user->email,
            'start_date'=> $this->start_date,
            'progress_rate'=> $this->progress_rate,
            'highest_score'=> $this->highest_score,
            'latest_score'=> $this->latest_score,
            'completion_date'=> $this->completion_date,
        ];
    }
}
