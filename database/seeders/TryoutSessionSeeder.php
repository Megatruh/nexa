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
     * ⚠️  DINONAKTIFKAN — Seeder ini sebelumnya menjadi sumber bug "Ghost Session":
     *     Saat `migrate:fresh --seed` dijalankan, seeder ini membuat data sesi
     *     dummy (status "Belum Selesai") untuk seluruh user yang ada, termasuk
     *     User1. Akibatnya, saat user login pertama kali, riwayat "Belum Selesai"
     *     sudah muncul padahal user belum pernah memulai ujian sama sekali.
     *
     *     Untuk menghindari hal ini, JANGAN panggil seeder ini di DatabaseSeeder.
     *     Sesi tryout hanya boleh dibuat oleh TryoutController saat user benar-
     *     benar mengklik tombol "Mulai Ujian" di frontend.
     */
    public function run(): void
    {
        // Tidak ada data dummy yang dibuat.
        // Sesi tryout dibuat secara organik melalui TryoutController::showSubtest()
        // saat user pertama kali mengakses halaman ujian.
        $this->command->warn('TryoutSessionSeeder: DILEWATI — tidak ada dummy session yang dibuat (mencegah Ghost Session Bug).');
    }
}
