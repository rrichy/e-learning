<?php

namespace Database\Seeders;

use App\Models\Inquiry;
use App\Models\MembershipType;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InquirySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user_ids = User::where('membership_type_id', '!=', MembershipType::ADMIN)->pluck('id');

        foreach ($user_ids as $user_id) {
            Inquiry::factory(rand(0, 5))->create(compact('user_id'));
        }
    }
}
