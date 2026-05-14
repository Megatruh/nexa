<?php

namespace App\Http\Controllers;

use App\Models\Tryout;
use App\Models\TryoutSubtest;
use App\Models\TryoutSession;
use App\Models\TryoutSessionSubtest;
use App\Models\TryoutAnswer;
use App\Models\TryoutQuestion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TryoutController extends Controller
{
    // =========================================================
    //  1. HALAMAN UTAMA — Daftar Tryout & Riwayat
    // =========================================================

    public function index()
    {
        $user = Auth::user();

        $activeTryouts = Tryout::where('is_active', true)
            ->withCount('subtests')
            ->get()
            ->map(function ($tryout) {
                $firstSubtest = $tryout->subtests()->orderBy('order', 'asc')->first();
                $tryout->first_subtest_id = $firstSubtest?->id;
                return $tryout;
            });

        $history = TryoutSession::with('tryout')
            ->where('user_id', $user->id)
            ->whereNotNull('finished_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Tryout/Index', [
            'activeTryouts' => $activeTryouts,
            'history'       => $history,
        ]);
    }

    // =========================================================
    //  2. TAMPILKAN HALAMAN UJIAN — 1 Soal per Halaman
    // =========================================================

    /**
     * GET /tryout/{tryout_id}/subtest/{subtest_id}
     *
     * Menampilkan halaman ujian untuk satu subtes.
     * Soal di-paginate 1 per halaman; jawaban ter-saved ditampilkan kembali.
     */
    public function showSubtest(Request $request, $tryout_id, $subtest_id)
    {
        $user    = Auth::user();
        $subtest = TryoutSubtest::with('tryout')->findOrFail($subtest_id);

        // Pastikan subtes memang milik tryout yang benar
        abort_if($subtest->tryout_id != $tryout_id, 404);

        // -- Sesi Tryout (buat baru kalau belum ada) --
        $session = TryoutSession::firstOrCreate(
            ['user_id' => $user->id, 'tryout_id' => $tryout_id],
            [
                'started_at'       => now(),
                'study_program_id' => $user->study_program_id ?? 1,
            ]
        );

        // -- Sesi Subtes (catat waktu mulai) --
        $sessionSubtest = TryoutSessionSubtest::firstOrCreate(
            ['tryout_session_id' => $session->id, 'tryout_subtest_id' => $subtest->id],
            ['started_at' => now()]
        );

        // Kalau sudah selesai, lempar ke subtes berikutnya
        if ($sessionSubtest->finished_at) {
            return redirect()->route('tryout.index')
                ->with('message', 'Subtes ini sudah diselesaikan.');
        }

        // -- Hitung sisa waktu berdasarkan kapan mulai --
        $durasiDetik  = $subtest->duration * 60;
        $terpakai      = now()->diffInSeconds($sessionSubtest->started_at);
        $sisaWaktu     = max(0, $durasiDetik - $terpakai);

        // Kalau waktu habis di server, otomatis finish
        if ($sisaWaktu <= 0) {
            $sessionSubtest->update(['finished_at' => now()]);
            return $this->redirectToNextSubtest($subtest);
        }

        // -- Soal (1 per halaman) --
        $questions = $subtest->questions()->paginate(1, ['*'], 'page', $request->page ?? 1);

        // -- Jawaban yang sudah tersimpan untuk soal ini --
        $currentQuestionId = $questions->items()[0]->id ?? null;
        $savedAnswer = $currentQuestionId
            ? TryoutAnswer::where('tryout_session_id', $session->id)
                ->where('tryout_question_id', $currentQuestionId)
                ->first()
            : null;

        // -- Semua ID soal untuk navigasi nomor --
        $allQuestionIds = $subtest->questions()->pluck('id');

        // -- Semua jawaban user di subtes ini (untuk warna navigasi) --
        $allAnswers = TryoutAnswer::where('tryout_session_id', $session->id)
            ->whereIn('tryout_question_id', $allQuestionIds)
            ->pluck('answer', 'tryout_question_id');

        return Inertia::render('Tryout/Exam', [
            'session'        => $session,
            'subtest'        => $subtest,
            'sessionSubtest' => $sessionSubtest,
            'questions'      => $questions,
            'savedAnswer'    => $savedAnswer,
            'allQuestionIds' => $allQuestionIds,
            'allAnswers'     => $allAnswers,
            'sisaWaktu'      => $sisaWaktu, // detik tersisa (server-authoritative)
        ]);
    }

    // =========================================================
    //  3. SIMPAN JAWABAN — Auto-save tiap klik pilihan
    // =========================================================

    /**
     * POST /tryout/answer
     *
     * Menyimpan / memperbarui jawaban satu soal.
     */
    public function storeAnswer(Request $request)
    {
        $request->validate([
            'tryout_session_id'  => 'required|exists:tryout_sessions,id',
            'tryout_question_id' => 'required|exists:tryout_questions,id',
            'answer'             => 'nullable|string|max:1',
            'is_doubtful'        => 'boolean',
        ]);

        // Verifikasi sesi milik user yang login
        $session = TryoutSession::where('id', $request->tryout_session_id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        TryoutAnswer::updateOrCreate(
            [
                'tryout_session_id'  => $session->id,
                'tryout_question_id' => $request->tryout_question_id,
            ],
            [
                'answer'      => $request->answer,
                'is_doubtful' => $request->boolean('is_doubtful', false),
            ]
        );

        return back();
    }

    // =========================================================
    //  4. SELESAIKAN SUBTES — Manual atau Timer Habis
    // =========================================================

    /**
     * POST /tryout/subtest/{session_subtest_id}/finish
     *
     * Menandai subtes selesai, lalu lanjut ke subtes berikutnya
     * atau ke halaman hasil jika sudah subtes terakhir.
     */
    public function finishSubtest(Request $request, $session_subtest_id)
    {
        $sessionSubtest = TryoutSessionSubtest::findOrFail($session_subtest_id);

        // Pastikan sesi ini milik user yang login
        $session = TryoutSession::where('id', $sessionSubtest->tryout_session_id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // Tandai selesai (idempotent)
        if (! $sessionSubtest->finished_at) {
            $sessionSubtest->update(['finished_at' => now()]);
        }

        $currentSubtest = TryoutSubtest::find($sessionSubtest->tryout_subtest_id);

        return $this->redirectToNextSubtest($currentSubtest, $session->id);
    }

    // =========================================================
    //  5. SUBMIT EXAM AKHIR — Hitung Skor & Simpan ke Session
    // =========================================================

    /**
     * POST /tryout/session/{session_id}/submit
     *
     * Dipanggil setelah SEMUA subtes selesai.
     * Menghitung skor, menyimpan ke tryout_sessions.total_score,
     * lalu redirect ke halaman Hasil.
     */
    public function submitExam(Request $request, $session_id)
    {
        $session = TryoutSession::where('id', $session_id)
            ->where('user_id', Auth::id())
            ->with('tryout.subtests.questions')
            ->firstOrFail();

        // Hindari double-submit
        if ($session->finished_at) {
            return redirect()->route('tryout.result', $session->id);
        }

        DB::transaction(function () use ($session) {
            $totalScore   = 0;
            $scoreDetails = [];

            foreach ($session->tryout->subtests as $subtest) {
                $subtestScore = 0;

                foreach ($subtest->questions as $question) {
                    $jawaban = TryoutAnswer::where('tryout_session_id', $session->id)
                        ->where('tryout_question_id', $question->id)
                        ->first();

                    if ($jawaban && strtoupper($jawaban->answer) === strtoupper($question->correct_answer)) {
                        $subtestScore += $question->score_weight;
                    }
                }

                $scoreDetails[$subtest->name] = $subtestScore;
                $totalScore += $subtestScore;
            }

            $session->update([
                'finished_at'   => now(),
                'total_score'   => $totalScore,
                'score_details' => $scoreDetails,
            ]);
        });

        return redirect()->route('tryout.result', $session->id)
            ->with('success', 'Tryout berhasil diselesaikan!');
    }

    // =========================================================
    //  6. HALAMAN HASIL
    // =========================================================

    /**
     * GET /tryout/result/{session_id}
     */
    public function showResult($session_id)
    {
        $session = TryoutSession::where('id', $session_id)
            ->where('user_id', Auth::id())
            ->with(['tryout', 'answers.question'])
            ->firstOrFail();

        return Inertia::render('Tryout/Result', [
            'session' => $session,
        ]);
    }

    // =========================================================
    //  HELPER PRIVATE
    // =========================================================

    /**
     * Cari subtes selanjutnya; kalau habis → submit & ke hasil.
     */
    private function redirectToNextSubtest(TryoutSubtest $currentSubtest, $sessionId = null)
    {
        $nextSubtest = TryoutSubtest::where('tryout_id', $currentSubtest->tryout_id)
            ->where('order', '>', $currentSubtest->order)
            ->orderBy('order', 'asc')
            ->first();

        if ($nextSubtest) {
            return redirect()->route('tryout.subtest.show', [
                'tryout_id'  => $currentSubtest->tryout_id,
                'subtest_id' => $nextSubtest->id,
            ]);
        }

        // Tidak ada subtes berikutnya → hitung skor & tampilkan hasil
        if ($sessionId) {
            return redirect()->route('tryout.exam.submit', $sessionId);
        }

        return redirect()->route('tryout.index')->with('success', 'Semua subtes selesai!');
    }
}