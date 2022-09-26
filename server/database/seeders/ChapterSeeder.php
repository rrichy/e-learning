<?php

namespace Database\Seeders;

use App\Models\Chapter;
use App\Models\Course;
use Illuminate\Database\Seeder;

class ChapterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $courses = Course::all();
        $chapters = [];

        $courses->each(function ($course) use (&$chapters) {
            $chapters_count = rand(1, 5);
            for ($item_number = 1; $item_number <= $chapters_count; $item_number++) {
                $chapters[] = [
                    'course_id' => $course->id,
                    'item_number' => $item_number,
                    'title' => fake()->text(10),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        });

        Chapter::insert($chapters);
    }
}
