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
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('category_id')->constrained('categories')->cascadeOnDelete();
            $table->string('title');
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->string('location');
            $table->string('species')->nullable();
            $table->string('morph')->nullable();
            $table->string('age')->nullable();
            $table->enum('sex', ['male', 'female', 'unknown'])->default('unknown');
            $table->json('images')->nullable();
            $table->enum('status', ['active', 'sold', 'pending', 'draft'])->default('active');
            $table->boolean('is_negotiable')->default(false);
            $table->boolean('is_delivery_available')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
