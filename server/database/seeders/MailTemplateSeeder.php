<?php

namespace Database\Seeders;

use App\Models\MailTemplate;
use App\Models\Signature;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MailTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $signatures = Signature::all();

        $templates = [];
        $signatures->each(function ($signature) use (&$templates) {
            $template_count = rand(0, 5);
            for ($priority = 1; $priority <= $template_count; $priority++) {
                $templates[] = [
                    'title' => fake()->text(10),
                    'content' => fake()->text(30),
                    'signature_id' => $signature->id,
                    'priority' => $priority,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        });

        MailTemplate::insert($templates);
    }
}
