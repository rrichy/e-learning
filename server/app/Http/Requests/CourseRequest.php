<?php

namespace App\Http\Requests;

use App\Models\Course;
use App\Models\Question;
use App\Models\Test;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CourseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        // appending item_number to chapters based on their index
        $chapters = [];

        foreach ($this->chapters ?? [] as $index => $chapter) {
            // appending item_number to explainer_videos based on their index
            $explainer_videos = [];
            foreach ($chapter['explainer_videos'] ?? [] as $xindex => $xvideo) {
                $explainer_videos[] = [
                    'id' => $xvideo['id'] ?? null,
                    'item_number' => $xindex + 1,
                    'title' => $xvideo['title'],
                    'content' => $xvideo['content'],
                    'video_file_path' => $xvideo['video_file_path'] ?? "",
                ];
            }

            // appending item_number to chapter_test.questions based on their index
            $chapter_test = [];
            if ($chapter['chapter_test']) {
                $chapter_test = [
                    'passing_score' => $chapter['chapter_test']['passing_score'],
                    'title' => $chapter['chapter_test']['title'],
                    'overview' => $chapter['chapter_test']['overview'],
                ];

                $questions = [];
                if ($chapter['chapter_test']['questions']) {
                    foreach ($chapter['chapter_test']['questions'] as $qindex => $question) {
                        // appending item_number to chapter_test.questions.*.options.* based on their index
                        $options = [];
                        foreach($question['options'] ?? [] as $oindex => $option) {
                            $options[] = [
                                'id' => $option['id'],
                                'description' => $option['description'],
                                'correction_order' => $option['correction_order'],
                                'item_number' => $oindex + 1,
                            ];
                        }
                        
                        $questions[] = [
                            'id' => $question['id'] ?? null,
                            'item_number' => $qindex + 1,
                            'title' => $question['title'],
                            'statement' => $question['statement'],
                            'format' => $question['format'],
                            'score' => $question['score'],
                            'explanation' => $question['explanation'],
                            'options' => $options,
                        ];
                    }
                }
                $chapter_test['questions'] = $questions;
            } else $chapter_test = null;

            $chapters[] = [
                'id' => $chapter['id'] ?? null,
                'title' => $chapter['title'],
                'item_number' => $index + 1,
                'chapter_test' => $chapter_test,
                'explainer_videos' => $explainer_videos,
            ];
        }

        $this->merge([
            'start_period' => is_null($this->start_period) ? null : Carbon::parse($this->start_period)->toDateString(),
            'end_period' => is_null($this->end_period) ? null : Carbon::parse($this->end_period)->toDateString(),
            'chapters' => $chapters,
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        $image_prefix = config('constants.prefixes.s3') . ',' . config('constants.prefixes.picsum');

        $rules = [
            'status' => 'required|integer|in:' . join(',', Course::STATUS),
            'category_id' => 'required|integer|exists:categories,id',
            'image' => 'nullable|string|starts_with:' . $image_prefix,
            'title' => 'required|string',
            'content' => 'required|string',
            'study_time' => 'required|integer',
            'priority' => ['required', 'integer', Rule::unique('courses')->where(fn ($q) => $q->where('category_id', request()->category_id))->when(request()->id > 0, fn ($q) => $q->ignore(request()->id))],
            'is_whole_period' => 'required|boolean',
            'start_period' => 'nullable|date',
            'end_period' => 'nullable|date',
            'target' => 'required|integer',
            'chapters' => 'array',
            'chapters.*.id' => 'nullable|integer|distinct|exists:chapters,id',
            'chapters.*.title' => 'required|string',
            'chapters.*.item_number' => 'required|integer|distinct',
            'chapters.*.chapter_test' => 'nullable',
            'chapters.*.chapter_test.questions' => 'array',
            'chapters.*.chapter_test.questions.*.title' => 'required|string',
            'chapters.*.chapter_test.questions.*.statement' => 'required|string',
            'chapters.*.chapter_test.questions.*.format' => ['required', 'numeric', Rule::in(Question::FORMAT)],
            'chapters.*.chapter_test.questions.*.score' => 'required|numeric',
            'chapters.*.chapter_test.questions.*.explanation' => 'required|string',
            'chapters.*.chapter_test.questions.*.options' => 'array',
            'chapters.*.chapter_test.questions.*.options.*.description' => 'required|string',
            'chapters.*.explainer_videos.*.title' => 'required|string',
            'chapters.*.explainer_videos.*.content' => 'required|string',
            // 'chapters.*.explainer_videos.*.video_file_path' => 'required|string',
            // temporarily disable save filepath
            'chapters.*.explainer_videos.*.video_file_path' => 'nullable|string',
            // see below for nested indexed and distinct rules
        ];

        foreach ($this->chapters as $index => $chapter) {
            $rules['chapters.' . $index . '.chapter_test.passing_score'] = ['required_with:chapters.*.chapter_test', 'numeric', Rule::in(Test::PASSING_SCORES)];
            $rules['chapters.' . $index . '.chapter_test.title'] = 'required_with:chapters.*.chapter_test|string';
            $rules['chapters.' . $index . '.chapter_test.overview'] = 'required_with:chapters.*.chapter_test|string';
            $rules['chapters.' . $index . '.chapter_test.questions.*.id'] = 'nullable|integer|distinct|exists:questions,id';

            foreach ($chapter['chapter_test']['questions'] as $qindex => $question) {
                $rules['chapters.' . $index . '.chapter_test.questions.' . $qindex . '.item_number'] = 'required|integer|distinct';
                
                foreach($question['options'] as $oindex => $option) {
                    $rules['chapters.' . $index . '.chapter_test.questions.' . $qindex . '.options.' . $oindex . '.id'] = 'nullable|integer|distinct|exists:question_options,id';
                    $rules['chapters.' . $index . '.chapter_test.questions.' . $qindex . '.options.' . $oindex . '.correction_order'] = 'nullable|integer|distinct';
                    $rules['chapters.' . $index . '.chapter_test.questions.' . $qindex . '.options.' . $oindex . '.item_number'] = 'required|integer|distinct';
                }
            }

            foreach ($chapter['explainer_videos'] as $xindex => $xvideo) {
                $rules['chapters.' . $index . '.explainer_videos.' . $xindex . '.id'] = 'nullable|integer|distinct|exists:explainer_videos,id';
                $rules['chapters.' . $index . '.explainer_videos.' . $xindex . '.item_number'] = 'required|integer|distinct';
            }
        }

        return $rules;
    }
}
