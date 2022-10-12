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
        // $department_users = [];
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
            'remarks' => fake()->text(50),
        ]);
        $this->pushDepartmentUser($affiliation, $corporate);

        // Individual account
        $affiliation = $affiliations->random();
        $individual = User::factory()->create([
            'name' => 'Sample Individual',
            'email' => 'individual@gmail.com',
            'password' => bcrypt('123'),
            'membership_type_id' => MembershipType::INDIVIDUAL,
            'affiliation_id' => $affiliation->id,
            'remarks' => fake()->text(50),
        ]);
        $this->pushDepartmentUser($affiliation, $individual);

        // Trial account
        User::factory()->create([
            'name' => 'Sample Trial',
            'email' => 'trial@gmail.com',
            'password' => bcrypt('123'),
            'membership_type_id' => MembershipType::TRIAL,
        ]);


        // Seed users
        $users = User::factory(10)->create();

        $users->each(function ($user) use (&$affiliations) {
            if (in_array($user->membership_type_id, [MembershipType::CORPORATE, MembershipType::INDIVIDUAL])) {
                $affiliation = $affiliations->random();
                $user->affiliation_id = $affiliation->id;
                $user->remarks = fake()->text(50);
                $user->save();

                $this->pushDepartmentUser($user->affiliation, $user);
            }
        });

        // DepartmentUser::insert($department_users);
    }

    private function pushDepartmentUser(mixed $affiliation, mixed $user)
    {
        if ($affiliation->departments->count()) {
            $parent_department = $affiliation->departments->random();
            $department_users = [];

            $department_users[$parent_department->id] = [
                'order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            if ($parent_department->childDepartments->count()) {
                $child_department = $parent_department->childDepartments->random();

                $department_users[$child_department->id] = [
                    'order' => 2,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            $user->departments()->sync($department_users);
        }
    }
}
