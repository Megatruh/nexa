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
        Schema::create('tryout_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tryout_session_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tryout_question_id')->constrained()->cascadeOnDelete();
            $table->char('answer', 1)->nullable(); // Jawaban user ('A', 'B', dll)
            //$table->boolean('is_doubtful')->default(false); // Fitur ragu-ragu
            $table->timestamps();
            
            // Mencegah duplikasi jawaban untuk soal yang sama di sesi yang sama
            $table->unique(['tryout_session_id', 'tryout_question_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('table_tryout_answers');
    }
};
