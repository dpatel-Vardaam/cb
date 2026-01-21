<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Listing;
use App\Models\Species;
use App\UserCategory; 
use Faker\Factory as Faker;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Arr;

class ListingSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // 1. Clean Slate: Wipe old listing images
        Storage::disk('public')->deleteDirectory('listings');
        Storage::disk('public')->makeDirectory('listings');

        // 2. Setup Data
        $consumerIds = User::where('role', UserCategory::CONSUMER->value)->pluck('id')->toArray();
        $allSpecies = Species::with('category')->get();

        if (empty($consumerIds) || $allSpecies->isEmpty()) {
            $this->command->error("Missing Users or Species.");
            return;
        }

        foreach ($allSpecies as $species) {
            // Create 3 listings per species
            for ($i = 1; $i <= 3; $i++) {
                
                $title = "{$species->title} - " . $faker->randomElement(['Morph', 'Breeder', 'Hatchling', 'Adult']);
                $slug = Str::slug($title) . '-' . Str::random(6);

                // --- SMART IMAGE LOGIC ---
                $imageNames = []; // Changed variable name to reflect it holds names, not paths
                $categorySlug = $species->category->slug;
                
                $sourceDir = database_path("seeders/images/{$categorySlug}");

                if (File::isDirectory($sourceDir)) {
                    $files = File::files($sourceDir);
                    
                    if (!empty($files)) {
                        $randomFiles = Arr::random($files, min(count($files), rand(1, 2)));
                        
                        if (!is_array($randomFiles)) {
                            $randomFiles = [$randomFiles];
                        }

                        foreach ($randomFiles as $file) {
                            // 1. Generate clean random filename
                            $extension = $file->getExtension();
                            $newFilename = Str::random(10) . ".{$extension}";

                            // 2. Define physical path for storage
                            $destinationPath = "listings/{$slug}/{$newFilename}";

                            // 3. Store the file physically
                            Storage::disk('public')->put(
                                $destinationPath,
                                File::get($file)
                            );

                            // 4. Save ONLY the filename to the array
                            $imageNames[] = $newFilename; 
                        }
                    }
                }

                Listing::create([
                    'user_id'       => $faker->randomElement($consumerIds),
                    'category_id'   => $species->category_id,
                    'species_id'    => $species->id,
                    'title'         => $title,
                    'slug'          => $slug,
                    'description'   => $faker->paragraph(2),
                    'price'         => $faker->randomFloat(2, 50, 5000),
                    'state'         => $faker->state,
                    'city'          => $faker->city,
                    'morph'         => $faker->word,
                    'age'           => $faker->randomElement(['2 years', '6 months', '3 weeks', 'Adult']),
                    'sex'           => $faker->randomElement(['male', 'female', 'unknown']),
                    
                    'images'        => $imageNames, // Stores: ["abc12345.jpg", "xyz9876.jpg"]
                    
                    'status'        => 'active',
                    'is_negotiable' => $faker->boolean,
                    'is_delivery_available' => $faker->boolean,
                ]);
            }
        }
        
        $this->command->info("Listings seeded. DB contains filenames only.");
    }
}