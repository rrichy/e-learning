<?php

namespace Database\Seeders;

use App\Models\Chapter;
use App\Models\Test;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $chapters = Chapter::all();

        $tests = [];
        $chapters->each(function ($chapter) use (&$tests) {
            $tests[] = [
                'chapter_id' => $chapter->id,
                'test_type' => Test::TEST_TYPES['chapter'],
                'title' => fake()->text(5),
                'overview' => fake()->text(20),
                'passing_score' => Test::PASSING_SCORES[rand(0, 3)],
                'created_at' => now(),
                'updated_at' => now(),
            ];
            $tests[] = [
                'chapter_id' => $chapter->id,
                'test_type' => Test::TEST_TYPES['comprehension'],
                'title' => fake()->text(5),
                'overview' => fake()->text(20),
                'passing_score' => Test::PASSING_SCORES[rand(0, 3)],
                'created_at' => now(),
                'updated_at' => now(),
            ];
        });

        Test::insert($tests);
    }
}
