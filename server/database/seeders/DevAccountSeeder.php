<?php

namespace Database\Seeders;

use App\Models\MembershipType;
use App\Models\User;
use Illuminate\Database\Seeder;

class DevAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Admin account
        User::factory()->create([
            'name' => 'Sample Admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('123'),
            'membership_type_id' => MembershipType::ADMIN,
        ]);

        // Corporate account
        User::factory()->create([
            'name' => 'Sample Corporate',
            'email' => 'corporate@gmail.com',
            'password' => bcrypt('123'),
            'membership_type_id' => MembershipType::CORPORATE,
        ]);

        // Individual account
        User::factory()->create([
            'name' => 'Sample Individual',
            'email' => 'individual@gmail.com',
            'password' => bcrypt('123'),
            'membership_type_id' => MembershipType::INDIVIDUAL,
        ]);

        // Trial account
        User::factory()->create([
            'name' => 'Sample Trial',
            'email' => 'trial@gmail.com',
            'password' => bcrypt('123'),
            'membership_type_id' => MembershipType::TRIAL,
        ]);
    }
}
