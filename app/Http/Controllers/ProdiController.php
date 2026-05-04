<?php

namespace App\Http\Controllers;

use App\Models\StudyProgramDescription;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProdiController extends Controller
{
    public function index(Request $request)
    {
        // Fitur pencarian data
        $query = StudyProgramDescription::query();
        
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Ambil data dengan pagination (12 data per halaman)
        $prodis = $query->paginate(9)->withQueryString();

        return Inertia::render('Prodi/Index', [
            'prodis' => $prodis,
            'filters' => $request->only(['search'])
        ]);
    }

    // Fungsi show (untuk halaman detail nanti)
    public function show($id)
    {
        $prodi = StudyProgramDescription::findOrFail($id);
        return Inertia::render('Prodi/Show', ['prodi' => $prodi]);
    }
}