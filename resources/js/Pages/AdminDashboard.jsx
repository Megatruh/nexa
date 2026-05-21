import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    BookOpen,
    ClipboardList,
    GraduationCap,
    Rocket,
    Users,
    TrendingUp,
    Sparkles,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

/* ───────────────── Animated Counter Hook ───────────────── */
function useCountUp(target, duration = 1200) {
    const [count, setCount] = useState(0);
    const hasRun = useRef(false);
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasRun.current) {
                    hasRun.current = true;
                    const start = performance.now();
                    const step = (now) => {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const ease = 1 - Math.pow(2, -10 * progress);
                        
                        if (progress < 1) {
                            setCount(Math.floor(ease * target));
                            requestAnimationFrame(step);
                        } else {
                            setCount(target);
                        }
                    };
                    requestAnimationFrame(step);
                }
            },
            { threshold: 0.3 },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [target, duration]);

    // Reset state jika target berubah secara dinamis
    useEffect(() => {
        setCount(0);
        hasRun.current = false;
    }, [target]);

    return { count, ref };
}

/* ───────────────── Quick Stat Card (Tier 1) ───────────────── */
function QuickStatCard({ icon: Icon, label, value }) {
    const { count, ref } = useCountUp(value);

    return (
        <div
            ref={ref}
            className="flex items-center gap-4 rounded-2xl border border-white/5 bg-space-mid/40 p-4 transition-all duration-300 hover:border-purple-500/20 hover:bg-space-mid/60"
        >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/20">
                <Icon className="h-5 w-5 text-purple-400" />
            </div>
            <div className="min-w-0">
                <p className="truncate text-xs font-medium text-white/50">{label}</p>
                <p className="text-2xl font-bold tabular-nums text-white">
                    {count.toLocaleString('id-ID')}
                </p>
            </div>
        </div>
    );
}

/* ───────────────── Management Card (Tier 2) ───────────────── */
function ManagementCard({ icon: Icon, title, description, statValue, statLabel, href }) {
    const { count, ref } = useCountUp(statValue ?? 0);

    return (
        <div ref={ref}>
            <Link
                href={href}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-purple-500/10 bg-space-mid/30 p-6 text-white backdrop-blur-md transition-all duration-300 hover:border-purple-500/30 hover:bg-space-mid/50"
            >
                {/* Ambient glow */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-purple-500/10 blur-3xl transition-opacity duration-500 group-hover:opacity-40" />

                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400">
                    <Icon className="h-6 w-6" />
                </div>

                {/* Content */}
                <div className="mt-4 flex-1">
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <p className="mt-1.5 text-sm text-white/50">{description}</p>
                </div>

                {/* Bottom: stat & CTA */}
                <div className="mt-6 flex items-end justify-between">
                    <div>
                        <p className="text-4xl font-bold tabular-nums text-purple-400">
                            {count.toLocaleString('id-ID')}
                        </p>
                        <p className="mt-0.5 text-xs text-white/40">{statLabel}</p>
                    </div>
                    <span className="text-sm font-medium text-purple-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white">
                        Kelola →
                    </span>
                </div>
            </Link>
        </div>
    );
}

/* ═══════════════════════════ PAGE ═══════════════════════════ */
export default function AdminDashboard({ stats = {} }) {
    const {
        totalUsers = 0,
        totalDatQuestions = 0,
        totalMajors = 0,
        totalMaterials = 0,
        totalTryouts = 0,
    } = stats;

    /* ── Tier 1: Quick Stats ── */
    const quickStats = [
        { icon: Users, label: 'Total Pengguna', value: totalUsers },
        { icon: ClipboardList, label: 'Soal DAT', value: totalDatQuestions },
        { icon: GraduationCap, label: 'Jurusan', value: totalMajors },
        { icon: BookOpen, label: 'Materi', value: totalMaterials },
        { icon: Rocket, label: 'Tryout', value: totalTryouts },
    ];

    /* ── Tier 2: Management Modules ── */
    const modules = [
        {
            title: 'Tes DAT',
            description: 'Kelola bank soal & kategori DAT untuk tes potensi mahasiswa.',
            icon: ClipboardList,
            href: route('admin.dat-tests.index'),
            statValue: totalDatQuestions,
            statLabel: 'soal terdaftar',
        },
        {
            title: 'Pengguna',
            description: 'Pantau akun terdaftar & atur role masing-masing pengguna.',
            icon: Users,
            href: route('admin.users.index'),
            statValue: totalUsers,
            statLabel: 'pengguna aktif',
        },
        {
            title: 'Jurusan',
            description: 'Kelola data program studi, passing grade & rekomendasi.',
            icon: GraduationCap,
            href: route('admin.majors.index'),
            statValue: totalMajors,
            statLabel: 'jurusan terdaftar',
        },
        {
            title: 'Materi Belajar',
            description: 'Tambah & kurasi materi belajar untuk setiap subtes.',
            icon: BookOpen,
            href: route('admin.study-materials.index'),
            statValue: totalMaterials,
            statLabel: 'materi tersedia',
        },
        {
            title: 'Tryout',
            description: 'Atur paket tryout, subtes, soal, dan jadwal pelaksanaan.',
            icon: Rocket,
            href: route('admin.tryouts.index'),
            statValue: totalTryouts,
            statLabel: 'paket tryout',
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Admin Dashboard" />

            <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">

                {/* ────────── TIER 1 — HEADER & PUSAT KONTROL ────────── */}
                <div className="mb-12">
                    {/* Title block */}
                    <div className="mb-8">
                        <div className="mb-2 flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-purple-400" />
                            <span className="text-xs font-semibold uppercase tracking-widest text-purple-400">
                                Pusat Kontrol
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-white">
                            Admin Dashboard
                        </h1>
                        <p className="mt-2 max-w-lg text-sm text-white/50">
                            Ringkasan data dan akses cepat ke seluruh modul manajemen NEXA.
                        </p>
                    </div>

                    {/* Quick stat cards */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                        {quickStats.map((s) => (
                            <QuickStatCard key={s.label} {...s} />
                        ))}
                    </div>
                </div>

                {/* ────────── TIER 2 — MODUL MANAJEMEN ────────── */}
                <div>
                    {/* Section label */}
                    <div className="mb-6 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-purple-400" />
                        <h2 className="text-xs font-semibold uppercase tracking-widest text-purple-300">
                            Modul Manajemen
                        </h2>
                        <div className="ml-2 h-px flex-1 bg-purple-500/15" />
                    </div>

                    {/* Module cards grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {modules.map((mod) => (
                            <ManagementCard key={mod.title} {...mod} />
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
