<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $states = require database_path('data/state.php');

        foreach ($states as $code => $name) {
            DB::table('listings')
                ->where('state', $code)
                ->update(['state' => $name]);
        }
    }

    public function down(): void
    {
        $states = require database_path('data/state.php');

        foreach ($states as $code => $name) {
            DB::table('listings')
                ->where('state', $name)
                ->update(['state' => $code]);
        }
    }
};
