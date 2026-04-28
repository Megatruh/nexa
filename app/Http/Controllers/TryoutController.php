<?php

namespace App\Http\Controllers;

use App\Models\Tryout;
use App\Models\TryoutSubtest;
use App\Models\TryoutSession;
use App\Models\TryoutSessionSubtest;
use App\Models\TryoutAnswer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class TryoutController extends Controller
{
    /**
     * 1. Halaman Utama Tryout (Daftar & Riwayat)
     */
    public function index()
{
    $user = Auth::user();
    
    $activeTryouts = Tryout::where('is_active', true)
        ->withCount('subtests') // Biar muncul "7 Subtest" di UI
        ->get()
        ->map(function ($tryout) {
            // Kita cari subtest pertama berdasarkan urutan (order)
            $firstSubtest = $tryout->subtests()->orderBy('order', 'asc')->first();
            $tryout->first_subtest_id = $firstSubtest ? $firstSubtest->id : null;
            return $tryout;
        });
    
    $history = TryoutSession::with('tryout')
        ->where('user_id', $user->id)
        ->orderBy('created_at', 'desc')
        ->get();

    return Inertia::render('Tryout/Index', [
        'activeTryouts' => $activeTryouts,
        'history' => $history
    ]);
}

    /**
     * 2. Menampilkan Halaman Ujian (1 Soal 1 Halaman)
     */
    public function showSubtest(Request $request, $tryout_id, $subtest_id)
    {
        $user = Auth::user();

        // Cari atau buat sesi Tryout (Logika disederhanakan)
        $session = TryoutSession::firstOrCreate(
            ['user_id' => $user->id, 'tryout_id' => $tryout_id],
            ['started_at' => now(), 'study_program_id' => $user->study_program_id ?? 1] // Sesuaikan jurusan
        );

        $subtest = TryoutSubtest::findOrFail($subtest_id);

        // Cari atau catat waktu mulai subtes ini
        $sessionSubtest = TryoutSessionSubtest::firstOrCreate(
            ['tryout_session_id' => $session->id, 'tryout_subtest_id' => $subtest->id],
            ['started_at' => now()]
        ); // Ambil data lengkap setelah firstOrCreate

        // Jika subtes sudah selesai, lempar ke subtes berikutnya atau halaman hasil
        if ($sessionSubtest->finished_at) {
            return redirect()->route('tryout.index')->with('message', 'Subtes ini sudah diselesaikan.');
        }

        // Ambil soal dengan paginasi (1 soal per halaman)
        $questions = $subtest->questions()->paginate(1);

        // Ambil jawaban user untuk soal yang sedang tampil (jika sudah pernah dijawab/ragu-ragu)
        $currentQuestionId = $questions->items()[0]->id ?? null;
        $savedAnswer = TryoutAnswer::where('tryout_session_id', $session->id)
            ->where('tryout_question_id', $currentQuestionId)
            ->first();

        // Ambil semua daftar ID soal untuk navigasi nomor di frontend
        $allQuestionIds = $subtest->questions()->pluck('id');

        return Inertia::render('Tryout/Exam', [
            'session' => $session,
            'subtest' => $subtest,
            'sessionSubtest' => $sessionSubtest,
            'questions' => $questions, // Inertia akan otomatis merender links paginasi Next/Prev
            'savedAnswer' => $savedAnswer,
            'allQuestionIds' => $allQuestionIds
        ]);
    }

    public function finishSubtest(Request $request, $session_subtest_id)
{
    $sessionSubtest = TryoutSessionSubtest::findOrFail($session_subtest_id);
    $sessionSubtest->update(['finished_at' => now()]);

    $currentSubtest = TryoutSubtest::find($sessionSubtest->tryout_subtest_id);

    // Cari yang ordernya lebih besar
    $nextSubtest = TryoutSubtest::where('tryout_id', $currentSubtest->tryout_id)
        ->where('order', '>', $currentSubtest->order)
        ->orderBy('order', 'asc')
        ->first();

    if ($nextSubtest) {
        return redirect()->route('tryout.subtest.show', [
            'tryout_id' => $currentSubtest->tryout_id,
            'subtest_id' => $nextSubtest->id
        ]);
    }

    return redirect()->route('tryout.index')->with('success', 'Semua subtest selesai!');
}

    /**
     * 3. Menyimpan Jawaban (Auto-save)
     */
    public function storeAnswer(Request $request)
    {
        $request->validate([
            'tryout_session_id' => 'required|exists:tryout_sessions,id',
            'tryout_question_id' => 'required|exists:tryout_questions,id',
            'answer' => 'nullable|string|max:1',
            'is_doubtful' => 'boolean'
        ]);

        TryoutAnswer::updateOrCreate(
            [
                'tryout_session_id' => $request->tryout_session_id,
                'tryout_question_id' => $request->tryout_question_id,
            ],
            [
                'answer' => $request->answer,
                'is_doubtful' => $request->is_doubtful ?? false,
            ]
        );

        return back(); 
    }
}

