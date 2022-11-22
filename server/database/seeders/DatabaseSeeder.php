<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            AffiliationSeeder::class,
            DevAccountSeeder::class,
            CategorySeeder::class,
            SignatureSeeder::class,
            MailTemplateSeeder::class,
            CourseSeeder::class,
            ChapterSeeder::class,
            TestSeeder::class,
            ExplainerVideoSeeder::class,
            // Switch between ReadableQuestionSeeder and (QuestionSeeder + QuestionOptionSeeder)
            ReadableQuestionSeeder::class,
            // QuestionSeeder::class,
            // QuestionOptionSeeder::class,
            NoticeSeeder::class,
            AttendingCourseSeeder::class,
            InquirySeeder::class,
            // UserAnswerSeeder::class,
        ]);
    }
}
