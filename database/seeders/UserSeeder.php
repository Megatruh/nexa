<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => env('ADMIN_EMAIL'),
            'email_verified_at' => now(),
            'role' => 'admin',
            'password' => bcrypt(env('ADMIN_PASSWORD')),
        ]);
        User::create([
            'name' => 'User1',
            'email' => 'user1@example.com',
            'email_verified_at' => now(),
            'role' => 'user',
            'password' => bcrypt('password123'),
        ]);
    }
}
