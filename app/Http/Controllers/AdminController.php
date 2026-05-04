<?php

namespace App\Http\Controllers;

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

    public function datTestsIndex(): Response
    {
        return Inertia::render('Admin/DatTest/Index');
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

    public function usersIndex(): Response
    {
        return Inertia::render('Admin/Users/Index');
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
