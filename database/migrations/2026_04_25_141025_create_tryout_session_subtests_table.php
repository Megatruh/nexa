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
        Schema::create('table_tryout_session_subtests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tryout_session_id')->constrained()->cascadeOnDelete();
            // $table->foreignId('tryout_subtest_id')->constrained()->cascadeOnDelete();
            $table->dateTime('started_at');
            $table->dateTime('finished_at')->nullable(); // Terisi saat user klik "Selesai Subtes" atau waktu habis
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('table_tryout_session_subtests');
    }
};
