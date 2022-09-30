<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class NoticeIndexResource extends JsonResource
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
            'author' => $this->user->name,
            'subject' => $this->subject,
            'priority' => $this->priority,
            'publish_start' => $this->date_publish_start,
            'publish_end' => $this->date_publish_end,
            'shown_in_bulletin' => $this->shown_in_bulletin,
            'shown_in_mail' => $this->shown_in_mail,
        ];
    }
}
