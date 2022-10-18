<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ListVideoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        // return parent::toArray($request);
        return [
            'id' => $this->id,
            'item_number' => $this->item_number,
            'title' => $this->title,
            'content' => $this->content,
            'video_file_path' => $this->video_file_path,
            'is_complete' => $this->viewingInformations[0]['is_complete'] ?? null,
            'playback_position' => $this->viewingInformations[0]['playback_position'] ?? null,
        ];
    }
}
