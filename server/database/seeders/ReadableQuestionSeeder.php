<?php

namespace Database\Seeders;

use App\Models\Question;
use App\Models\Test;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class ReadableQuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tests = Test::all();

        $sample_questions = collect(json_decode(File::get("database/json/sample_questions.json"), true));

        $tests->each(function ($test) use ($sample_questions) {
            $minTestTotal = floor($test->passing_score * 1.25);
            $currentTotal = 0;
            $item_number = 0;
            do {
                $json = $sample_questions->random();

                $question = Question::create([
                    'test_id' => $test->id,
                    'item_number' => ++$item_number,
                    'title' => fake()->text(10),
                    'statement' => $json['statement'],
                    'format' => $json['format'],
                    'score' => $json['score'],
                    'explanation' => $json['explanation'],
                ]);

                $question->options()->createMany(
                    collect($json['options'])->map(fn ($item, $index) => [
                        'item_number' => $index + 1,
                        'correction_order' => $item['correction_order'] ?? null,
                        'description' => $item['description'],
                    ])
                );

                $currentTotal += $question['score'];
            } while ($currentTotal < $minTestTotal);
        });
    }
}
