<?php

namespace Database\Seeders;

use App\Models\StudyProgram;
use Illuminate\Database\Seeder;

class StudyProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // StudyProgram::factory(26)->create();
        $data = [
            // Teknik
            ['name' => 'Informatika', 'weight_num' => 5, 'weight_abst' => 5, 'weight_verb' => 2],
            ['name' => 'Sistem Informasi', 'weight_num' => 5, 'weight_abst' => 5, 'weight_verb' => 2],
            ['name' => 'Teknik Sipil', 'weight_num' => 5, 'weight_abst' => 4, 'weight_verb' => 2],
            ['name' => 'Teknik Elektro', 'weight_num' => 5, 'weight_abst' => 4, 'weight_verb' => 2],
            
            // FEB
            ['name' => 'Akuntansi', 'weight_num' => 5, 'weight_abst' => 3, 'weight_verb' => 3],
            ['name' => 'Manajemen', 'weight_num' => 4, 'weight_abst' => 3, 'weight_verb' => 4],
            ['name' => 'Ekonomi Pembangunan', 'weight_num' => 4, 'weight_abst' => 3, 'weight_verb' => 4],
            ['name' => 'Perbankan dan Keuangan', 'weight_num' => 5, 'weight_abst' => 3, 'weight_verb' => 3],
            ['name' => 'Perbankan dan Keuangan Digital', 'weight_num' => 5, 'weight_abst' => 3, 'weight_verb' => 3],
            
            // FKIP
            ['name' => 'Pendidikan Matematika', 'weight_num' => 5, 'weight_abst' => 4, 'weight_verb' => 2],
            ['name' => 'Pendidikan Fisika', 'weight_num' => 5, 'weight_abst' => 4, 'weight_verb' => 2],
            ['name' => 'Pendidikan Bahasa Inggris', 'weight_num' => 2, 'weight_abst' => 3, 'weight_verb' => 5],
            ['name' => 'Pendidikan Bahasa Indonesia', 'weight_num' => 2, 'weight_abst' => 3, 'weight_verb' => 5],
            ['name' => 'Pendidikan Masyarakat', 'weight_num' => 2, 'weight_abst' => 2, 'weight_verb' => 5],
            ['name' => 'Pendidikan Sejarah', 'weight_num' => 2, 'weight_abst' => 2, 'weight_verb' => 5],
            ['name' => 'Pendidikan Biologi', 'weight_num' => 3, 'weight_abst' => 4, 'weight_verb' => 3],
            ['name' => 'Pendidikan Geografi', 'weight_num' => 3, 'weight_abst' => 4, 'weight_verb' => 3],
            ['name' => 'Pendidikan Ekonomi', 'weight_num' => 4, 'weight_abst' => 3, 'weight_verb' => 3],
            ['name' => 'Pendidikan Jasmani', 'weight_num' => 3, 'weight_abst' => 3, 'weight_verb' => 3],
            
            // Pertanian
            ['name' => 'Agroteknologi', 'weight_num' => 3, 'weight_abst' => 5, 'weight_verb' => 2],
            ['name' => 'Teknologi Pangan dan Hasil Pertanian', 'weight_num' => 3, 'weight_abst' => 5, 'weight_verb' => 2],           
            ['name' => 'Agribisnis', 'weight_num' => 4, 'weight_abst' => 3, 'weight_verb' => 3],
            
            // Agama Islam
            ['name' => 'Ekonomi Syariah', 'weight_num' => 4, 'weight_abst' => 3, 'weight_verb' => 4],           
            ['name' => 'Manajemen Mutu Halal', 'weight_num' => 3, 'weight_abst' => 4, 'weight_verb' => 3],           
            
            // Ilmu Politik
            ['name' => 'Ilmu Politik', 'weight_num' => 2, 'weight_abst' => 4, 'weight_verb' => 3],           
            
            // Kesehatan
            ['name' => 'Kesehatan Masyarakat', 'weight_num' => 3, 'weight_abst' => 3, 'weight_verb' => 4],           
            ['name' => 'Gizi', 'weight_num' => 3, 'weight_abst' => 3, 'weight_verb' => 4],           

        ];

        foreach ($data as $item) {
            StudyProgram::updateOrCreate(
                ['name' => $item['name']], // Cek berdasarkan nama agar tidak duplikat
                [
                    'weight_num' => $item['weight_num'],
                    'weight_abst' => $item['weight_abst'],
                    'weight_verb' => $item['weight_verb'],
                    'passing_grade_avg' => rand(530, 800), // Ini boleh random atau sesuaikan
                ]
            );
        }
    }
}
