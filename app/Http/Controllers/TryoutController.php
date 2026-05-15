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
     * URUTAN SOAL ACAK TAPI KONSISTEN:
     * Soal diacak menggunakan SEED berbasis session->id, sehingga:
     *  - Setiap user mendapat urutan acak yang berbeda
     *  - Jika user refresh, urutan tetap SAMA (deterministik)
     *  - Navigasi nomor soal konsisten
     */
    public function showSubtest(Request $request, $tryout_id, $subtest_id)
    {
        $user    = Auth::user();
        $subtest = TryoutSubtest::with('tryout')->findOrFail($subtest_id);

        abort_if($subtest->tryout_id != $tryout_id, 404);

        // -- Sesi Tryout --
        $session = TryoutSession::firstOrCreate(
            ['user_id' => $user->id, 'tryout_id' => $tryout_id],
            [
                'started_at'       => now(),
                'study_program_id' => $user->study_program_id ?? 1,
            ]
        );

        // -- Sesi Subtes --
        $sessionSubtest = TryoutSessionSubtest::firstOrCreate(
            ['tryout_session_id' => $session->id, 'tryout_subtest_id' => $subtest->id],
            ['started_at' => now()]
        );

        if ($sessionSubtest->finished_at) {
            return redirect()->route('tryout.index')
                ->with('message', 'Subtes ini sudah diselesaikan.');
        }

        // -- Hitung sisa waktu (server-authoritative) --
        $durasiDetik = $subtest->duration * 60;
        $terpakai    = now()->diffInSeconds($sessionSubtest->started_at);
        $sisaWaktu   = max(0, $durasiDetik - $terpakai);

        if ($sisaWaktu <= 0) {
            $sessionSubtest->update(['finished_at' => now()]);
            return $this->redirectToNextSubtest($subtest, $session->id);
        }

        // -- Soal diacak dengan SEED = session->id (deterministik per user) --
        //
        // Cara kerja:
        //   1. Ambil SEMUA ID soal dalam subtes, diurutkan by ID (stabil)
        //   2. Acak menggunakan seed dari session->id (PHP mt_srand / shuffle deterministik)
        //   3. Ambil ID ke-N sesuai halaman yang diminta
        //   4. Query soal berdasarkan ID tersebut
        //
        // Ini menggantikan ->inRandomOrder($session->id) yang tidak tersedia di semua
        // versi Laravel dan berperilaku berbeda per DB engine.

        $allIdsSorted = $subtest->questions()->orderBy('id')->pluck('id')->toArray();
        $allIds       = $this->seededShuffle($allIdsSorted, $session->id);

        $page      = max(1, (int) ($request->page ?? 1));
        $total     = count($allIds);
        $currentId = $allIds[$page - 1] ?? null;

        // Bangun paginator manual agar kompatibel dengan prop `questions` di Exam.jsx
        $question    = $currentId ? TryoutQuestion::find($currentId) : null;
        $questions   = new \Illuminate\Pagination\LengthAwarePaginator(
            $question ? [$question] : [],
            $total,
            1,         // per page
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        // -- Jawaban tersimpan soal ini --
        $savedAnswer = $currentId
            ? TryoutAnswer::where('tryout_session_id', $session->id)
                ->where('tryout_question_id', $currentId)
                ->first()
            : null;

        // -- Semua jawaban user di subtes ini (untuk navigasi warna) --
        $allAnswers = TryoutAnswer::where('tryout_session_id', $session->id)
            ->whereIn('tryout_question_id', $allIds)
            ->pluck('answer', 'tryout_question_id');

        \Illuminate\Support\Facades\Log::info('TryoutController@showSubtest', [
            'tryout_id' => $tryout_id,
            'subtest_id' => $subtest_id,
            'session_id' => $session->id,
            'allIds_count' => count($allIds),
            'page' => $page,
            'currentId' => $currentId,
            'question_found' => $question ? true : false,
            'questions_json' => $questions->toJson(),
        ]);

        return Inertia::render('Tryout/Exam', [
            'session'        => $session,
            'subtest'        => $subtest,
            'sessionSubtest' => $sessionSubtest,
            'questions'      => $questions,
            'savedAnswer'    => $savedAnswer,
            'allQuestionIds' => $allIds, // Urutan acak yang konsisten
            'allAnswers'     => $allAnswers,
            'sisaWaktu'      => $sisaWaktu,
        ]);
    }

    // =========================================================
    //  3. SIMPAN JAWABAN — Auto-save via Axios (background sync)
    // =========================================================

    public function storeAnswer(Request $request)
    {
        $request->validate([
            'tryout_session_id'  => 'required|exists:tryout_sessions,id',
            'tryout_question_id' => 'required|exists:tryout_questions,id',
            'answer'             => 'nullable|string|in:A,B,C,D,E',
            'is_doubtful'        => 'boolean',
        ]);

        $session = TryoutSession::where('id', $request->tryout_session_id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // -- Validasi waktu server (anti-cheat) --
        $question = TryoutQuestion::with('subtest')->find($request->tryout_question_id);
        if ($question) {
            $sessionSubtest = TryoutSessionSubtest::where('tryout_session_id', $session->id)
                ->where('tryout_subtest_id', $question->tryout_subtest_id)
                ->first();

            if ($sessionSubtest) {
                // Tolak jika subtes sudah ditandai selesai
                if ($sessionSubtest->finished_at !== null) {
                    return response()->json(['message' => 'Subtes telah selesai.'], 403);
                }

                // Tolak jika durasi sudah habis (+ toleransi 10 detik untuk latency)
                $durasiDetik = $question->subtest->duration * 60;
                $terpakai    = now()->diffInSeconds($sessionSubtest->started_at);
                if ($terpakai > ($durasiDetik + 10)) {
                    return response()->json(['message' => 'Waktu subtes telah habis.'], 403);
                }
            }
        }

        TryoutAnswer::updateOrCreate(
            [
                'tryout_session_id'  => $session->id,
                'tryout_question_id' => $request->tryout_question_id,
            ],
            [
                'answer'      => $request->answer ? strtoupper($request->answer) : null,
                'is_doubtful' => $request->boolean('is_doubtful', false),
            ]
        );

        return response()->json(['success' => true]);
    }

    // =========================================================
    //  4. SELESAIKAN SUBTES
    // =========================================================

    public function finishSubtest(Request $request, $session_subtest_id)
    {
        $sessionSubtest = TryoutSessionSubtest::findOrFail($session_subtest_id);

        $session = TryoutSession::where('id', $sessionSubtest->tryout_session_id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        if (! $sessionSubtest->finished_at) {
            $sessionSubtest->update(['finished_at' => now()]);
        }

        $currentSubtest = TryoutSubtest::find($sessionSubtest->tryout_subtest_id);

        return $this->redirectToNextSubtest($currentSubtest, $session->id);
    }

    // =========================================================
    //  5. SUBMIT EXAM AKHIR
    // =========================================================

    public function submitExam(Request $request, $session_id)
    {
        $session = TryoutSession::where('id', $session_id)
            ->where('user_id', Auth::id())
            ->with('tryout.subtests.questions')
            ->firstOrFail();

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
     * Acak array menggunakan seed deterministik.
     * Soal yang sama akan selalu muncul dalam urutan yang sama
     * untuk session yang sama, bahkan setelah refresh.
     *
     * @param  array   $ids
     * @param  int     $seed  - tryout_session->id
     * @return array
     */
    private function seededShuffle(array $ids, int $seed): array
    {
        // Simpan state RNG global agar tidak mengacaukan fungsi lain
        $state = mt_rand(); // baca state saat ini (tidak dipakai, hanya placeholder)
        mt_srand($seed);

        $count = count($ids);
        for ($i = $count - 1; $i > 0; $i--) {
            $j          = mt_rand(0, $i);
            [$ids[$i], $ids[$j]] = [$ids[$j], $ids[$i]];
        }

        // Reset ke seed acak agar tidak mempengaruhi operasi lain
        mt_srand();

        return $ids;
    }

    /**
     * Cari subtes selanjutnya; jika tidak ada → submit & tampilkan hasil.
     */
    private function redirectToNextSubtest(TryoutSubtest $currentSubtest, ?int $sessionId = null)
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

        if ($sessionId) {
            return redirect()->route('tryout.exam.submit', $sessionId);
        }

        return redirect()->route('tryout.index')->with('success', 'Semua subtes selesai!');
    }
}