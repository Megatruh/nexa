<?php

use App\Models\StudyProgramDescription;
use App\Models\Tryout;
use App\Models\TryoutQuestion;
use App\Models\TryoutSession;
use App\Models\TryoutAnswer;
use App\Models\TryoutSubtest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(Tests\TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    \App\Models\StudyProgram::factory()->create(['id' => 1]);
});

test('exam calculation correctly applies passing grade logic and priority', function () {
    $user = User::factory()->create();
    
    $choice1 = StudyProgramDescription::create([
        'name' => 'Kedokteran',
        'passing_grade_min' => '700'
    ]);
    
    $choice2 = StudyProgramDescription::create([
        'name' => 'Teknik Sipil',
        'passing_grade_min' => '500'
    ]);
    
    $tryout = Tryout::create(['batch_name' => 'Batch 1', 'is_active' => true]);
    $subtest = TryoutSubtest::create(['tryout_id' => $tryout->id, 'name' => 'Test', 'duration' => 30, 'order' => 1]);
    
    // We create a question with weight 750 so user can score 750 by answering correctly.
    $question = TryoutQuestion::create([
        'tryout_subtest_id' => $subtest->id,
        'question_text' => 'Q',
        'option_a' => 'A', 'option_b' => 'B', 'option_c' => 'C', 'option_d' => 'D', 'option_e' => 'E',
        'correct_answer' => 'A',
        'score_weight' => 750
    ]);
    
    $session = TryoutSession::create([
        'user_id' => $user->id,
        'tryout_id' => $tryout->id,
        'choice_1_id' => $choice1->id,
        'choice_2_id' => $choice2->id,
        'started_at' => now(),
        'study_program_id' => 1
    ]);
    
    // User answers correctly, total score will be 750.
    TryoutAnswer::create([
        'tryout_session_id' => $session->id,
        'tryout_question_id' => $question->id,
        'answer' => 'A'
    ]);

    // Submit exam
    $response = $this->actingAs($user)->post("/tryout/session/{$session->id}/submit");
    $response->assertRedirect('/tryout');
    
    $session->refresh();
    
    // Total score is 750.
    // Choice 1 requires 700. Choice 2 requires 500.
    // Both are passed, but priority goes to Choice 1.
    expect((int)$session->total_score)->toBe(750);
    expect($session->admission_status)->toBe('Lulus');
    expect($session->admitted_program)->toBe('Kedokteran');
});

test('exam calculation falls back to second choice if first choice fails', function () {
    $user = User::factory()->create();
    
    $choice1 = StudyProgramDescription::create([
        'name' => 'Kedokteran',
        'passing_grade_min' => '700'
    ]);
    
    $choice2 = StudyProgramDescription::create([
        'name' => 'Teknik Sipil',
        'passing_grade_min' => '500'
    ]);
    
    $tryout = Tryout::create(['batch_name' => 'Batch 1', 'is_active' => true]);
    $subtest = TryoutSubtest::create(['tryout_id' => $tryout->id, 'name' => 'Test', 'duration' => 30, 'order' => 1]);
    
    $question = TryoutQuestion::create([
        'tryout_subtest_id' => $subtest->id,
        'question_text' => 'Q',
        'option_a' => 'A', 'option_b' => 'B', 'option_c' => 'C', 'option_d' => 'D', 'option_e' => 'E',
        'correct_answer' => 'A',
        'score_weight' => 600
    ]);
    
    $session = TryoutSession::create([
        'user_id' => $user->id,
        'tryout_id' => $tryout->id,
        'choice_1_id' => $choice1->id,
        'choice_2_id' => $choice2->id,
        'started_at' => now(),
        'study_program_id' => 1
    ]);
    
    TryoutAnswer::create([
        'tryout_session_id' => $session->id,
        'tryout_question_id' => $question->id,
        'answer' => 'A'
    ]);

    $response = $this->actingAs($user)->post("/tryout/session/{$session->id}/submit");
    
    $session->refresh();
    
    // Total score is 600.
    // Fails Choice 1 (700), passes Choice 2 (500).
    expect((int)$session->total_score)->toBe(600);
    expect($session->admission_status)->toBe('Lulus');
    expect($session->admitted_program)->toBe('Teknik Sipil');
});
