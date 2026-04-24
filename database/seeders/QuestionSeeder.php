<?php

namespace Database\Seeders;

use App\Models\Subtest;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subtests = Subtest::all();

        foreach ($subtests as $subtest) {
            // Kita buat 15 soal dummy per subtest
            for ($i = 1; $i <= 15; $i++) {
                \App\Models\Question::create([
                    'subtest_id' => $subtest->id,
                    'question_text' => "Ini adalah pertanyaan simulasi ke-$i untuk {$subtest->name}. Manakah jawaban yang benar?",
                    'option_a' => "Pilihan Jawaban A",
                    'option_b' => "Pilihan Jawaban B",
                    'option_c' => "Pilihan Jawaban C",
                    'option_d' => "Pilihan Jawaban D",
                    'option_e' => "Pilihan Jawaban E",
                    'correct_answer' => 'a',
                    'weight' => 1,
                ]);
            }
        }
    }
}
