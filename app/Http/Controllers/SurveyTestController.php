<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use App\Models\UserSurveyResponse;
use App\Models\StudyProgram; // PENTING: Tambahkan model ini
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SurveyTestController extends Controller
{
    // 1. FUNGSI UNTUK DASHBOARD KESESUAIAN (Halaman Awal & Hasil)
    public function index()
    {
        $user = Auth::user();
        
        // 1. Cek apakah user sudah punya jawaban di database
        $hasResponses = UserSurveyResponse::where('user_id', $user->id)->exists();
        $latestResults = null;

        if ($hasResponses) {
            // 2. Hitung skor dari data yang ada di database
            $scores = ['Numerik' => 0, 'Verbal' => 0, 'Abstrak' => 0];
            $maxScores = [
                'Numerik' => Survey::where('category', 'Numerik')->sum('item_weight'),
                'Verbal'  => Survey::where('category', 'Verbal')->sum('item_weight'),
                'Abstrak' => Survey::where('category', 'Abstrak')->sum('item_weight'),
            ];

            $userResponses = UserSurveyResponse::where('user_id', $user->id)
                ->with('survey')
                ->get();

            foreach ($userResponses as $response) {
                if ($response->is_correct) {
                    $scores[$response->survey->category] += $response->survey->item_weight;
                }
            }

            $latestResults = [
                'n' => $maxScores['Numerik'] > 0 ? round(($scores['Numerik'] / $maxScores['Numerik']) * 100, 2) : 0,
                'v' => $maxScores['Verbal'] > 0 ? round(($scores['Verbal'] / $maxScores['Verbal']) * 100, 2) : 0,
                'a' => $maxScores['Abstrak'] > 0 ? round(($scores['Abstrak'] / $maxScores['Abstrak']) * 100, 2) : 0,
            ];
        }

        return Inertia::render('Jurusan/Index', [
            'studyPrograms' => StudyProgram::all(),
            'existingResults' => $latestResults, // Kirim sebagai props tetap
        ]);
    }

    // 2. FUNGSI UNTUK HALAMAN PENGERJAAN SOAL (Tes DAT)
    public function showTest()
    {
        // Mengambil soal untuk ditampilkan di Jurusan/Test.jsx
        $questions = Survey::whereIn('category', ['Numerik', 'Verbal', 'Abstrak'])->get();
        
        return Inertia::render('Jurusan/Test', [
            'questions' => $questions,
        ]);
    }           

    // 3. FUNGSI UNTUK MENGHITUNG JAWABAN
    public function submit(Request $request)
    {
        $user = Auth::user();
    
        // Hapus jawaban lama agar hasil selalu yang terbaru (Otomatis Update)
        UserSurveyResponse::where('user_id', $user->id)->delete();
        
        $answers = $request->answers ?? []; 
        
        $scores = ['Numerik'=>0, 'Verbal'=>0, 'Abstrak'=>0];

        // Murni ambil dari database (Jangan ditambah lagi di dalam foreach!)
        $maxScores = [
            'Numerik' => Survey::where('category', 'Numerik')->sum('item_weight'),
            'Verbal'  => Survey::where('category', 'Verbal')->sum('item_weight'),
            'Abstrak' => Survey::where('category', 'Abstrak')->sum('item_weight'),
        ];

        foreach ($answers as $questionId => $userAnswer) {
            $question = Survey::find($questionId);
            
            if(!$question) continue;

            $isCorrect = (strtoupper($userAnswer) == strtoupper($question->correct_answer));

            UserSurveyResponse::create([
                'user_id' => $user->id,
                'survey_id' => $questionId,
                'user_answer' => $userAnswer,
                'is_correct' => $isCorrect,
            ]);

            if($isCorrect){
                $scores[$question->category] += $question->item_weight;
            }
            // PERHATIKAN: Saya menghapus $maxScores[$question->category] += $question->item_weight; di sini
            // Karena jika tidak dihapus, maxScores akan dihitung double (dari database + dari perulangan).
        }

        // Normalisasi skor ke 0-100
        $finalN = $maxScores['Numerik'] > 0 ? ($scores['Numerik'] / $maxScores['Numerik']) * 100 : 0;
        $finalV = $maxScores['Verbal'] > 0 ? ($scores['Verbal'] / $maxScores['Verbal']) * 100 : 0;
        $finalA = $maxScores['Abstrak'] > 0 ? ($scores['Abstrak'] / $maxScores['Abstrak']) * 100 : 0;

        return redirect()->route('jurusan.index')->with('test_results', [
            'n' => round($finalN, 2),
            'v' => round($finalV, 2),
            'a' => round($finalA, 2)
        ]);
    }
}