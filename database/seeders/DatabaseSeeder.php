<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use App\UserCategory;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Listing;
use Illuminate\Database\Seeder;
use Database\Seeders\ListingSeeder;
use Database\Seeders\SpeciesSeeder;
use Database\Seeders\CategorySeeder;
use Illuminate\Support\Facades\Artisan;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Team Vardaam',
            'email' => 'team@vardaam.com',
            'password' => bcrypt('Vardaam@123'),
            'role' => UserCategory::ADMIN->value,
        ]);
        User::factory()->create([
            'name'=> 'DIkshant',
            'email'=> 'dikshant@vardaam.com',
            'password' => bcrypt('Vardaam@123'),
            'role' => UserCategory::CONSUMER->value,
        ]);

        User::factory()->count(5)->create([
            'password' => bcrypt('password'), // default password
            'role' => UserCategory::CONSUMER->value,
        ]);

        $this->call([
            CategorySeeder::class,
            SpeciesSeeder::class,
            ListingSeeder::class,
        ]);

        if (app()->environment(['local', 'testing'])) {
            $this->command->info('Flushing and importing Scout index...');
            
            // Clear old index data
            Artisan::call('scout:flush', ['model' => Listing::class]);
            
            // Import new data
            Artisan::call('scout:import', ['model' => Listing::class]);
            // Clear old index data
            Artisan::call('scout:flush', ['model' => Category::class]);
            
            // Import new data
            Artisan::call('scout:import', ['model' => Category::class]);
            
            $this->command->info('Scout index refreshed!');
        }
    }
}
