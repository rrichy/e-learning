<?php

namespace Database\Seeders;

use App\Models\MailTemplate;
use App\Models\MembershipType;
use App\Models\Signature;
use App\Models\User;
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
        $authors = User::where('membership_type_id', '>=', MembershipType::CORPORATE)->get();

        $templates = [];
        $priority = 0;
        $signatures->each(function ($signature) use (&$templates, &$priority, $authors) {
            $template_count = rand(0, 5);
            for ($p = 0; $p < $template_count; $p++) {
                $templates[] = [
                    'title' => fake()->text(10),
                    'content' => fake()->text(30),
                    'signature_id' => $signature->id,
                    'priority' => ++$priority,
                    'created_at' => now(),
                    'updated_at' => now(),
                    'affiliation_id' => $authors->random()->affiliation_id,
                ];
            }
        });

        MailTemplate::insert($templates);
    }
}
