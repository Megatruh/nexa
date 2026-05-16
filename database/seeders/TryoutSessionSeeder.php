<?php

namespace Database\Seeders;

use App\Models\TryoutSession;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TryoutSessionSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed sesi tryout untuk pengujian.
     *
     * Membuat 3 sesi aktif (belum selesai) dan 5 sesi yang sudah
     * selesai menggunakan factory yang sudah didefinisikan.
     */
    public function run(): void
    {
        // Gunakan user yang sudah ada, atau buat jika belum ada
        $users = User::where('role', 'user')->limit(5)->get();

        if ($users->isEmpty()) {
            $users = User::factory(3)->create(['role' => 'user']);
        }

        foreach ($users as $user) {
            // Sesi aktif — belum selesai (bisa dilanjutkan)
            TryoutSession::factory()
                ->count(1)
                ->create(['user_id' => $user->id]);

            // Sesi selesai — untuk riwayat
            TryoutSession::factory()
                ->finished()
                ->count(2)
                ->create(['user_id' => $user->id]);
        }
    }
}
