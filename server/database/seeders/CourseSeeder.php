<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Course;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categories = Category::all();
        $courses = [];

        $categories->each(function ($category) use (&$courses) {
            foreach (Course::factory(rand(0, 3))->make(['category_id' => $category->id])->toArray() as $index => $course) {
                if($course['is_whole_period'] === 0) {
                    $course['start_period'] = now()->addDays(rand(15, 90));
                    $course['end_period'] = now()->addDays(rand(120, 270));
                }
                
                $course['priority'] = $index + 1;
                $course['created_at'] = now();
                $course['updated_at'] = now();

                array_push($courses, $course);
            }
        });

        Course::insert($courses);
    }
}
