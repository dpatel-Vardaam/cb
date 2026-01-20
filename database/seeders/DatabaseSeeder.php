<?php

namespace Database\Seeders;

use App\Models\User;
use App\UserCategory;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

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

        $this->call([
            CategorySeeder::class,
        ]);
    }
}
