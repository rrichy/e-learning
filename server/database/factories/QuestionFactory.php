<?php

namespace Database\Factories;

use App\Models\Question;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Question>
 */
class QuestionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            // 'test_id',
            // 'item_number',
            'title' => fake()->text(10),
            'statement' => fake()->text(20),
            'format' => Question::FORMAT[array_rand(Question::FORMAT, 1)],
            'score' => rand(5, 20),
            'explaination' => fake()->text(50),
        ];
    }
}
