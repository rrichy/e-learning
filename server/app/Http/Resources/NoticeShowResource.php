<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class NoticeShowResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $posting_method = [];

        if ($this->shown_in_bulletin) $posting_method[] = 1;
        if ($this->shown_in_mail) $posting_method[] = 2;
        
        return [
            'subject' => $this->subject,
            'content' => $this->content,
            'posting_method' => $posting_method,
            'shown_in_bulletin' => $this->shown_in_bulletin,
            'shown_in_mail' => $this->shown_in_mail,
            'date_publish_start' => $this->date_publish_start,
            'date_publish_end' => $this->date_publish_end,
            'signature_id' => $this->signature_id,
        ];
    }
}
