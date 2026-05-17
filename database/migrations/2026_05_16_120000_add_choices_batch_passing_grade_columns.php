<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Migrasi untuk:
     * 1. Menambah kolom pilihan jurusan (choice_1_id, choice_2_id) & hasil kelulusan
     *    di tabel tryout_sessions
     * 2. Menambah kolom passing_grade_min & passing_grade_max
     *    di tabel study_program_descriptions
     * 3. Menambah kolom batch di tabel tryouts untuk pembatasan akses per gelombang
     */
    public function up(): void
    {
        // 1. Kolom pilihan jurusan & hasil kelulusan di tryout_sessions
        Schema::table('tryout_sessions', function (Blueprint $table) {
            $table->unsignedBigInteger('choice_1_id')->nullable()->after('study_program_id');
            $table->unsignedBigInteger('choice_2_id')->nullable()->after('choice_1_id');
            $table->string('admission_status')->nullable()->after('score_details');  // Lulus / Tidak Lulus
            $table->string('admitted_program')->nullable()->after('admission_status'); // Nama prodi yang diterima

            $table->foreign('choice_1_id')->references('id')->on('study_program_descriptions')->nullOnDelete();
            $table->foreign('choice_2_id')->references('id')->on('study_program_descriptions')->nullOnDelete();
        });

        // 2. Passing grade numerik (min & max) di study_program_descriptions
        Schema::table('study_program_descriptions', function (Blueprint $table) {
            $table->integer('passing_grade_min')->nullable()->after('name');
            $table->integer('passing_grade_max')->nullable()->after('passing_grade_min');
            $table->dropColumn('passing_grade');
        });

        // 3. Kolom batch di tryouts untuk pembatasan akses per gelombang
        Schema::table('tryouts', function (Blueprint $table) {
            $table->unsignedInteger('batch')->default(1)->after('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('tryout_sessions', function (Blueprint $table) {
            $table->dropForeign(['choice_1_id']);
            $table->dropForeign(['choice_2_id']);
            $table->dropColumn(['choice_1_id', 'choice_2_id', 'admission_status', 'admitted_program']);
        });

        Schema::table('study_program_descriptions', function (Blueprint $table) {
            $table->string('passing_grade')->nullable()->after('name');
            $table->dropColumn(['passing_grade_min', 'passing_grade_max']);
        });

        Schema::table('tryouts', function (Blueprint $table) {
            $table->dropColumn('batch');
        });
    }
};
