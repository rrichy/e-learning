<?php

namespace Database\Seeders;

use App\Models\Affiliation;
use App\Models\DepartmentUser;
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
        $affiliations = Affiliation::with('departments')->get();
        $department_users = [];
        // Admin account
        User::factory()->create([
            'name' => 'Sample Admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('123'),
            'membership_type_id' => MembershipType::ADMIN,
        ]);

        // Corporate account
        $affiliation = $affiliations->random();
        $corporate = User::factory()->create([
            'name' => 'Sample Corporate',
            'email' => 'corporate@gmail.com',
            'password' => bcrypt('123'),
            'membership_type_id' => MembershipType::CORPORATE,
            'affiliation_id' => $affiliation->id,
        ]);
        $this->pushDepartmentUser($department_users, $affiliation, $corporate);

        // Individual account
        $affiliation = $affiliations->random();
        $individual = User::factory()->create([
            'name' => 'Sample Individual',
            'email' => 'individual@gmail.com',
            'password' => bcrypt('123'),
            'membership_type_id' => MembershipType::INDIVIDUAL,
            'affiliation_id' => $affiliation->id,
        ]);
        $this->pushDepartmentUser($department_users, $affiliation, $individual);

        // Trial account
        User::factory()->create([
            'name' => 'Sample Trial',
            'email' => 'trial@gmail.com',
            'password' => bcrypt('123'),
            'membership_type_id' => MembershipType::TRIAL,
        ]);


        // Seed users
        $users = User::factory(10)->create();

        $users->each(function ($user) use (&$department_users, $affiliations) {
            if (in_array($user->membership_type_id, [MembershipType::CORPORATE, MembershipType::INDIVIDUAL])) {
                $affiliation = $affiliations->random();
                $user->affiliation_id = $affiliation->id;
                $user->save();

                $this->pushDepartmentUser($department_users, $user->affiliation, $user);
            }
        });

        DepartmentUser::insert($department_users);
    }

    private function pushDepartmentUser(array &$department_users, mixed $affiliation, mixed $user)
    {
        $count = 0;
        $affiliation->departments->each(function ($dept) use ($user, &$count, &$department_users) {
            if ($count >= 2) return false;

            $department_users[] = [
                'department_id' => $dept->id,
                'user_id' => $user->id,
                'order' => ++$count,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        });
    }
}
