<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use App\Models\UserSurveyResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SurveyTestController extends Controller
{
    public function index(){
        // AMbil soal yang memiliki kategori
        $questions = Survey::whereIn('category', ['Numerik', 'Verbal', 'Abstrak'])->get();
        return Inertia::render('Jurusan/Test', [
            'questions'=> $questions,
        ]);
    }
    public function submit(Request $request)
    {
        $user = Auth::user();
        $answers = $request->answers; // Format: [soal_id => 'A', soal_id => 'B']
        
        $scores = ['Numerik'=>0, 'Verbal'=>0, 'Abstrak'=>0];

        $maxScores = [
            'Numerik' => Survey::where('category', 'Numerik')->sum('item_weight'),
            'Verbal'  => Survey::where('category', 'Verbal')->sum('item_weight'),
            'Abstrak' => Survey::where('category', 'Abstrak')->sum('item_weight'),
        ];

        foreach ($answers as $questionId => $userAnswer) {
            $question = Survey::find($questionId);
            
            if(!$question) continue;

            $maxScores[$question->category] += $question->item_weight;
            $isCorrect = (strtoupper($userAnswer) == strtoupper($question->correct_answer));

            UserSurveyResponse::create([
                'user_id'=>$user->id,
                'survey_id'=>$questionId,
                'user_answer'=>$userAnswer,
                'is_correct'=>$isCorrect,
            ]);

            if($isCorrect){
                $scores[$question->category] += $question->item_weight;
            }
        }
        // Normalisasi skor ke 0-100
        $finalN = $maxScores['Numerik'] > 0 ? ($scores['Numerik'] / $maxScores['Numerik']) * 100 : 0;
        $finalV = $maxScores['Verbal'] > 0 ? ($scores['Verbal'] / $maxScores['Verbal']) * 100 : 0;
        $finalA = $maxScores['Abstrak'] > 0 ? ($scores['Abstrak'] / $maxScores['Abstrak']) * 100 : 0;

        return redirect()->route('jurusan.index')->with('test_results', [
            'n' => $finalN,
            'v' => $finalV,
            'a' => $finalA
        ]);
    
    }
}