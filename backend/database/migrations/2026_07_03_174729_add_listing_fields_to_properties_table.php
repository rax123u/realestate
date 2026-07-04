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
    Schema::table('properties', function (Blueprint $table) {

        $table->string('city')->after('location');

        $table->enum('listing_type', [
            'sale',
            'rent'
        ])->default('sale');

        $table->enum('property_type', [
            'house',
            'apartment',
            'villa',
            'commercial',
            'land'
        ])->default('house');

        $table->enum('status', [
            'active',
            'sold',
            'rented',
            'expired'
        ])->default('active');

    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            //
        });
    }
};
