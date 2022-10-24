<?php

namespace Database\Seeders;

use App\Models\AttendingCourse;
use App\Models\Course;
use App\Models\MembershipType;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AttendingCourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $students = User::whoAreIndividual()->get();
        $public_courses = Course::isPublic()->get();
        $course_count = $public_courses->count();

        $attending_courses = [];
        $students->each(function ($student) use ($public_courses, &$attending_courses, $course_count) {
            $courses_attending = $public_courses->random(rand(floor($course_count * .8), $course_count));

            $courses_attending->each(function ($course) use ($student, &$attending_courses) {
                $attending_courses[] = [
                    'user_id' => $student->id,
                    'course_id' => $course->id,
                    'status' => fake()->boolean(80) ? AttendingCourse::ATTENDING : AttendingCourse::COMPLETE,
                    // inaccurate seeders;
                    // progress_rate, highest_score, latest_score, start_date, and completion_date are dependent on
                    // students tests. 
                    // TO BE UPDATED WHEN user_answers TABLE HAS BEEN CREATED
                    'progress_rate' => 0,
                    'highest_score' => 0,
                    'latest_score' => 0,
                    'start_date' => now(),
                    'completion_date' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            });
        });

        AttendingCourse::insert($attending_courses);
    }
}
