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
        $structure = [
            'id' => $this->id,
            'title' => $this->title,
            'item_number' => $this->item_number,
            'chapter_test' => new TestResource($this->whenLoaded('chapterTest')),
            'explainer_videos' => ExplainerVideoResource::collection($this->whenLoaded('explainerVideos')),
            // 'comprehension_test' => new TestResource($this->whenLoaded('comprehensionTest')),
        ];

        if (auth()->user()->isIndividual()) {
            $results = $this->chapterTest->testResults()
                ->where('user_id', auth()->id())
                ->latest()->get();
            
            $structure['latest_score'] = $results[0]->score ?? null;
            $structure['has_passed'] = $results->contains('passed', 1);
        }

        return $structure;
    }
}
