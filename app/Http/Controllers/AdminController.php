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
use Illuminate\Support\Str;
use App\Models\Subtest;
use App\Models\TryoutQuestion;
use App\Models\TryoutSubtest;
use Illuminate\Support\Facades\DB;
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
        $sort      = in_array($request->get('sort', 'batch_name'), ['batch_name', 'is_active', 'created_at'], true)
                        ? $request->get('sort', 'batch_name') : 'batch_name';
        $direction = in_array($request->get('direction', 'desc'), ['asc', 'desc'], true)
                        ? $request->get('direction', 'desc') : 'desc';
        $tryouts = Tryout::query()
            ->with('subtests')
            ->withCount('subtests')
            ->when($search, fn ($q, $s) => $q->where('batch_name', 'like', "%{$s}%"))
            ->orderBy($sort, $direction)
            ->paginate(12)
            ->withQueryString();
            
        // Provide standard subtests config for the frontend if they want to create a new batch
        $standardSubtests = [
            ['name' => 'Penalaran Umum', 'duration' => 30, 'order' => 1],
            ['name' => 'Pengetahuan & Pemahaman Umum', 'duration' => 15, 'order' => 2],
            ['name' => 'Pengetahuan Kuantitatif', 'duration' => 20, 'order' => 3],
            ['name' => 'Literasi Bahasa Indonesia', 'duration' => 42.5, 'order' => 4],
            ['name' => 'Literasi Bahasa Inggris', 'duration' => 20, 'order' => 5],
            ['name' => 'Pemahaman Bacaan dan Menulis', 'duration' => 25, 'order' => 6],
            ['name' => 'Penalaran Matematika', 'duration' => 42.5, 'order' => 7],
        ];

        return Inertia::render('Admin/Tryouts/Index', [
            'tryouts' => $tryouts,
            'filters' => compact('sort', 'direction', 'search'),
            'standardSubtests' => $standardSubtests,
        ]);
    }

    public function tryoutsStore(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'batch_name'  => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_active'   => ['boolean'],
            'started_at'  => ['nullable', 'date'],
            'ended_at'    => ['nullable', 'date'],
            'subtests'    => ['required', 'array'],
            'subtests.*.name' => ['required', 'string'],
            'subtests.*.duration' => ['required', 'numeric'],
            'subtests.*.order' => ['required', 'numeric'],
            'subtests.*.file' => ['nullable', 'file', 'mimes:csv,txt'],
        ]);

        DB::transaction(function () use ($validated) {
            $tryout = Tryout::create([
                'batch_name'  => $validated['batch_name'],
                'description' => $validated['description'] ?? null,
                'is_active'   => $validated['is_active'] ?? true,
                'started_at'  => $validated['started_at'] ?? null,
                'ended_at'    => $validated['ended_at'] ?? null,
            ]);

            foreach ($validated['subtests'] as $subtestData) {
                $subtest = TryoutSubtest::create([
                    'tryout_id' => $tryout->id,
                    'name'      => $subtestData['name'],
                    'duration'  => $subtestData['duration'],
                    'order'     => $subtestData['order'],
                ]);

                if (isset($subtestData['file'])) {
                    $this->importSoal($subtest->id, $subtestData['file']);
                }
            }
        });

        return back()->with('success', 'Tryout berhasil ditambahkan.');
    }

    public function tryoutsUpdate(Request $request, Tryout $tryout): RedirectResponse
    {
        $validated = $request->validate([
            'batch_name'  => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_active'   => ['boolean'],
            'started_at'  => ['nullable', 'date'],
            'ended_at'    => ['nullable', 'date'],
            'subtests'    => ['required', 'array'],
            'subtests.*.id'   => ['nullable', 'exists:tryout_subtests,id'],
            'subtests.*.name' => ['required', 'string'],
            'subtests.*.duration' => ['required', 'numeric'],
            'subtests.*.order' => ['required', 'numeric'],
            'subtests.*.file' => ['nullable', 'file', 'mimes:csv,txt'],
        ]);

        DB::transaction(function () use ($validated, $tryout) {
            $tryout->update([
                'batch_name'  => $validated['batch_name'],
                'description' => $validated['description'] ?? null,
                'is_active'   => $validated['is_active'] ?? true,
                'started_at'  => $validated['started_at'] ?? null,
                'ended_at'    => $validated['ended_at'] ?? null,
            ]);

            $keepSubtestIds = [];

            foreach ($validated['subtests'] as $subtestData) {
                if (!empty($subtestData['id'])) {
                    $subtest = TryoutSubtest::find($subtestData['id']);
                    if ($subtest) {
                        $subtest->update([
                            'name'     => $subtestData['name'],
                            'duration' => $subtestData['duration'],
                            'order'    => $subtestData['order'],
                        ]);
                        $keepSubtestIds[] = $subtest->id;
                    }
                } else {
                    $subtest = TryoutSubtest::create([
                        'tryout_id' => $tryout->id,
                        'name'      => $subtestData['name'],
                        'duration'  => $subtestData['duration'],
                        'order'     => $subtestData['order'],
                    ]);
                    $keepSubtestIds[] = $subtest->id;
                }

                if (isset($subtestData['file']) && isset($subtest)) {
                    TryoutQuestion::where('tryout_subtest_id', $subtest->id)->delete();
                    $this->importSoal($subtest->id, $subtestData['file']);
                }
            }

            TryoutSubtest::where('tryout_id', $tryout->id)
                ->whereNotIn('id', $keepSubtestIds)
                ->delete();
        });

        return back()->with('success', 'Tryout berhasil diperbarui.');
    }

    public function tryoutsDestroy(Tryout $tryout): RedirectResponse
    {
        try {
            DB::transaction(function () use ($tryout) {
                $tryout->delete();
            });
            return back()->with('success', 'Tryout berhasil dihapus.');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menghapus Tryout. Mungkin ada data terkait yang menghalangi penghapusan.');
        }
    }

    // ─── Helper Methods untuk Import CSV ───────────────────────────────────────

    private function importSoal(int $subtestId, \Illuminate\Http\UploadedFile $file): void
    {
        $handle = fopen($file->getRealPath(), 'r');
        if ($handle === false) return;

        $bom = fread($handle, 3);
        if ($bom !== "\xEF\xBB\xBF") {
            rewind($handle);
        }

        $isFirstLine = true;
        while (($row = fgetcsv($handle, 0, ',', '"', '\\')) !== false) {
            if ($isFirstLine) {
                $isFirstLine = false;
                continue;
            }

            if (empty(array_filter($row, fn($cell) => trim($cell) !== ''))) continue;
            if (count($row) < 8) continue;

            $questionText   = $this->cleanCsvText($row[0]);
            $questionImage  = $this->parseCsvImage($row[1] ?? '');
            $optionA        = $this->cleanCsvText($row[2]);
            $optionB        = $this->cleanCsvText($row[3]);
            $optionC        = $this->cleanCsvText($row[4]);
            $optionD        = $this->cleanCsvText($row[5]);
            $optionE        = $this->cleanCsvText($row[6]);
            $correctAnswer  = $this->parseCsvCorrectAnswer($row[7] ?? '');
            $scoreWeight    = $this->parseCsvScoreWeight($row[8] ?? '');
            $discussion     = $this->cleanCsvText($row[9] ?? '');

            if (empty($questionText) || !in_array($correctAnswer, ['A', 'B', 'C', 'D', 'E'])) continue;
            if (empty($optionA) || empty($optionB) || empty($optionC) || empty($optionD) || empty($optionE)) continue;

            TryoutQuestion::create([
                'tryout_subtest_id' => $subtestId,
                'question_text'     => $questionText,
                'question_image'    => $questionImage,
                'option_a'          => $optionA,
                'option_b'          => $optionB,
                'option_c'          => $optionC,
                'option_d'          => $optionD,
                'option_e'          => $optionE,
                'correct_answer'    => $correctAnswer,
                'score_weight'      => $scoreWeight,
                'discussion'        => $discussion ?: null,
            ]);
        }
        fclose($handle);
    }

    private function cleanCsvText(string $text): string
    {
        $text = trim($text);
        $text = str_replace('US$', 'USD ', $text);
        $text = str_replace('Rp.', 'Rp', $text);
        return $text;
    }

    private function parseCsvImage(string $value): ?string
    {
        $cleaned = trim($value);
        if ($cleaned === '' || $cleaned === '-' || $cleaned === 'null' || $cleaned === 'NULL') return null;
        if (str_starts_with($cleaned, 'soal/')) return $cleaned;
        return 'soal/' . $cleaned;
    }

    private function parseCsvCorrectAnswer(string $value): string
    {
        $cleaned = strtoupper(trim($value));
        if (preg_match('/[A-E]/', $cleaned, $matches)) return $matches[0];
        return $cleaned;
    }

    private function parseCsvScoreWeight(string $value): int
    {
        $trimmed = trim($value);
        if ($trimmed === '' || !is_numeric($trimmed)) return 1;
        $int = (int) $trimmed;
        return $int > 0 ? $int : 1;
    }
}