<?php

namespace App\Http\Controllers;

use App\Models\Tryout;
use App\Models\TryoutSubtest;
use App\Models\TryoutSession;
use App\Models\TryoutSessionSubtest;
use App\Models\TryoutAnswer;
use App\Models\TryoutQuestion;
use App\Models\StudyProgramDescription;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TryoutController extends Controller
{
    // =========================================================
    //  1. HALAMAN UTAMA — Daftar Tryout & Riwayat
    // =========================================================

    public function index()
    {
        $user = Auth::user();

        // Ambil semua tryout aktif beserta info batch
        $activeTryouts = Tryout::query()->where('is_active', true)
            ->withCount('subtests')
            ->orderBy('batch', 'desc')
            ->get()
            ->map(function ($tryout) use ($user) {
                $firstSubtest = $tryout->subtests()->orderBy('order', 'asc')->first();
                $tryout->first_subtest_id = $firstSubtest?->id;

                // Cek apakah user sudah punya sesi selesai di batch ini
                $finishedSession = TryoutSession::query()->where('user_id', $user->id)
                    ->where('tryout_id', $tryout->id)
                    ->whereNotNull('finished_at')
                    ->latest()
                    ->first();

                // Cek apakah ada sesi yang sedang berjalan (belum selesai)
                $activeSession = TryoutSession::query()->where('user_id', $user->id)
                    ->where('tryout_id', $tryout->id)
                    ->whereNull('finished_at')
                    ->latest()
                    ->first();

                $tryout->is_completed_by_user = (bool) $finishedSession;
                $tryout->has_active_session   = (bool) $activeSession;

                // User selalu bisa mulai/mengulang tryout
                $tryout->can_start = true;

                return $tryout;
            });

        // Riwayat: SEMUA sesi user (termasuk yang belum selesai)
        // Ini memperbaiki bug #4: sesi yang ditinggalkan sekarang muncul di riwayat
        $history = TryoutSession::with(['tryout', 'choice1', 'choice2'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($session) {
                // Tambah info status untuk frontend
                $session->status = $session->finished_at ? 'selesai' : 'belum_selesai';

                // Jika belum selesai, hitung progress
                if (!$session->finished_at) {
                    $totalSubtests = $session->tryout?->subtests()->count() ?? 0;
                    $completedSubtests = $session->sessionSubtests()
                        ->whereNotNull('finished_at')
                        ->count();

                    $lastSessionSubtest = $session->sessionSubtests()
                        ->whereNull('finished_at')
                        ->first();

                    $session->completed_subtests = $completedSubtests;
                    $session->total_subtests = $totalSubtests;
                    $session->last_subtest_id = $lastSessionSubtest?->tryout_subtest_id;
                }

                return $session;
            });

        // Daftar prodi untuk pemilihan jurusan
        $studyPrograms = StudyProgramDescription::select('id', 'name', 'passing_grade_min', 'passing_grade_max')
            ->orderBy('name')
            ->get();

        return Inertia::render('Tryout/Index', [
            'activeTryouts'  => $activeTryouts,
            'history'        => $history,
            'studyPrograms'  => $studyPrograms,
        ]);
    }

    // =========================================================
    //  2. TAMPILKAN HALAMAN UJIAN — 1 Soal per Halaman
    // =========================================================

    /**
     * GET /tryout/{tryout_id}/subtest/{subtest_id}
     */
    public function showSubtest(Request $request, $tryout_id, $subtest_id)
    {
        $user    = Auth::user();
        $subtest = TryoutSubtest::with('tryout')->findOrFail($subtest_id);

        abort_if($subtest->tryout_id != $tryout_id, 404);

        // -- Sesi Tryout --
        // Cek apakah ada sesi yang belum selesai (bisa dilanjutkan)
        $session = TryoutSession::query()->where('user_id', $user->id)
            ->where('tryout_id', $tryout_id)
            ->whereNull('finished_at')
            ->latest()
            ->first();

        // VALIDASI: Jika ada sesi yang sudah selesai, redirect ke hasil
        $completedSession = TryoutSession::query()->where('user_id', $user->id)
            ->where('tryout_id', $tryout_id)
            ->whereNotNull('finished_at')
            ->latest()
            ->first();

        if ($completedSession && !$session) {
            return redirect()->route('tryout.index')
                ->with('success', 'Tryout sudah diselesaikan. Lihat hasil di riwayat.');
        }

        // Jika tidak ada sesi aktif, buat sesi baru
        // (sesi lama yang sudah selesai dibiarkan sebagai riwayat)
        if (!$session) {
            $session = TryoutSession::create([
                'user_id'          => $user->id,
                'tryout_id'        => $tryout_id,
                'started_at'       => now(),
                'study_program_id' => $user->study_program_id ?? 1,
            ]);
        }

        // -------------------------------------------------------
        //  VALIDASI URUTAN SUBTEST (Anti-skip)
        // -------------------------------------------------------
        $previousSubtests = TryoutSubtest::query()->where('tryout_id', $tryout_id)
            ->where('order', '<', $subtest->order)
            ->orderBy('order', 'asc')
            ->get();

        foreach ($previousSubtests as $prev) {
            $prevSession = TryoutSessionSubtest::query()->where('tryout_session_id', $session->id)
                ->where('tryout_subtest_id', $prev->id)
                ->first();

            if (! $prevSession || ! $prevSession->finished_at) {
                return redirect()->route('tryout.index')
                    ->with('error', 'Selesaikan subtes sebelumnya terlebih dahulu sebelum melanjutkan.');
            }
        }

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

        // Pastikan sisaWaktu selalu integer (fix bug decimal)
        $sisaWaktu = (int) floor($sisaWaktu);

        if ($sisaWaktu <= 0) {
            $sessionSubtest->update(['finished_at' => now()]);
            return $this->redirectToNextSubtest($subtest, $session->id);
        }

        // -- Soal diacak dengan SEED = session->id (deterministik per user) --
        $allIdsSorted = $subtest->questions()->orderBy('id')->pluck('id')->toArray();
        $allIds       = $this->seededShuffle($allIdsSorted, $session->id);

        $page      = max(1, (int) ($request->page ?? 1));
        $total     = count($allIds);
        $currentId = $allIds[$page - 1] ?? null;

        $question  = $currentId ? TryoutQuestion::query()->find($currentId) : null;
        $questions = new \Illuminate\Pagination\LengthAwarePaginator(
            $question ? [$question] : [],
            $total,
            1,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        $savedAnswer = $currentId
            ? TryoutAnswer::query()->where('tryout_session_id', $session->id)
                ->where('tryout_question_id', $currentId)
                ->first()
            : null;

        // Ambil semua jawaban + status is_doubtful untuk minimap
        $allAnswersRaw = TryoutAnswer::query()->where('tryout_session_id', $session->id)
            ->whereIn('tryout_question_id', $allIds)
            ->get();

        $allAnswers = $allAnswersRaw->pluck('answer', 'tryout_question_id');
        $allDoubtful = $allAnswersRaw->where('is_doubtful', true)
            ->pluck('tryout_question_id')
            ->values()
            ->toArray();

        $isLastSubtest = !TryoutSubtest::where('tryout_id', $tryout_id)
            ->where('order', '>', $subtest->order)
            ->exists();

        return Inertia::render('Tryout/Exam', [
            'session'        => $session,
            'subtest'        => $subtest,
            'sessionSubtest' => $sessionSubtest,
            'questions'      => $questions,
            'savedAnswer'    => $savedAnswer,
            'allQuestionIds' => $allIds,
            'allAnswers'     => $allAnswers,
            'allDoubtful'    => $allDoubtful,
            'sisaWaktu'      => $sisaWaktu,
            'isLastSubtest'  => $isLastSubtest,
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

        return DB::transaction(function () use ($request) {
            $session = TryoutSession::where('id', $request->tryout_session_id)
                ->where('user_id', Auth::id())
                ->firstOrFail();

            // VALIDASI: Jika sesi sudah selesai, tolak penyimpanan jawaban
            if ($session->finished_at) {
                return response()->json(['message' => 'Sesi ujian telah selesai.'], 403);
            }

            // -- Validasi waktu server (anti-cheat, toleransi 2 detik) --
            $question = TryoutQuestion::with('subtest')->find($request->tryout_question_id);
            if ($question) {
                $sessionSubtest = TryoutSessionSubtest::where('tryout_session_id', $session->id)
                    ->where('tryout_subtest_id', $question->tryout_subtest_id)
                    ->first();

                if ($sessionSubtest) {
                    if ($sessionSubtest->finished_at !== null) {
                        return response()->json(['message' => 'Subtes telah selesai.'], 403);
                    }

                    $durasiDetik = $question->subtest->duration * 60;
                    $terpakai    = now()->diffInSeconds($sessionSubtest->started_at);

                    if ($terpakai > ($durasiDetik + 2)) {
                        $sessionSubtest->update(['finished_at' => now()]);

                        Log::warning('TryoutController@storeAnswer: waktu habis, subtes ditutup paksa', [
                            'user_id'            => Auth::id(),
                            'session_id'         => $session->id,
                            'session_subtest_id' => $sessionSubtest->id,
                            'terpakai_detik'     => $terpakai,
                            'durasi_detik'       => $durasiDetik,
                        ]);

                        return response()->json(['message' => 'Waktu habis, subtes ditutup.'], 403);
                    }
                }
            }

            $answer = TryoutAnswer::updateOrCreate(
                [
                    'tryout_session_id'  => $session->id,
                    'tryout_question_id' => $request->tryout_question_id,
                ],
                [
                    'answer'      => $request->answer ? strtoupper($request->answer) : null,
                    'is_doubtful' => $request->boolean('is_doubtful', false),
                ]
            );

            // Kembalikan data lengkap agar frontend bisa update state
            return response()->json([
                'success'     => true,
                'answer'      => $answer->answer,
                'is_doubtful' => $answer->is_doubtful,
                'question_id' => $answer->tryout_question_id,
            ]);
        });
    }

    // =========================================================
    //  4. SELESAIKAN SUBTES
    // =========================================================

    public function finishSubtest(Request $request, $session_subtest_id)
    {
        return DB::transaction(function () use ($session_subtest_id) {
            $sessionSubtest = TryoutSessionSubtest::findOrFail($session_subtest_id);

            $session = TryoutSession::where('id', $sessionSubtest->tryout_session_id)
                ->where('user_id', Auth::id())
                ->firstOrFail();

            // Guard: Jika sesi sudah selesai, redirect ke index
            if ($session->finished_at) {
                return redirect()->route('tryout.index')
                    ->with('success', 'Tryout sudah diselesaikan.');
            }

            if (! $sessionSubtest->finished_at) {
                $sessionSubtest->update(['finished_at' => now()]);
            }

            $currentSubtest = TryoutSubtest::find($sessionSubtest->tryout_subtest_id);

            return $this->redirectToNextSubtest($currentSubtest, $session->id);
        });
    }

    // =========================================================
    //  5. SIMPAN PILIHAN JURUSAN (sebelum mulai tryout)
    // =========================================================

    public function storeChoices(Request $request)
    {
        $request->validate([
            'tryout_id'   => 'required|exists:tryouts,id',
            'choice_1_id' => 'required|exists:study_program_descriptions,id',
            'choice_2_id' => 'required|exists:study_program_descriptions,id|different:choice_1_id',
        ]);

        $user = Auth::user();

        // Gunakan sesi yang belum selesai, atau buat baru (izinkan retry)
        $session = TryoutSession::where('user_id', $user->id)
            ->where('tryout_id', $request->tryout_id)
            ->whereNull('finished_at')
            ->latest()
            ->first();

        if (!$session) {
            $session = TryoutSession::create([
                'user_id'          => $user->id,
                'tryout_id'        => $request->tryout_id,
                'started_at'       => now(),
                'study_program_id' => $user->study_program_id ?? 1,
            ]);
        }

        $session->update([
            'choice_1_id' => $request->choice_1_id,
            'choice_2_id' => $request->choice_2_id,
        ]);

        // Redirect ke subtest pertama
        $tryout = Tryout::findOrFail($request->tryout_id);
        $firstSubtest = $tryout->subtests()->orderBy('order', 'asc')->first();

        if ($firstSubtest) {
            return redirect()->route('tryout.subtest.show', [
                'tryout_id'  => $tryout->id,
                'subtest_id' => $firstSubtest->id,
            ]);
        }

        return redirect()->route('tryout.index')
            ->with('error', 'Tryout ini belum memiliki subtes.');
    }

    // =========================================================
    //  6. SUBMIT EXAM AKHIR + KALKULASI PASSING GRADE
    // =========================================================

    public function submitExam(Request $request, $session_id)
    {
        $session = TryoutSession::where('id', $session_id)
            ->where('user_id', Auth::id())
            ->with('tryout.subtests.questions')
            ->firstOrFail();

        if ($session->finished_at) {
            return redirect()->route('tryout.index')
                ->with('success', 'Tryout sudah diselesaikan. Lihat hasil di riwayat.');
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

                    if ($jawaban && strtoupper($jawaban->answer ?? '') === strtoupper($question->correct_answer)) {
                        $subtestScore += $question->score_weight;
                    }
                }

                $scoreDetails[$subtest->name] = $subtestScore;
                $totalScore += $subtestScore;
            }

            // ─── LOGIKA KELULUSAN PASSING GRADE ──────────────────
            $admissionStatus  = 'Tidak Lulus';
            $admittedProgram  = null;

            if ($session->choice_1_id) {
                $choice1 = StudyProgramDescription::find($session->choice_1_id);
                $choice2 = $session->choice_2_id
                    ? StudyProgramDescription::find($session->choice_2_id)
                    : null;

                $passChoice1 = $choice1 && $this->checkPassingGrade($totalScore, $choice1);
                $passChoice2 = $choice2 && $this->checkPassingGrade($totalScore, $choice2);

                // Aturan: jika lulus di kedua jurusan, prioritaskan Pilihan 1
                if ($passChoice1) {
                    $admissionStatus = 'Lulus';
                    $admittedProgram = $choice1->name;
                } elseif ($passChoice2) {
                    $admissionStatus = 'Lulus';
                    $admittedProgram = $choice2->name;
                }
            }

            $session->update([
                'finished_at'      => now(),
                'status'           => 'completed',
                'total_score'      => $totalScore,
                'score_details'    => $scoreDetails,
                'admission_status' => $admissionStatus,
                'admitted_program' => $admittedProgram,
            ]);
        });

        return redirect()->route('tryout.index')
            ->with('success', 'Tryout berhasil diselesaikan! Lihat hasil di riwayat pengerjaan.');
    }

    // =========================================================
    //  7. TUNDA EXAM (Simpan progress, izinkan navigasi)
    // =========================================================

    public function suspendExam(Request $request)
    {
        $request->validate([
            'session_id' => 'required|exists:tryout_sessions,id',
        ]);

        // Jawaban sudah auto-saved melalui storeAnswer,
        // jadi kita hanya perlu memberi respons OK.
        // Sesi TIDAK ditandai finished_at sehingga bisa dilanjutkan.
        return response()->json(['success' => true, 'message' => 'Progres tersimpan.']);
    }

    // =========================================================
    //  8. HALAMAN HASIL
    // =========================================================

    public function showResult($session_id)
    {
        $session = TryoutSession::where('id', $session_id)
            ->where('user_id', Auth::id())
            ->with(['tryout', 'answers.question', 'choice1', 'choice2'])
            ->firstOrFail();

        return Inertia::render('Tryout/Result', [
            'session' => $session,
        ]);
    }

    // =========================================================
    //  HELPER PRIVATE
    // =========================================================

    /**
     * Cek apakah skor memenuhi passing grade program studi.
     * Menggunakan passing_grade_min sebagai batas bawah.
     */
    private function checkPassingGrade(int $score, StudyProgramDescription $program): bool
    {
        // Jika ada passing_grade_min numerik, gunakan itu
        if ($program->passing_grade_min !== null) {
            return $score >= $program->passing_grade_min;
        }

        // Fallback: parse passing_grade string (misal: "650" atau "650-700")
        if ($program->passing_grade) {
            $pgValue = (float) preg_replace('/[^0-9.]/', '', $program->passing_grade);
            return $pgValue > 0 && $score >= $pgValue;
        }

        // Jika tidak ada passing grade, anggap lulus
        return true;
    }

    /**
     * Acak array menggunakan seed deterministik.
     */
    private function seededShuffle(array $ids, int $seed): array
    {
        mt_srand($seed);

        $count = count($ids);
        for ($i = $count - 1; $i > 0; $i--) {
            $j          = mt_rand(0, $i);
            [$ids[$i], $ids[$j]] = [$ids[$j], $ids[$i]];
        }

        mt_srand();

        return $ids;
    }

    /**
     * Cari subtes selanjutnya; jika tidak ada → submit & tampilkan hasil.
     *
     * FIX: Menggunakan redirect ke GET route (tryout.index) dengan auto-submit
     * alih-alih redirect ke POST route yang tidak bisa di-redirect.
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

        // Semua subtest selesai — auto-submit skor
        if ($sessionId) {
            $session = TryoutSession::with('tryout.subtests.questions')->find($sessionId);

            // Guard: Jika session sudah selesai, langsung ke index
            if ($session && $session->finished_at) {
                return redirect()->route('tryout.index')
                    ->with('success', 'Tryout sudah diselesaikan.');
            }

            if ($session && !$session->finished_at) {
                DB::transaction(function () use ($session) {
                    $totalScore   = 0;
                    $scoreDetails = [];

                    foreach ($session->tryout->subtests as $subtest) {
                        $subtestScore = 0;

                        foreach ($subtest->questions as $question) {
                            $jawaban = TryoutAnswer::where('tryout_session_id', $session->id)
                                ->where('tryout_question_id', $question->id)
                                ->first();

                            if ($jawaban && strtoupper($jawaban->answer ?? '') === strtoupper($question->correct_answer)) {
                                $subtestScore += $question->score_weight;
                            }
                        }

                        $scoreDetails[$subtest->name] = $subtestScore;
                        $totalScore += $subtestScore;
                    }

                    // Logika kelulusan
                    $admissionStatus = 'Tidak Lulus';
                    $admittedProgram = null;

                    if ($session->choice_1_id) {
                        $choice1 = StudyProgramDescription::find($session->choice_1_id);
                        $choice2 = $session->choice_2_id
                            ? StudyProgramDescription::find($session->choice_2_id)
                            : null;

                        $passChoice1 = $choice1 && $this->checkPassingGrade($totalScore, $choice1);
                        $passChoice2 = $choice2 && $this->checkPassingGrade($totalScore, $choice2);

                        if ($passChoice1) {
                            $admissionStatus = 'Lulus';
                            $admittedProgram = $choice1->name;
                        } elseif ($passChoice2) {
                            $admissionStatus = 'Lulus';
                            $admittedProgram = $choice2->name;
                        }
                    }

                    $session->update([
                        'finished_at'      => now(),
                        'status'           => 'completed',
                        'total_score'      => $totalScore,
                        'score_details'    => $scoreDetails,
                        'admission_status' => $admissionStatus,
                        'admitted_program' => $admittedProgram,
                    ]);
                });
            }

            return redirect()->route('tryout.index')
                ->with('success', 'Semua subtes selesai! Lihat hasil di riwayat pengerjaan.');
        }

        return redirect()->route('tryout.index')->with('success', 'Semua subtes selesai!');
    }
}