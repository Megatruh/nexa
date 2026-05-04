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
                StudyProgramDescription::create([
                    'name'             => $data[0],
                    'passing_grade'    => $data[1],
                    'career_prospects' => $data[2],
                    'description'      => $data[3],
                    'rating'           => (float)$data[4],
                    'accreditation'    => $data[5],
                    'ukt_range'        => $data[6],
                    'enthusiasts'      => (int)$data[7],
                    'related_subjects' => $data[8],
                    'capacity'         => (int)$data[9],
                ]);
            }
            $firstline = false;
        }

        fclose($file);
        $this->command->info("Boom! Data Ulasan Prodi berhasil diimpor!");
    }
}