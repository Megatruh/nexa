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

class AdminController extends Controller
{
    public function dashboard(): Response
    {
        $stats = [
            'totalUsers'        => User::count(),
            'totalDatQuestions'  => Survey::count(),
            'totalMajors'       => StudyProgramDescription::count(),
            'totalMaterials'    => LearningMaterial::count(),
            'totalTryouts'      => Tryout::count(),
        ];

        return Inertia::render('AdminDashboard', [
            'stats' => $stats,
        ]);
    }

    public function datTestsIndex(Request $request): Response
    {
        $allowedSorts = ['category', 'question'];
        $sort = $request->get('sort', 'category');
        $direction = $request->get('direction', 'asc');
        $search = $request->get('search');

        if (!in_array($sort, $allowedSorts, true)) {
            $sort = 'category';
        }

        if (!in_array($direction, ['asc', 'desc'], true)) {
            $direction = 'asc';
        }

        $questions = Survey::query()
            ->select([
                'id',
                'question',
                'option_a',
                'option_b',
                'option_c',
                'option_d',
                'category',
            ])
            ->when($search, function ($query, $search) {
                $query->where('question', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%");
            })
            ->orderBy($sort, $direction)
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Admin/DatTest/Index', [
            'questions' => $questions,
            'filters' => [
                'sort' => $sort,
                'direction' => $direction,
                'search' => $search,
            ],
        ]);
    }

    public function datTestsStore(Request $request): RedirectResponse
    {
        // TODO: implement create DAT question
        return back()->with('success', 'Soal berhasil ditambahkan.');
    }

    public function datTestsUpdate(Request $request, string $datTest): RedirectResponse
    {
        // TODO: implement update DAT question
        return back()->with('success', 'Soal berhasil diperbarui.');
    }

    public function datTestsDestroy(string $datTest): RedirectResponse
    {
        // TODO: implement delete DAT question
        return back()->with('success', 'Soal berhasil dihapus.');
    }

    public function usersIndex(Request $request): Response
    {
        $allowedSorts = ['name', 'role', 'created_at'];
        $sort = $request->get('sort', 'created_at');
        $direction = $request->get('direction', 'desc');
        $search = $request->get('search');

        if (!in_array($sort, $allowedSorts, true)) {
            $sort = 'created_at';
        }

        if (!in_array($direction, ['asc', 'desc'], true)) {
            $direction = 'desc';
        }

        $users = User::query()
            ->select(['id', 'name', 'email', 'role', 'created_at'])
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->orderBy($sort, $direction)
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => [
                'sort' => $sort,
                'direction' => $direction,
                'search' => $search,
            ],
        ]);
    }

    public function majorsIndex(Request $request): Response
    {
        $allowedSorts = [
            'name',
            'accreditation',
            'rating',
            'passing_grade_min',
            'passing_grade_max',
            'capacity',
            'enthusiasts',
        ];
        $sort = $request->get('sort', 'name');
        $direction = $request->get('direction', 'asc');
        $search = $request->get('search');

        if (!in_array($sort, $allowedSorts, true)) {
            $sort = 'name';
        }

        if (!in_array($direction, ['asc', 'desc'], true)) {
            $direction = 'asc';
        }

        $majors = StudyProgramDescription::query()
            ->select([
                'id',
                'name',
                'accreditation',
                'rating',
                'capacity',
                'enthusiasts',
                'passing_grade_min',
                'passing_grade_max',
                'description',
            ])
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->orderBy($sort, $direction)
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Admin/Majors/Index', [
            'majors' => $majors,
            'filters' => [
                'sort' => $sort,
                'direction' => $direction,
                'search' => $search,
            ],
        ]);
    }

    public function majorsStore(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'passing_grade' => ['nullable', 'string', 'max:255'],
            'career_prospects' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'accreditation' => ['nullable', 'string', 'max:255'],
            'ukt_range' => ['nullable', 'string', 'max:255'],
            'enthusiasts' => ['nullable', 'integer', 'min:0'],
            'related_subjects' => ['nullable', 'string'],
            'capacity' => ['nullable', 'integer', 'min:0'],
        ]);

        StudyProgramDescription::create($validated);

        return back()->with('success', 'Jurusan berhasil ditambahkan.');
    }

    public function majorsUpdate(
        Request $request,
        StudyProgramDescription $major
    ): RedirectResponse {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'passing_grade' => ['nullable', 'string', 'max:255'],
            'career_prospects' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'accreditation' => ['nullable', 'string', 'max:255'],
            'ukt_range' => ['nullable', 'string', 'max:255'],
            'enthusiasts' => ['nullable', 'integer', 'min:0'],
            'related_subjects' => ['nullable', 'string'],
            'capacity' => ['nullable', 'integer', 'min:0'],
        ]);

        $major->update($validated);

        return back()->with('success', 'Jurusan berhasil diperbarui.');
    }

    public function majorsDestroy(StudyProgramDescription $major): RedirectResponse
    {
        $major->delete();

        return back()->with('success', 'Jurusan berhasil dihapus.');
    }

    public function studyMaterialsIndex(): Response
    {
        return Inertia::render('Admin/StudyMaterials/Index');
    }

    public function studyMaterialsStore(Request $request): RedirectResponse
    {
        return back()->with('success', 'Materi belajar berhasil ditambahkan.');
    }

    public function studyMaterialsUpdate(Request $request, string $studyMaterial): RedirectResponse
    {
        return back()->with('success', 'Materi belajar berhasil diperbarui.');
    }

    public function studyMaterialsDestroy(string $studyMaterial): RedirectResponse
    {
        return back()->with('success', 'Materi belajar berhasil dihapus.');
    }

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

    public function usersUpdateRole(Request $request, string $user): RedirectResponse
    {
        // TODO: implement role update
        return back()->with('success', 'Role pengguna berhasil diperbarui.');
    }

    public function usersDestroy(string $user): RedirectResponse
    {
        // TODO: implement delete user
        return back()->with('success', 'Pengguna berhasil dihapus.');
    }
}
