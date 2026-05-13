<?php
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProdiController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SubtestController;
use App\Http\Controllers\SurveyTestController;
use App\Http\Controllers\TryoutController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ==========================================
// RUTE PUBLIK (BISA DIAKSES TANPA LOGIN)
// ==========================================
//dashboard
Route::get('/', function () {
    if (Auth::check() && Auth::user()->role === 'admin') {
        return redirect()->route('admin.dashboard');
    }

    return Inertia::render('Dashboard', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('dashboard');

// ulasan prodi
Route::get('/prodi', [ProdiController::class, 'index'])->name('prodi.index');
Route::get('/prodi/{id}', [ProdiController::class, 'show'])->name('prodi.show');
// Belajar
Route::get('/subtests', [SubtestController::class, 'index'])->name('subtests.index');

// ==========================================
// RUTE Admin (BISA DIAKSES KHUSUS ADMIN)
// ==========================================


Route::middleware(['auth', 'verified'])->group(function () {
    // ==========================================
    // RUTE USER (BISA DIAKSES KHUSUS USER)
    // ==========================================
    Route::middleware(['user'])->group(function(){
        // kesesuaian jurusan
        Route::get('/jurusan', [SurveyTestController::class, 'index'])->name('jurusan.index');
        Route::get('/jurusan/test', [SurveyTestController::class, 'showTest'])->name('jurusan.test');
        Route::post('/jurusan/test', [SurveyTestController::class, 'submit'])->name('jurusan.test.submit');
        
        
        //5. tryout
        Route::prefix('tryout')->name('tryout.')->group(function () {
            Route::get('/', [TryoutController::class, 'index'])->name('index');
            Route::get('/{tryout_id}/subtest/{subtest_id}', [TryoutController::class, 'showSubtest'])->name('subtest.show');
            Route::post('/answer', [TryoutController::class, 'storeAnswer'])->name('answer.store');
            Route::post('/subtest-finish/{session_subtest_id}', [TryoutController::class, 'finishSubtest'])->name('subtest.finish');
        });
    });
    Route::prefix('admin')->name('admin.')->middleware(['admin'])->group(function () {
        Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');

        // Manajemen Tes DAT
        Route::get('/dat-tests', [AdminController::class, 'datTestsIndex'])->name('dat-tests.index');
        Route::post('/dat-tests', [AdminController::class, 'datTestsStore'])->name('dat-tests.store');
        Route::put('/dat-tests/{dat_test}', [AdminController::class, 'datTestsUpdate'])->name('dat-tests.update');
        Route::delete('/dat-tests/{dat_test}', [AdminController::class, 'datTestsDestroy'])->name('dat-tests.destroy');

        // Manajemen Pengguna
        Route::get('/users', [AdminController::class, 'usersIndex'])->name('users.index');
        Route::put('/users/{user}', [AdminController::class, 'usersUpdateRole'])->name('users.update-role');
        Route::delete('/users/{user}', [AdminController::class, 'usersDestroy'])->name('users.destroy');

        // TODO: Fitur Belum Selesai (Under Construction) - Manajemen Tryout
        Route::get('/tryouts', [AdminController::class, 'tryoutsIndex'])->name('tryouts.index');
        Route::post('/tryouts', [AdminController::class, 'tryoutsStore'])->name('tryouts.store');
        Route::put('/tryouts/{tryout}', [AdminController::class, 'tryoutsUpdate'])->name('tryouts.update');
        Route::delete('/tryouts/{tryout}', [AdminController::class, 'tryoutsDestroy'])->name('tryouts.destroy');

        // Manajemen Data Jurusan
        Route::get('/majors', [AdminController::class, 'majorsIndex'])->name('majors.index');
        Route::post('/majors', [AdminController::class, 'majorsStore'])->name('majors.store');
        Route::put('/majors/{major}', [AdminController::class, 'majorsUpdate'])->name('majors.update');
        Route::delete('/majors/{major}', [AdminController::class, 'majorsDestroy'])->name('majors.destroy');

        // Manajemen Materi Belajar
        Route::get('/study-materials', [AdminController::class, 'studyMaterialsIndex'])->name('study-materials.index');
        Route::post('/study-materials', [AdminController::class, 'studyMaterialsStore'])->name('study-materials.store');
        Route::put('/study-materials/{material}', [AdminController::class, 'studyMaterialsUpdate'])->name('study-materials.update');
        Route::delete('/study-materials/{material}', [AdminController::class, 'studyMaterialsDestroy'])->name('study-materials.destroy');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

