<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@aurelius.com',
            'password' => 'password',
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Demo Buyer',
            'email' => 'user@aurelius.com',
            'password' => 'password',
            'role' => 'user',
        ]);

        User::create([
            'name' => 'Sarah Mitchell',
            'email' => 'agent@aurelius.com',
            'password' => 'password',
            'role' => 'agent',
        ]);

        User::create([
            'name' => 'James Sterling',
            'email' => 'owner@aurelius.com',
            'password' => 'password',
            'role' => 'owner',
        ]);

        $this->call([
            PropertySeeder::class,
            TestimonialSeeder::class,
            InquirySeeder::class,
        ]);
    }
}
