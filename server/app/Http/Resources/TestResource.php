<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TestResource extends JsonResource
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
            'chapter_id' => $this->chapter_id,
            'test_type' => $this->test_type,
            'title' => $this->title,
            'overview' => $this->overview,
            'passing_score' => $this->passing_score,
            'questions' => QuestionResource::collection($this->whenLoaded('questions'))
        ];
    }
}
