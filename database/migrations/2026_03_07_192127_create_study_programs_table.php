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
        Schema::create('study_programs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('weight_num');
            $table->integer('weight_abst');
            $table->integer('weight_verb');
            // $table->integer('passing_grade_avg');
            $table->timestamps();
        });

        Schema::create('study_program_descriptions', function (Blueprint $table) {
            $table->id();
            $table->string('name');                          // Kolom 0: nama
            $table->string('passing_grade')->nullable();     // Kolom 1: passinggrade
            $table->text('career_prospects')->nullable();    // Kolom 2: prospek_kerja
            $table->text('description')->nullable();         // Kolom 3: deskripsi
            $table->decimal('rating', 3, 1)->nullable();     // Kolom 4: rating (contoh: 4.8)
            $table->string('accreditation')->nullable();     // Kolom 5: grade_jurusan (A/Unggul)
            $table->string('ukt_range')->nullable();         // Kolom 6: range_ukt
            $table->integer('enthusiasts')->default(0);      // Kolom 7: peminat_2025
            $table->string('related_subjects')->nullable();  // Kolom 8: mapel_terkait
            $table->integer('capacity')->default(0);         // Kolom 9: daya_tampung
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('study_programs');
        Schema::dropIfExists('study_program_descriptions');
    }
};
