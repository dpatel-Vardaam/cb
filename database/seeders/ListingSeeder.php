<?php

namespace Database\Seeders;

use App\Models\User;
use App\UserCategory;
use App\Models\Listing;
use App\Models\Species;
use Faker\Factory as Faker;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class ListingSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // 1. Get IDs of users who are Consumers
        // We pluck 'id' to get a simple array like ['uuid-1', 'uuid-2', ...]
        $consumerIds = User::where('role', UserCategory::CONSUMER->value)
                            ->pluck('id')
                            ->toArray();

        // Safety check: ensure we have consumers
        if (empty($consumerIds)) {
            $this->command->error("No Consumer users found. Please run the User seeder first.");
            return;
        }

        // 2. Get all Species
        $allSpecies = Species::all();

        if ($allSpecies->isEmpty()) {
            $this->command->error("No species found. Run SpeciesSeeder first!");
            return;
        }

        // 3. Loop through every species
        foreach ($allSpecies as $species) {
            
            // Create 3 listings per species
            for ($i = 1; $i <= 3; $i++) {
                
                $title = "{$species->title} - " . $faker->randomElement(['Morph', 'Breeder', 'Hatchling', 'Adult']) . " #$i";
                
                Listing::create([
                    // PICK RANDOM CONSUMER ID HERE
                    'user_id'       => $faker->randomElement($consumerIds),
                    
                    'category_id'   => $species->category_id,
                    'species_id'    => $species->id,
                    'title'         => $title,
                    'slug'          => Str::slug($title) . '-' . Str::random(6),
                    'description'   => $faker->paragraph(2),
                    'price'         => $faker->randomFloat(2, 50, 5000),
                    'state'         => $faker->state,
                    'city'          => $faker->city,
                    'morph'         => $faker->word,
                    'age'           => $faker->randomElement(['2 years', '6 months', '3 weeks', 'Adult']),
                    'sex'           => $faker->randomElement(['male', 'female', 'unknown']),
                    'images'        => [],
                    'status'        => 'active',
                    'is_negotiable' => $faker->boolean,
                    'is_delivery_available' => $faker->boolean,
                ]);
            }
        }
        
        $this->command->info("Listings seeded successfully assigned to random Consumers.");
    }
}