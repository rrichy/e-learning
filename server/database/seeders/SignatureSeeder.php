<?php

namespace Database\Seeders;

use App\Models\Signature;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SignatureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $priority = 0;
        $signatures = array_map(function ($signature) use (&$priority) {
            $signature['priority'] = ++$priority;
            $signature['created_at'] = now();
            $signature['updated_at'] = now();

            return $signature;
        }, Signature::factory(rand(4, 12))->make()->toArray());

        Signature::insert($signatures);
    }
}
