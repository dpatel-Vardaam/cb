<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->dropColumn('species');
            $table->foreignUuid('species_id')
                  ->nullable() // Optional: Use this if you have existing listings
                  ->constrained('species')
                  ->onDelete('cascade')
                  ->after('category_id');
        });
    }

    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->dropForeign(['species_id']);
            $table->dropColumn('species_id');
            $table->string('species')->nullable();
        });
    }
};
