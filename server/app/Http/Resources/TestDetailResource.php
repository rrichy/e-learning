<?php

namespace App\Http\Resources;

use App\Models\Test;
use Illuminate\Http\Resources\Json\JsonResource;

class TestDetailResource extends JsonResource
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
        $test_type = intval(request('test_type')) === Test::CHAPTER ? 'chapterTest' : 'comprehensionTest';
        
        $chapter_title = $this->item_number . "章 " . ($test_type === 'chapterTest' ? "章末テスト" : "理解度テスト");

        return [
            'chapter_title' => $chapter_title,
            'image' => $this->course->image,
            'title' => $this[$test_type]->title,
            'passing_score' => $this[$test_type]->passing_score,
            'overview' => $this[$test_type]->overview,
            'questions_count' => $this[$test_type]->questions_count,
            'questions_sum_score' => intval($this[$test_type]->questions_sum_score),
        ];
    }
}
