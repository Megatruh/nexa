<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_survey_responses', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // Relasi ke tabel user
            $table->foreignId('survey_id')->constrained(); // Relasi ke soal
            $table->char('user_answer', 1); // Jawaban A, B, C, atau D
            $table->boolean('is_correct')->default(false); // Untuk memudahkan skoring nanti
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_survey_responses');
    }
};
