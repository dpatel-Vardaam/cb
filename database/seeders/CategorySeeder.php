<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // 1. Clean up old category images so we don't duplicate files
        Storage::disk('public')->deleteDirectory('categories');
        Storage::disk('public')->makeDirectory('categories');

        $categories = [
            [
                'title' => 'Snakes',
                'slug' => 'snakes',
                'description' => 'Morphs, pairs, proven breeders',
                'sort_order' => 1,
            ],
            [
                'title' => 'Spiders',
                'slug' => 'spiders',
                'description' => 'Pets, projects, hatchlings',
                'sort_order' => 2,
            ],
            [
                'title' => 'Lizards',
                'slug' => 'lizards',
                'description' => 'Localities, morph combos, adults',
                'sort_order' => 3,
            ],
            [
                'title' => 'Scorpians',
                'slug' => 'scorpians',
                'description' => 'Localities, morph combos, adults',
                'sort_order' => 4,
            ]
        ];

        foreach ($categories as $data) {
            
            // --- IMAGE LOGIC START ---
            $imagePath = null;
            
            // Look for database/seeders/images/snakes.jpg
            // Define allowed extensions
            $extensions = ['jpg', 'jpeg', 'png'];
            $imagePath = null;

            foreach ($extensions as $ext) {
                // Check if file exists with this extension (e.g. snakes.png)
                $sourcePath = database_path("seeders/images/{$data['slug']}.{$ext}");

                if (File::exists($sourcePath)) {
                    // Save to: categories/snakes.png (maintain original extension)
                    $destinationPath = "categories/{$data['slug']}.{$ext}";
                    
                    Storage::disk('public')->put(
                        $destinationPath, 
                        File::get($sourcePath)
                    );
                    
                    $imagePath = $destinationPath;
                    break; // Stop looking once we found a match
                }
            }
            // --- IMAGE LOGIC END ---

            Category::firstOrCreate(
                ['slug' => $data['slug']], // Check by slug
                [
                    'title'       => $data['title'],
                    'description' => $data['description'],
                    'image'       => $imagePath, // Save the path here
                    'sort_order'  => $data['sort_order'],
                    'is_active'   => true,
                ]
            );
        }
        
        $this->command->info('Categories seeded with static images.');
    }
}