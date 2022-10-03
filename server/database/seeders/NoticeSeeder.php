<?php

namespace Database\Seeders;

use App\Models\MembershipType;
use App\Models\Notice;
use App\Models\Signature;
use App\Models\User;
use Illuminate\Database\Seeder;

class NoticeSeeder extends Seeder
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

        $notices = [];
        $priority = 0;
        $signatures->each(function ($signature) use ($authors, &$notices, &$priority) {
            $notice_type = rand(0, 2);

            if(fake()->boolean(80)) {
                $author = $authors->random();
                $notices[] = [
                    'user_id' => $author->id,
                    'subject' => fake()->text(10),
                    'content' => fake()->text(40),
                    'priority' => ++$priority,
                    'shown_in_bulletin' => $notice_type === 0 || $notice_type === 2,
                    'shown_in_mail' => $notice_type >= 1,
                    'date_publish_start' => now()->addDays(rand(15, 90)),
                    'date_publish_end' => now()->addDays(rand(120, 270)),
                    'signature_id' => $signature->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                    'affiliation_id' => $author->affiliation_id,
                ];
            }
        });

        Notice::insert($notices);
    }
}
