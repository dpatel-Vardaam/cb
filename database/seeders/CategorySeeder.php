<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'title' => 'Ball Pythons',
                'slug' => 'ball-pythons',
                'description' => 'Morphs, pairs, proven breeders',
                
                'image' => null,
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Corn Snakes',
                'slug' => 'corn-snakes',
                'description' => 'Pets, projects, hatchlings',
                
                'image' => null,
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'Boas',
                'slug' => 'boas',
                'description' => 'Localities, morph combos, adults',
                
                'image' => null,
                'sort_order' => 3,
                'is_active' => true,
            ],
        ];

        Category::withoutSyncingToSearch(function () use ($categories) {
            foreach ($categories as $category) {
                Category::updateOrCreate(
                    ['slug' => $category['slug']],
                    $category
                );
            }
        });
    }
}
