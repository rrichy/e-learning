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
        $priority = 0;
        $signatures->each(function ($signature) use (&$templates, &$priority) {
            $template_count = rand(0, 5);
            for ($p = 0; $p < $template_count; $p++) {
                $templates[] = [
                    'title' => fake()->text(10),
                    'content' => fake()->text(30),
                    'signature_id' => $signature->id,
                    'priority' => ++$priority,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        });

        MailTemplate::insert($templates);
    }
}
