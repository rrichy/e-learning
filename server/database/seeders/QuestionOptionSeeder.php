<?php

namespace Database\Seeders;

use App\Models\Question;
use App\Models\QuestionOption;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QuestionOptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $questions = Question::all();

        $options = [];
        $questions->each(function ($question) use (&$options) {
            $options_count = rand(3, 5);

            $raw_options = [];
            for ($item_number = 1; $item_number <= $options_count; $item_number++) {
                $raw_options[] = [
                    'question_id' => $question->id,
                    'correction_order' => null,
                    'item_number' => $item_number,
                    'description' => fake()->text(10),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            if ($question->format === Question::FORMAT['radio']) {
                $raw_options[rand(0, $options_count - 1)]['correction_order'] = 1;
            } elseif ($question->format === Question::FORMAT['pulldown']) {
                $correct_indexes = array_rand($raw_options, rand(1, $options_count - 1));

                if (is_array($correct_indexes)) {
                    foreach ($correct_indexes as $index => $cindex) {
                        $raw_options[$cindex]['correction_order'] = $index + 1;
                    }
                } else $raw_options[$correct_indexes]['correction_order'] = 1;
            } else {
                $order = 0;
                $raw_options = array_map(function ($o) use (&$order) {
                    $o['correction_order'] = ++$order;
                    return $o;
                }, $raw_options);
            }

            $options = array_merge($options, $raw_options);
        });

        QuestionOption::insert($options);
    }
}
