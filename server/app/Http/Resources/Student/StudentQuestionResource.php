<?php

namespace App\Http\Resources\Student;

use Illuminate\Http\Resources\Json\JsonResource;

class StudentQuestionResource extends JsonResource
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
            'test_id' => $this->test_id,
            'item_number' => $this->item_number,
            'title' => $this->title,
            'statement' => $this->statement,
            'format' => $this->format,
            'score' => $this->score,
            'user_answer' => $this->userAnswers()->where('user_id', auth()->id())->first()?->answer,
            // 'explaination' => $this->explaination,
            'options' => StudentQuestionOptionResource::collection($this->whenLoaded('options')),
        ];
    }
}
