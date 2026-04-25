<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Hapus 'table_' menjadi 'tryout_subtests'
        Schema::create('tryout_subtests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tryout_id')->constrained()->cascadeOnDelete();
            $table->string('name'); 
            $table->integer('duration'); 
            $table->integer('order'); 
            $table->timestamps();
        });
    }

    public function down(): void
    {
        // Sesuaikan juga di sini
        Schema::dropIfExists('tryout_subtests');
    }
};