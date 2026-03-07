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
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('subtests_id');
            $table->foreign('subtests_id')->references('id')->on('subtests');
            $table->text('question_text');
            $table->string('image_path')->nullable(); // Menambahkan kolom untuk menyimpan path gambar
            $table->string('option_a');
            $table->string('option_b');
            $table->string('option_c');
            $table->string('option_d');
            $table->string('option_e');
            $table->enum('correct_option',['A','B','C','D','E']);
            $table->integer('weight')->default(10); //bobot soal
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
