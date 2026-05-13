import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    BookOpen,
    ClipboardList,
    GraduationCap,
    Rocket,
    Users,
} from 'lucide-react';

const sections = [
    {
        title: 'Manajemen Tryout',
        description: 'Atur paket tryout, subtest, dan jadwal.',
        icon: Rocket,
        href: '#',
        comingSoon: true,
    },
    {
        title: 'Manajemen Jurusan',
        description: 'Kelola data jurusan & rekomendasi.',
        icon: GraduationCap,
        href: route('admin.majors.index'),
        comingSoon: false,

    },
    {
        title: 'Manajemen Materi',
        description: 'Tambah & kurasi materi belajar.',
        icon: BookOpen,
        href: '#',
        comingSoon: true,
    },
    {
        title: 'Manajemen Tes DAT',
        description: 'Kelola bank soal & kategori DAT.',
        icon: ClipboardList,
        href: route('admin.dat-tests.index'),
        comingSoon: false,
    },
    {
        title: 'Manajemen Pengguna',
        description: 'Pantau akun & atur role pengguna.',
        icon: Users,
        href: route('admin.users.index'),
        comingSoon: false,
    },
];

export default function AdminDashboard() {
    return (
        <AuthenticatedLayout>
            <Head title="Admin Dashboard" />

            <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-white">
                        Admin Dashboard
                    </h1>
                    <p className="mt-2 text-sm text-white/70">
                        Pusat kendali NEXA untuk mengelola konten, soal, dan
                        pengguna.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <Link
                                key={section.title}
                                href={section.href}
                                onClick={(event) =>
                                    section.comingSoon && event.preventDefault()
                                }
                                className={
                                    'group relative overflow-hidden rounded-2xl border border-white/10 bg-space-mid/50 p-6 text-white backdrop-blur-md transition hover:border-indigo-400/40 hover:bg-space-mid/70 ' +
                                    (section.comingSoon
                                        ? 'cursor-not-allowed opacity-70'
                                        : '')
                                }
                            >
                                <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl" />
                                <div className="flex items-start justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-200">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    {section.comingSoon && (
                                        <span className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-200">
                                            Under Construction
                                        </span>
                                    )}
                                </div>
                                <div className="mt-5">
                                    <h2 className="text-lg font-semibold">
                                        {section.title}
                                    </h2>
                                    <p className="mt-2 text-sm text-white/70">
                                        {section.description}
                                    </p>
                                </div>
                                <div className="mt-6 text-sm text-indigo-200/80 group-hover:text-indigo-200">
                                    {section.comingSoon
                                        ? 'Segera hadir'
                                        : 'Buka modul →'}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
