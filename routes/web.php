<?php
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SubtestController;
use Inertia\Inertia;

// ==========================================
// RUTE PUBLIK (BISA DIAKSES TANPA LOGIN)
// ==========================================
//dashboard
Route::get('/', function () {
    return Inertia::render('Dashboard', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('dashboard');

// Ulasan Prodi
Route::get('/prodi', function(){
    return Inertia::render('Prodi/Index');
})->name('prodi.index');

// Belajar
Route::get('/subtests', [SubtestController::class, 'index'])->name('subtests.index');

Route::middleware(['auth', 'verified'])->group(function () {
    // ==========================================
    // RUTE Admin (BISA DIAKSES KHUSUS ADMIN)
    // ==========================================
    Route::middleware(['admin'])->group(function(){
        //dashboard admin
        Route::get('/admin/dashboard', function(){
            return Inertia::render('Admin/Dashboard');
        })->name('admin.dashboard');

        Route::get('/admin/kelola-soal', function () {
            return Inertia::render('Admin/KelolaSoal'); // Pastikan file JSX-nya nanti dibuat
        })->name('manage.questions');

        Route::get('/admin/kelola-pengguna', function () {
            return Inertia::render('Admin/KelolaPengguna'); // Pastikan file JSX-nya nanti dibuat
        })->name('manage.users');
    });

    // ==========================================
    // RUTE USER (BISA DIAKSES KHUSUS USER)
    // ==========================================
    Route::middleware(['user'])->group(function(){
        // kesesuaian jurusan
        Route::get('/jurusan', function(){
            return Inertia::render('Jurusan/Index');
        })->name('jurusan.index');
        
        //5. tryout
        Route::get('/tryout', function(){
            return Inertia::render('Tryout/Index');
        })->name('tryout.index');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

