<?php

namespace App\Http\Controllers;

use App\Models\Subtest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;



class SubtestController extends Controller
{
    /**
     * Menampilkan daftar semua subtest.
     */
    public function index(): Response
    {
        // Ambil data subtest beserta jumlah soal dan materinya
        $subtests = Subtest::withCount(['questions', 'learningMaterials'])->get();

        // Kirim data ke file React di resources/js/Pages/Subtests/Index.jsx
        return Inertia::render('Subtests/index', [
            'subtests' => $subtests,
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }
}