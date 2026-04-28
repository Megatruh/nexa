<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Hapus 'table_' menjadi 'tryout_questions'
        Schema::create('tryout_questions', function (Blueprint $table) {
            $table->id();
            // Sekarang ini akan otomatis mengarah ke tabel 'tryout_subtests' yang benar
            $table->foreignId('tryout_subtest_id')->constrained()->cascadeOnDelete();
            $table->longText('question_text');
            $table->string('question_image')->nullable();
            $table->text('option_a');
            $table->text('option_b');
            $table->text('option_c');
            $table->text('option_d');
            $table->text('option_e');
            $table->char('correct_answer', 1); 
            $table->integer('score_weight'); 
            $table->longText('discussion')->nullable(); 
            $table->timestamps();
        });
    }

    public function down(): void
    {
        // Sesuaikan juga di sini
        Schema::dropIfExists('tryout_questions');
    }
};