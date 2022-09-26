<?php

namespace Database\Factories;

use App\Models\Course;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Course>
 */
class CourseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'status' => Course::STATUS[array_rand(Course::STATUS, 1)],
            // 'category_id', pick from categories
            'image' => 'https://picsum.photos/id/'. rand(1, 1000) .'/200/300',
            'title' => fake()->text(20),
            'content' => fake()->text(60),
            'study_time' => rand(1, 12),
            // 'priority' => , should be unique under the same category_id; input manually
            'is_whole_period' => rand(0, 1),
            'start_period' => null, // set value when is_whole_period === 0
            'end_period' => null, // set value when is_whole_period === 0
            'target' => Course::TARGET[array_rand(Course::TARGET, 1)],
        ];
    }
}
