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
        
        // Ambil tryout yang sedang aktif
        $activeTryouts = Tryout::where('is_active', true)->get();
        
        // Ambil riwayat pengerjaan tryout user
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
        );

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

    /**
     * 3. Menyimpan Jawaban (Auto-save) saat user klik A, B, C, D, E atau Next
     */
    public function storeAnswer(Request $request)
    {
        $request->validate([
            'tryout_session_id' => 'required|exists:tryout_sessions,id',
            'tryout_question_id' => 'required|exists:tryout_questions,id',
            'answer' => 'nullable|string|max:1',
            'is_doubtful' => 'boolean'
        ]);

        // Simpan atau update jawaban
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

        // Gunakan back() agar Inertia tetap di halaman yang sama tanpa reload full
        return back(); 
    }

    /**
     * 4. Menyelesaikan Subtes (Skip Waktu / Habis Waktu)
     */
    public function finishSubtest(Request $request, $session_subtest_id)
    {
        $sessionSubtest = TryoutSessionSubtest::findOrFail($session_subtest_id);
        
        // Tandai waktu selesai
        $sessionSubtest->update([
            'finished_at' => now()
        ]);

        // LOGIKA LANJUTAN: 
        // Cek apakah ini subtes terakhir. Jika ya, hitung total skor di sini dan update `tryout_sessions`.
        // Jika bukan, redirect ke subtes berikutnya.

        return redirect()->route('tryout.index')->with('success', 'Subtes selesai!');
    }
}