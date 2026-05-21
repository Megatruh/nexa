<?php
namespace App\Http\Controllers;
use App\Models\LearningMaterial;
use App\Models\StudyProgramDescription;
use App\Models\Survey;
use App\Models\Tryout;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;   // ← DIPERBAIKI: "Iluminate" → "Illuminate"
use App\Models\Subtest;
class AdminController extends Controller
{
    public function dashboard(): Response
    {
        $stats = [
            'totalUsers'        => User::count(),
            'totalDatQuestions' => Survey::count(),
            'totalMajors'       => StudyProgramDescription::count(),
            'totalMaterials'    => LearningMaterial::count(),
            'totalTryouts'      => Tryout::count(),
        ];
        return Inertia::render('AdminDashboard', [
            'stats' => $stats,
        ]);
    }
    // =========================================================================
    // DAT TESTS
    // =========================================================================
    public function datTestsIndex(Request $request): Response
    {
        $allowedSorts = ['category', 'question'];
        $sort         = $request->get('sort', 'category');
        $direction    = $request->get('direction', 'asc');
        $search       = $request->get('search');
        if (!in_array($sort, $allowedSorts, true))          $sort = 'category';
        if (!in_array($direction, ['asc', 'desc'], true))   $direction = 'asc';
        $questions = Survey::query()
            ->select(['id', 'question', 'option_a', 'option_b', 'option_c', 'option_d', 'category'])
            ->when($search, fn ($q, $s) => $q->where('question', 'like', "%{$s}%")
                                             ->orWhere('category', 'like', "%{$s}%"))
            ->orderBy($sort, $direction)
            ->paginate(12)
            ->withQueryString();
        return Inertia::render('Admin/DatTest/Index', [
            'questions' => $questions,
            'filters'   => compact('sort', 'direction', 'search'),
        ]);
    }
    public function datTestsStore(Request $request): RedirectResponse
    {
        return back()->with('success', 'Soal berhasil ditambahkan.');
    }
    public function datTestsUpdate(Request $request, string $datTest): RedirectResponse
    {
        return back()->with('success', 'Soal berhasil diperbarui.');
    }
    public function datTestsDestroy(string $datTest): RedirectResponse
    {
        return back()->with('success', 'Soal berhasil dihapus.');
    }
    // =========================================================================
    // USERS
    // =========================================================================
    public function usersIndex(Request $request): Response
    {
        $allowedSorts = ['name', 'role', 'created_at'];
        $sort         = $request->get('sort', 'created_at');
        $direction    = $request->get('direction', 'desc');
        $search       = $request->get('search');
        if (!in_array($sort, $allowedSorts, true))          $sort = 'created_at';
        if (!in_array($direction, ['asc', 'desc'], true))   $direction = 'desc';
        $users = User::query()
            ->select(['id', 'name', 'email', 'role', 'created_at'])
            ->when($search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%")
                                             ->orWhere('email', 'like', "%{$s}%"))
            ->orderBy($sort, $direction)
            ->paginate(12)
            ->withQueryString();
        return Inertia::render('Admin/Users/Index', [
            'users'   => $users,
            'filters' => compact('sort', 'direction', 'search'),
        ]);
    }
    public function usersUpdateRole(Request $request, string $user): RedirectResponse
    {
        return back()->with('success', 'Role pengguna berhasil diperbarui.');
    }
    public function usersDestroy(string $user): RedirectResponse
    {
        return back()->with('success', 'Pengguna berhasil dihapus.');
    }
    // =========================================================================
    // MAJORS
    // =========================================================================
    public function majorsIndex(Request $request): Response
    {
        $allowedSorts = ['name', 'accreditation', 'rating', 'passing_grade_min', 'passing_grade_max', 'capacity', 'enthusiasts'];
        $sort         = $request->get('sort', 'name');
        $direction    = $request->get('direction', 'asc');
        $search       = $request->get('search');
        if (!in_array($sort, $allowedSorts, true))          $sort = 'name';
        if (!in_array($direction, ['asc', 'desc'], true))   $direction = 'asc';
        $majors = StudyProgramDescription::query()
            ->select(['id', 'name', 'accreditation', 'rating', 'capacity', 'enthusiasts',
                      'passing_grade_min', 'passing_grade_max', 'description'])
            ->when($search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%")
                                             ->orWhere('description', 'like', "%{$s}%"))
            ->orderBy($sort, $direction)
            ->paginate(12)
            ->withQueryString();
        return Inertia::render('Admin/Majors/Index', [
            'majors'  => $majors,
            'filters' => compact('sort', 'direction', 'search'),
        ]);
    }
    public function majorsStore(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'              => ['required', 'string', 'max:255'],
            'passing_grade_min' => ['nullable', 'string', 'max:255'],
            'passing_grade_max' => ['nullable', 'string', 'max:255'],
            'career_prospects'  => ['nullable', 'string'],
            'description'       => ['nullable', 'string'],
            'rating'            => ['nullable', 'numeric', 'min:0', 'max:5'],
            'accreditation'     => ['nullable', 'string', 'max:255'],
            'ukt_range'         => ['nullable', 'string', 'max:255'],
            'enthusiasts'       => ['nullable', 'integer', 'min:0'],
            'related_subjects'  => ['nullable', 'string'],
            'capacity'          => ['nullable', 'integer', 'min:0'],
        ]);
        StudyProgramDescription::create($validated);
        return back()->with('success', 'Jurusan berhasil ditambahkan.');
    }
    public function majorsUpdate(Request $request, StudyProgramDescription $major): RedirectResponse
    {
        $validated = $request->validate([
            'name'             => ['required', 'string', 'max:255'],
            'passing_grade'    => ['nullable', 'string', 'max:255'],
            'career_prospects' => ['nullable', 'string'],
            'description'      => ['nullable', 'string'],
            'rating'           => ['nullable', 'numeric', 'min:0', 'max:5'],
            'accreditation'    => ['nullable', 'string', 'max:255'],
            'ukt_range'        => ['nullable', 'string', 'max:255'],
            'enthusiasts'      => ['nullable', 'integer', 'min:0'],
            'related_subjects' => ['nullable', 'string'],
            'capacity'         => ['nullable', 'integer', 'min:0'],
        ]);
        $major->update($validated);
        return back()->with('success', 'Jurusan berhasil diperbarui.');
    }
    public function majorsDestroy(StudyProgramDescription $major): RedirectResponse
    {
        $major->delete();
        return back()->with('success', 'Jurusan berhasil dihapus.');
    }
    // =========================================================================
    // STUDY MATERIALS
    // =========================================================================
    public function studyMaterialsIndex(Request $request): Response
    {
        $allowedSorts = ['title', 'type', 'created_at'];
        $sort         = $request->get('sort', 'created_at');
        $direction    = $request->get('direction', 'desc');
        $search       = $request->get('search');
        $filterType   = $request->get('type'); // 'materi' | 'latsol' | null
        if (!in_array($sort, $allowedSorts, true))         $sort = 'created_at';
        if (!in_array($direction, ['asc', 'desc'], true))  $direction = 'desc';
        $materials = LearningMaterial::query()
            ->with('subtest:id,name')
            ->when($search,     fn ($q, $s) => $q->where('title', 'like', "%{$s}%"))
            ->when($filterType, fn ($q, $t) => $q->where('type', $t))
            ->orderBy($sort, $direction)
            ->paginate(12)
            ->withQueryString();
        // Kirim juga daftar subtest agar dropdown pada form tersedia
        $subtests = Subtest::select('id', 'name')->orderBy('name')->get();
        return Inertia::render('Admin/StudyMaterials/Index', [
            'materials' => $materials,
            'subtests'  => $subtests,
            'filters'   => compact('sort', 'direction', 'search', 'filterType'),
        ]);
    }
    public function studyMaterialsStore(Request $request): RedirectResponse
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'type'        => 'required|in:materi,latsol',
            'subtest_id'  => 'required|exists:subtests,id',
            'file_path'   => 'required|file|mimes:pdf|max:10240', // max 10 MB
        ]);
        $subtest    = Subtest::findOrFail($request->subtest_id);
        $folderName = Str::slug($subtest->name);
        // Simpan PDF ke storage/app/public/materials/
        $path = $request->file('file_path')->store("materials/{$folderName}", 'public');
        LearningMaterial::create([
            'title'       => $request->title,
            'description' => $request->description,
            'type'        => $request->type,
            'subtest_id'  => $request->subtest_id,
            'file_path'   => $path,
        ]);
        return redirect()->back()->with('success', 'Materi PDF berhasil ditambahkan.');
    }
    public function studyMaterialsUpdate(Request $request, LearningMaterial $material): RedirectResponse
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'type'        => 'required|in:materi,latsol',
            'subtest_id'  => 'required|exists:subtests,id',
            'file_path'   => 'nullable|file|mimes:pdf|max:10240',
        ]);
        // Jika ada file baru, hapus file lama dan simpan file baru
        if ($request->hasFile('file_path')) {
            // Hapus file lama
            if ($material->file_path && \Illuminate\Support\Facades\Storage::disk('public')->exists($material->file_path)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($material->file_path);
            }
            $subtest    = Subtest::findOrFail($request->subtest_id);
            $folderName = Str::slug($subtest->name);
            $newPath    = $request->file('file_path')->store("materials/{$folderName}", 'public');
            $material->update([
                'title'       => $request->title,
                'description' => $request->description,
                'type'        => $request->type,
                'subtest_id'  => $request->subtest_id,
                'file_path'   => $newPath,
            ]);
        } else {
            $material->update([
                'title'       => $request->title,
                'description' => $request->description,
                'type'        => $request->type,
                'subtest_id'  => $request->subtest_id,
            ]);
        }
        return back()->with('success', 'Materi belajar berhasil diperbarui.');
    }
    public function studyMaterialsDestroy(LearningMaterial $material): RedirectResponse
    {
        // Hapus file PDF dari storage
        if ($material->file_path && \Illuminate\Support\Facades\Storage::disk('public')->exists($material->file_path)) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($material->file_path);
        }
        $material->delete();
        return back()->with('success', 'Materi belajar berhasil dihapus.');
    }
    // =========================================================================
    // TRYOUTS
    // =========================================================================
    public function tryoutsIndex(Request $request): Response
    {
        $search    = $request->get('search');
        $sort      = in_array($request->get('sort', 'title'), ['title', 'is_active', 'created_at'], true)
                        ? $request->get('sort', 'title') : 'title';
        $direction = in_array($request->get('direction', 'asc'), ['asc', 'desc'], true)
                        ? $request->get('direction', 'asc') : 'asc';
        $tryouts = Tryout::query()
            ->withCount('subtests')
            ->when($search, fn ($q, $s) => $q->where('title', 'like', "%{$s}%"))
            ->orderBy($sort, $direction)
            ->paginate(12)
            ->withQueryString();
        return Inertia::render('Admin/Tryouts/Index', [
            'tryouts' => $tryouts,
            'filters' => compact('sort', 'direction', 'search'),
        ]);
    }
    public function tryoutsStore(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_active'   => ['boolean'],
        ]);
        Tryout::create($validated);
        return back()->with('success', 'Tryout berhasil ditambahkan.');
    }
    public function tryoutsUpdate(Request $request, Tryout $tryout): RedirectResponse
    {
        $validated = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_active'   => ['boolean'],
        ]);
        $tryout->update($validated);
        return back()->with('success', 'Tryout berhasil diperbarui.');
    }
    public function tryoutsDestroy(Tryout $tryout): RedirectResponse
    {
        $tryout->delete();
        return back()->with('success', 'Tryout berhasil dihapus.');
    }
}