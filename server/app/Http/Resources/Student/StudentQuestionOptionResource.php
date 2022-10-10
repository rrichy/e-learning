<?php

namespace App\Http\Resources\Student;

use Illuminate\Http\Resources\Json\JsonResource;

class StudentQuestionOptionResource extends JsonResource
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
            // 'question_id' => $this->question_id,
            'id' => $this->id,
            // 'correction_order' => $this->correction_order,
            'item_number' => $this->item_number,
            'description' => $this->description,
        ];
    }
}
