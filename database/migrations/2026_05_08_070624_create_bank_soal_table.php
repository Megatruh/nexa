<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bank_soal', function (Blueprint $table) {
            $table->id();
            $table->string('mata_pelajaran');
            $table->string('topik')->nullable();
            $table->integer('nomor_soal')->nullable();
            $table->longText('pertanyaan');
            $table->text('opsi_a')->nullable();
            $table->text('opsi_b')->nullable();
            $table->text('opsi_c')->nullable();
            $table->text('opsi_d')->nullable();
            $table->text('opsi_e')->nullable();
            $table->char('kunci_jawaban', 10)->nullable();
            $table->longText('pembahasan')->nullable();
            $table->timestamps();
            $table->index('mata_pelajaran');
            $table->index('topik');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bank_soal');
    }
};