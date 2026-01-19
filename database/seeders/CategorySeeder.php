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
                'gradient' => 'from-amber-500/20 to-orange-500/20',
                'icon' => null,
                'image' => null,
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Corn Snakes',
                'slug' => 'corn-snakes',
                'description' => 'Pets, projects, hatchlings',
                'gradient' => 'from-red-500/20 to-rose-500/20',
                'icon' => null,
                'image' => null,
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'Boas',
                'slug' => 'boas',
                'description' => 'Localities, morph combos, adults',
                'gradient' => 'from-purple-500/20 to-violet-500/20',
                'icon' => null,
                'image' => null,
                'sort_order' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}
