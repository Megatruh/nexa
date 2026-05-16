<?php

namespace Database\Seeders;

use App\Models\StudyProgramDescription;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class StudyProgramDescriptionSeeder extends Seeder
{
    public function run(): void
    {
        // Path ke file CSV kamu
        $path = database_path("data/ulasan_prodi.csv");

        if (!File::exists($path)) {
            $this->command->error("File CSV tidak ditemukan di: $path");
            return;
        }

        $file = fopen($path, "r");
        
        // Lewati baris pertama (header/judul kolom CSV)
        $firstline = true;
        
        while (($data = fgetcsv($file, 0, ",")) !== FALSE) {
            if (!$firstline) {
                // Proses memotong string passing grade dari CSV
                $passingGradeRaw = $data[1]; // contoh: "430-460"
                $parts = explode('-', $passingGradeRaw);
                
                $min = isset($parts[0]) ? (int) trim($parts[0]) : 0;
                $max = isset($parts[1]) ? (int) trim($parts[1]) : 0;

                StudyProgramDescription::create([
                    'name'              => $data[0],
                    'passing_grade_min' => $min,            // Masukkan nilai minimum
                    'passing_grade_max' => $max,            // Masukkan nilai maksimum
                    'career_prospects'  => $data[2],
                    'description'       => $data[3],
                    'rating'            => (float)$data[4],
                    'accreditation'     => $data[5],
                    'ukt_range'         => $data[6],
                    'enthusiasts'       => (int)$data[7],
                    'related_subjects'  => $data[8],
                    'capacity'          => (int)$data[9],
                ]);
            }
            $firstline = false;
        }

        fclose($file);
        $this->command->info("Boom! Data Ulasan Prodi berhasil diimpor!");
    }
}