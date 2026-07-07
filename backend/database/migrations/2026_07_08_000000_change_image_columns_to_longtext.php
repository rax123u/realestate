<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->longText('primary_image')->nullable()->change();
        });

        Schema::table('property_images', function (Blueprint $table) {
            $table->longText('url')->change();
        });
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->string('primary_image')->nullable()->change();
        });

        Schema::table('property_images', function (Blueprint $table) {
            $table->string('url')->change();
        });
    }
};
