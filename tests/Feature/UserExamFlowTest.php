<?php

use App\Models\StudyProgramDescription;
use App\Models\Subtest;
use App\Models\Survey;
use App\Models\Tryout;
use App\Models\TryoutQuestion;
use App\Models\TryoutSession;
use App\Models\TryoutSessionSubtest;
use App\Models\TryoutSubtest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

beforeEach(function () {
    \App\Models\StudyProgram::factory()->create(['id' => 1]);
    $this->user = User::factory()->create(['role' => 'user']);
});

test('user can start dat test and submit answers', function () {
    $survey = Survey::factory()->create([
        'category' => 'Numerik',
        'correct_answer' => 'A',
        'item_weight' => 5
    ]);

    // Akses halaman mulai tes
    $response = $this->actingAs($this->user)->get('/jurusan/test');
    $response->assertStatus(200);

    // Submit jawaban
    $response = $this->actingAs($this->user)->post('/jurusan/test', [
        'answers' => [
            $survey->id => 'A'
        ]
    ]);

    $response->assertRedirect('/jurusan');
    $response->assertSessionHas('test_results');

    $this->assertDatabaseHas('user_survey_responses', [
        'user_id' => $this->user->id,
        'survey_id' => $survey->id,
        'is_correct' => 1
    ]);
});

test('user can init tryout session and cannot restart if already completed', function () {
    $tryout = Tryout::create(['batch_name' => 'Batch 1', 'is_active' => true]);
    $subtest1 = TryoutSubtest::create(['tryout_id' => $tryout->id, 'name' => 'Subtes 1', 'duration' => 30, 'order' => 1]);

    // Simulasi menyimpan pilihan jurusan
    $program = StudyProgramDescription::create(['name' => 'IT']);
    $program2 = StudyProgramDescription::create(['name' => 'SI']);
    
    $response = $this->actingAs($this->user)->post('/tryout/choices', [
        'tryout_id' => $tryout->id,
        'choice_1_id' => $program->id,
        'choice_2_id' => $program2->id,
    ]);

    $response->assertRedirect();
    
    // Pastikan session terbentuk dengan started_at terisi
    $session = TryoutSession::where('user_id', $this->user->id)->first();
    expect($session)->not->toBeNull();
    expect($session->started_at)->not->toBeNull();

    // Selesaikan sesi
    $session->update(['finished_at' => now(), 'status' => 'completed']);

    // Coba mulai subtes jika sudah selesai (harus redirect / block)
    $response = $this->actingAs($this->user)->get("/tryout/{$tryout->id}/subtest/{$subtest1->id}");
    $response->assertRedirect('/tryout');
    $response->assertSessionHas('success');
});

test('user can save answer to storeAnswer endpoint with doubtful status', function () {
    $tryout = Tryout::create(['batch_name' => 'Batch 1', 'is_active' => true]);
    $subtest = TryoutSubtest::create(['tryout_id' => $tryout->id, 'name' => 'Subtes 1', 'duration' => 30, 'order' => 1]);
    $question = TryoutQuestion::create([
        'tryout_subtest_id' => $subtest->id,
        'question_text' => 'Test',
        'option_a' => 'A', 'option_b' => 'B', 'option_c' => 'C', 'option_d' => 'D', 'option_e' => 'E',
        'correct_answer' => 'A',
        'score_weight' => 10
    ]);

    $session = TryoutSession::create(['user_id' => $this->user->id, 'tryout_id' => $tryout->id, 'started_at' => now(), 'study_program_id' => 1]);
    TryoutSessionSubtest::create(['tryout_session_id' => $session->id, 'tryout_subtest_id' => $subtest->id, 'started_at' => now()]);

    $response = $this->actingAs($this->user)->postJson('/tryout/answer', [
        'tryout_session_id' => $session->id,
        'tryout_question_id' => $question->id,
        'answer' => 'A',
        'is_doubtful' => true,
    ]);

    $response->assertStatus(200);
    $response->assertJson(['success' => true]);

    $this->assertDatabaseHas('tryout_answers', [
        'tryout_session_id' => $session->id,
        'tryout_question_id' => $question->id,
        'answer' => 'A',
        'is_doubtful' => 1
    ]);
});

test('user cannot skip subtest and timeout is validated', function () {
    $tryout = Tryout::create(['batch_name' => 'Batch 1', 'is_active' => true]);
    $subtest1 = TryoutSubtest::create(['tryout_id' => $tryout->id, 'name' => 'Subtes 1', 'duration' => 30, 'order' => 1]);
    $subtest2 = TryoutSubtest::create(['tryout_id' => $tryout->id, 'name' => 'Subtes 2', 'duration' => 30, 'order' => 2]);
    $question = TryoutQuestion::create([
        'tryout_subtest_id' => $subtest1->id, 'question_text' => 'T', 'option_a' => 'A', 'option_b' => 'B', 'option_c' => 'C', 'option_d' => 'D', 'option_e' => 'E', 'correct_answer' => 'A', 'score_weight' => 1
    ]);

    $session = TryoutSession::create(['user_id' => $this->user->id, 'tryout_id' => $tryout->id, 'started_at' => now(), 'study_program_id' => 1]);
    
    // Coba skip subtest 1, langsung akses subtest 2
    $response = $this->actingAs($this->user)->get("/tryout/{$tryout->id}/subtest/{$subtest2->id}");
    $response->assertRedirect('/tryout');
    $response->assertSessionHas('error');

    // Mulai subtest 1 secara normal
    $sessionSubtest = TryoutSessionSubtest::create(['tryout_session_id' => $session->id, 'tryout_subtest_id' => $subtest1->id, 'started_at' => now()->subMinutes(31)]);

    // Simulasikan mencoba menjawab setelah waktu lewat
    $response = $this->actingAs($this->user)->postJson('/tryout/answer', [
        'tryout_session_id' => $session->id,
        'tryout_question_id' => $question->id,
        'answer' => 'B',
    ]);

    $response->assertStatus(403); // Status ditolak karena waktu habis
    $sessionSubtest->refresh();
    expect($sessionSubtest->finished_at)->not->toBeNull();
});

test('user can submit the last subtest and complete the tryout', function () {
    $tryout = Tryout::create(['batch_name' => 'Batch 1', 'is_active' => true]);
    $subtest = TryoutSubtest::create(['tryout_id' => $tryout->id, 'name' => 'Penalaran Matematika', 'duration' => 30, 'order' => 1]);
    
    $session = TryoutSession::create(['user_id' => $this->user->id, 'tryout_id' => $tryout->id, 'started_at' => now(), 'study_program_id' => 1]);
    $sessionSubtest = TryoutSessionSubtest::create(['tryout_session_id' => $session->id, 'tryout_subtest_id' => $subtest->id, 'started_at' => now()]);

    $response = $this->actingAs($this->user)->post("/tryout/session/{$session->id}/submit");
    $response->assertRedirect('/tryout');
    $response->assertSessionHas('success');

    $session->refresh();
    expect($session->finished_at)->not->toBeNull();
});
