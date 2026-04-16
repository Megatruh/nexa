<?php

namespace Database\Seeders;

use App\Models\Subtest;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;


class SubtestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Masukin semua nama subtes ke dalam array
        $subtests = [
            'Penalaran Umum',
            'Pengetahuan dan Pemahaman Umum',
            'Pemahaman Bacaan dan Menulis',
            'Pengetahuan Kuantitatif',
            'Literasi dalam Bahasa Indonesia',
            'Literasi dalam Bahasa Inggris',
            'Penalaran Matematika'
        ];

        // 2. Looping array-nya untuk di-insert ke database
        foreach ($subtests as $test) {
            Subtest::create([
                'name' => $test,
                'slug' => Str::slug($test),
                'description' => 'Deskripsi untuk ' . $test,
            ]);
        }
    }
}
