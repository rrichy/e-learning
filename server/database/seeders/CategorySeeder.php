<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $category_names = [
            'ネットワーク',
            'クラウド',
            'サーバー'
        ];

        $child_categories = [];
        foreach ($category_names as $index => $category_name) {
            $category = Category::create([
                'name' => $category_name,
                'priority' => $index + 1,
                'start_period' => now()->addDays(rand(4, 40)),
                'end_period' => now()->addDays(rand(90, 120)),
            ]);

            $child_data = Category::factory(rand(0, 2))->make([
                'parent_id' => $category->id,
            ]);
            
            foreach($child_data->toArray() as $index => $child_category) {
                $child_category['priority'] = $index + 1;
                // $child_category['start_period'] = substr($child_category['start_period'], 0, 10);
                // $child_category['end_period'] = substr($child_category['end_period'], 0, 10);
                $child_category['created_at'] = now();
                $child_category['updated_at'] = now();

                array_push($child_categories, $child_category);
            }
        }
        
        Category::insert($child_categories);
    }
}
