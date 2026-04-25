<?php
// database/seeders/SurveySeeder.php

namespace Database\Seeders;

use App\Models\Survey;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class SurveySeeder extends Seeder
{
    public function run(): void
    {
        // Pastikan nama file sesuai dengan yang ada di folder database/data/
        $csvFile = database_path('data/soal_dat.csv');
        
        if (!File::exists($csvFile)) {
            $this->command->error("File CSV tidak ditemukan di: $csvFile");
            return;
        }

        $data = array_map('str_getcsv', file($csvFile));
        
        // Buang baris pertama (Header: No, Kategori, Pertanyaan, dst)
        array_shift($data);

        foreach ($data as $row) {
            Survey::create([
                'category'       => $row[1], // "Verbal" atau "Numerik"
                'question'       => $row[2], // "Api : Panas = Es : ..."
                'option_a'       => $row[3], // "Beku"
                'option_b'       => $row[4], // "Dingin"
                'option_c'       => $row[5], // "Cair"
                'option_d'       => $row[6], // "Air"
                'correct_answer' => strtoupper($row[7]), // Pastikan huruf kapital (A/B/C/D)
                'item_weight'    => (int)$row[8], // Pastikan jadi angka (1, 2, atau 3)
            ]);
        }
    }
}