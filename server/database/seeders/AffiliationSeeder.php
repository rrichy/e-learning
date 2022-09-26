<?php

namespace Database\Seeders;

use App\Models\Affiliation;
use App\Models\Department;
use Illuminate\Database\Seeder;

class AffiliationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create affiliations and pick random affilitions that will have departments
        $affiliations = [];
        foreach (Affiliation::factory(30)->make()->toArray() as $index => $affiliation) {
            $affiliation['priority'] = $index + 1;
            $affiliation['created_at'] = now();
            $affiliation['updated_at'] = now();

            array_push($affiliations, $affiliation);
        }

        Affiliation::insert($affiliations);

        $departments = [];
        Affiliation::all()->random(rand(15, 20))->each(function ($affiliation) use (&$departments) {
            $parent_departments = Department::factory(rand(1, 5))->make(['affiliation_id' => $affiliation->id])->toArray();

            foreach($parent_departments as $index => $department) {
                $department['priority'] = $index + 1;
                $department['created_at'] = now();
                $department['updated_at'] = now();

                array_push($departments, $department);
            }
        });

        Department::insert($departments);

        // Pick random parent departments that will have child departments
        $departments = [];
        Department::whereNull('parent_id')->get()->random(15)->each(function ($parent) use (&$departments) {
            $child_departments = Department::factory(rand(1, 5))->make([
                    'affiliation_id' => $parent->affiliation_id,
                    'parent_id' => $parent->id,
                ])->toArray();

            foreach($child_departments as $index => $department) {
                $department['priority'] = $index + 1;
                $department['created_at'] = now();
                $department['updated_at'] = now();

                array_push($departments, $department);
            }
        });

        Department::insert($departments);
    }
}
