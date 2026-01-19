<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();

            // Replace emoji with image
            $table->string('image')->nullable(); // store image path or URL

            $table->string('gradient')
                ->nullable()
                ->default('from-emerald-500/20 to-cyan-500/20');

            $table->string('icon')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
