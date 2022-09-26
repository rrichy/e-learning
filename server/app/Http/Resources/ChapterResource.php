<?php

namespace App\Http\Resources;

use App\Models\ExplainerVideo;
use Illuminate\Http\Resources\Json\JsonResource;

class ChapterResource extends JsonResource
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
            'title' => $this->title,
            'item_number' => $this->item_number,
            'chapter_test' => new TestResource($this->whenLoaded('chapterTest')),
            'explainer_videos' => ExplainerVideoResource::collection($this->whenLoaded('explainerVideos')),
            // 'comprehension_test' => new TestResource($this->whenLoaded('comprehensionTest')),
        ];
    }
}
