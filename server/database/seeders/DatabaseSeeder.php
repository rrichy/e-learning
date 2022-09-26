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
            DevAccountSeeder::class,
            AffiliationSeeder::class,
            CategorySeeder::class,
            SignatureSeeder::class,
            CourseSeeder::class,
            ChapterSeeder::class,
            TestSeeder::class,
            ExplainerVideoSeeder::class,
            QuestionSeeder::class,
            QuestionOptionSeeder::class,
        ]);

        \App\Models\User::factory(10)->create();
    }
}
