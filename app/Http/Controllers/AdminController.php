<?php

namespace App\Http\Controllers;

use App\Models\StudyProgramDescription;
use App\Models\Survey;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function dashboard(): Response
    {
        return Inertia::render('AdminDashboard');
    }

    public function datTestsIndex(Request $request): Response
    {
        $allowedSorts = ['category', 'question'];
        $sort = $request->get('sort', 'category');
        $direction = $request->get('direction', 'asc');

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
            ->orderBy($sort, $direction)
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Admin/DatTest/Index', [
            'questions' => $questions,
            'filters' => [
                'sort' => $sort,
                'direction' => $direction,
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

        if (!in_array($sort, $allowedSorts, true)) {
            $sort = 'created_at';
        }

        if (!in_array($direction, ['asc', 'desc'], true)) {
            $direction = 'desc';
        }

        $users = User::query()
            ->select(['id', 'name', 'email', 'role', 'created_at'])
            ->orderBy($sort, $direction)
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => [
                'sort' => $sort,
                'direction' => $direction,
            ],
        ]);
    }

    public function majorsIndex(Request $request): Response
    {
        $allowedSorts = [
            'name',
            'accreditation',
            'rating',
            'passing_grade',
            'capacity',
            'enthusiasts',
        ];
        $sort = $request->get('sort', 'name');
        $direction = $request->get('direction', 'asc');

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
                'passing_grade',
                'description',
            ])
            ->orderBy($sort, $direction)
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Admin/Majors/Index', [
            'majors' => $majors,
            'filters' => [
                'sort' => $sort,
                'direction' => $direction,
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
