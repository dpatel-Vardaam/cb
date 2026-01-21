<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Species;

class SpeciesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Define Species grouped by their Category Slug
        // This ensures we put the correct species in the correct category
        $speciesGroups = [
            'snakes' => [
                'Ball Python',
                'Corn Snake',
                'Boa Constrictor',
                'Hognose',
                'King Snake',
                'Reticulated Python'
            ],
            'spiders' => [
                'Jumping Spider',
                'Tarantula',
                'Wolf Spider',
                'Orb Weaver',
                'Black Widow'
            ],
            'lizards' => [
                'Bearded Dragon',
                'Leopard Gecko',
                'Crested Gecko',
                'Monitor Lizard',
                'Iguana',
                'Chameleon'
            ],
            'scorpians' => [ // Matching the slug from your Category list
                'Emperor Scorpion',
                'Desert Hairy Scorpion',
                'Bark Scorpion',
                'Asian Forest Scorpion'
            ],
        ];

        // 2. Loop through each group
        foreach ($speciesGroups as $slug => $speciesList) {
            
            // 3. GET THE CORRECT UUID: Find the Category ID by its slug
            $category = Category::where('slug', $slug)->first();

            // Safety check: if the category doesn't exist, skip to prevent errors
            if (!$category) {
                $this->command->error("Skipping: Category with slug '$slug' not found. (Did you run CategorySeeder?)");
                continue;
            }

            $this->command->info("Seeding species for: " . $category->title);

            // 4. Create each species using the fetched category_id
            foreach ($speciesList as $title) {
                Species::firstOrCreate(
                    [
                        'title' => $title, 
                        'category_id' => $category->id // <--- This ensures the link is correct
                    ], 
                    [] // extra attributes if needed
                );
            }
        }
    }
}