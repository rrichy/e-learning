<?php

namespace Database\Seeders;

use App\Models\Question;
use App\Models\Test;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tests = Test::all();

        $questions = [];
        $tests->each(function ($test) use (&$questions) {
            $minTestTotal = floor($test->passing_score * 1.25);
            $currentTotal = 0;
            $item_number = 0;
            do {
                $question = Question::factory()->make([
                    'test_id' => $test->id,
                    'item_number' => ++$item_number
                ])->toArray();
                $currentTotal += $question['score'];
                $questions[] = array_merge($question, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } while ($currentTotal < $minTestTotal);
        });

        Question::insert($questions);
    }
}
