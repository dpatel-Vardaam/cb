<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('listings', function (Blueprint $table) {
            // We add 'unique' because two listings cannot share the same URL
            // We add 'after' to position it nicely in your database tool
            $table->string('slug')->unique()->after('title')->nullable();
        });
    }

    public function down()
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->dropColumn('slug');
        });
    }
};
