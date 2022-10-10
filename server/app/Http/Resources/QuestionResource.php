<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class QuestionResource extends JsonResource
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
            'test_id' => $this->test_id,
            'item_number' => $this->item_number,
            'title' => $this->title,
            'statement' => $this->statement,
            'format' => $this->format,
            'score' => $this->score,
            'explaination' => $this->explaination,
            'options' => QuestionOptionResource::collection($this->whenLoaded('options')),
        ];
    }
}
