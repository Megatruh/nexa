import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    BookOpen,
    ClipboardList,
    GraduationCap,
    Rocket,
    Users,
    TrendingUp,
    ArrowRight,
    Construction,
    Sparkles,
} from 'lucide-react';

/* ──────────────────────── Animated Counter ──────────────────────── */
import { useState, useEffect, useRef } from 'react';

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
                        // easeOutExpo
                        const ease = 1 - Math.pow(2, -10 * progress);
                        setCount(Math.floor(ease * target));
                        if (progress < 1) requestAnimationFrame(step);
                    };
                    requestAnimationFrame(step);
                }
            },
            { threshold: 0.3 },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [target, duration]);

    return { count, ref };
}

/* ──────────────────────── Stat Card ──────────────────────── */
function StatCard({ icon: Icon, label, value, accent = '#a78bfa' }) {
    const { count, ref } = useCountUp(value);
    return (
        <div
            ref={ref}
            className="relative overflow-hidden rounded-2xl p-5 transition-transform duration-300 hover:scale-[1.03]"
            style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(16px)',
            }}
        >
            {/* glow blob */}
            <div
                className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full blur-3xl"
                style={{ background: accent, opacity: 0.12 }}
            />

            <div className="flex items-center gap-3">
                <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: `${accent}22`, border: `1px solid ${accent}33` }}
                >
                    <Icon className="h-5 w-5" style={{ color: accent }} />
                </div>
                <div>
                    <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        {label}
                    </p>
                    <p className="text-2xl font-bold tabular-nums text-white">
                        {count.toLocaleString('id-ID')}
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ──────────────────── Management Card ──────────────────── */
function ManagementCard({ icon: Icon, title, description, statValue, statLabel, href, comingSoon, accent = '#818cf8' }) {
    const { count, ref } = useCountUp(statValue ?? 0);
    const Wrapper = comingSoon ? 'div' : Link;
    const wrapperProps = comingSoon ? {} : { href };

    return (
        <div ref={ref}>
        <Wrapper
            {...wrapperProps}
            className={
                'group relative flex flex-col overflow-hidden rounded-3xl p-6 text-white transition-all duration-300 ' +
                (comingSoon
                    ? 'cursor-not-allowed opacity-60 grayscale-[30%]'
                    : 'hover:scale-[1.02] hover:border-purple-400/40')
            }
            style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px)',
            }}
        >
            {/* Ambient glow */}
            <div
                className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-30"
                style={{ background: accent, opacity: 0.1 }}
            />

            {/* Top row */}
            <div className="flex items-start justify-between">
                <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-300"
                    style={{ background: `${accent}18`, border: `1px solid ${accent}28` }}
                >
                    <Icon className="h-6 w-6" style={{ color: accent }} />
                </div>

                {comingSoon && (
                    <span
                        className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
                        style={{
                            background: 'rgba(234,179,8,0.1)',
                            border: '1px solid rgba(234,179,8,0.25)',
                            color: '#fde68a',
                        }}
                    >
                        <Construction className="h-3 w-3" />
                        Segera Hadir
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="mt-5 flex-1">
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="mt-1.5 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {description}
                </p>
            </div>

            {/* Stat & CTA */}
            <div className="mt-5 flex items-end justify-between">
                {statValue !== null && statValue !== undefined ? (
                    <div>
                        <p className="text-3xl font-bold tabular-nums" style={{ color: accent }}>
                            {count.toLocaleString('id-ID')}
                        </p>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                            {statLabel}
                        </p>
                    </div>
                ) : (
                    <div />
                )}

                <div
                    className={
                        'flex items-center gap-1 text-sm font-medium transition-all duration-300 ' +
                        (comingSoon
                            ? ''
                            : 'translate-x-0 group-hover:translate-x-1')
                    }
                    style={{ color: comingSoon ? 'rgba(255,255,255,0.3)' : accent }}
                >
                    {comingSoon ? 'Dalam pengembangan' : 'Kelola'}
                    {!comingSoon && <ArrowRight className="h-4 w-4" />}
                </div>
            </div>
        </Wrapper>
        </div>
    );
}

/* ──────────────────── Page ──────────────────── */
export default function AdminDashboard({ stats = {} }) {
    const {
        totalUsers = 0,
        totalDatQuestions = 0,
        totalMajors = 0,
        totalMaterials = 0,
        totalTryouts = 0,
    } = stats;

    const statCards = [
        { icon: Users, label: 'Total Pengguna', value: totalUsers, accent: '#818cf8' },
        { icon: ClipboardList, label: 'Soal DAT', value: totalDatQuestions, accent: '#a78bfa' },
        { icon: GraduationCap, label: 'Jurusan', value: totalMajors, accent: '#c084fc' },
        { icon: BookOpen, label: 'Materi', value: totalMaterials, accent: '#e879f9' },
    ];

    const managementCards = [
        {
            title: 'Tes DAT',
            description: 'Kelola bank soal & kategori DAT untuk tes potensi mahasiswa.',
            icon: ClipboardList,
            href: route('admin.dat-tests.index'),
            statValue: totalDatQuestions,
            statLabel: 'soal terdaftar',
            accent: '#818cf8',
        },
        {
            title: 'Pengguna',
            description: 'Pantau akun terdaftar & atur role masing-masing pengguna.',
            icon: Users,
            href: route('admin.users.index'),
            statValue: totalUsers,
            statLabel: 'pengguna aktif',
            accent: '#6366f1',
        },
        {
            title: 'Jurusan',
            description: 'Kelola data program studi, passing grade & rekomendasi.',
            icon: GraduationCap,
            href: route('admin.majors.index'),
            statValue: totalMajors,
            statLabel: 'jurusan terdaftar',
            accent: '#a78bfa',
        },
        {
            title: 'Materi Belajar',
            description: 'Tambah & kurasi materi belajar untuk setiap subtes.',
            icon: BookOpen,
            href: route('admin.study-materials.index'),
            statValue: totalMaterials,
            statLabel: 'materi tersedia',
            accent: '#c084fc',
            comingSoon: false,
        },
        {
            title: 'Tryout',
            description: 'Atur paket tryout, subtes, soal, dan jadwal pelaksanaan.',
            icon: Rocket,
            href: route('admin.tryouts.index'),
            statValue: totalTryouts,
            statLabel: 'paket tryout',
            accent: '#e879f9',
            comingSoon: false,
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Admin Dashboard" />

            <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
                {/* ── Hero header ── */}
                <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-purple-400" />
                            <span className="text-xs font-semibold uppercase tracking-widest text-purple-400">
                                Pusat Kontrol
                            </span>
                        </div>
                        <h1
                            className="text-3xl font-bold tracking-tight sm:text-4xl"
                            style={{
                                background: 'linear-gradient(135deg, #c4b5fd 0%, #818cf8 50%, #a78bfa 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Admin Dashboard
                        </h1>
                        <p className="mt-2 max-w-md text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                            Ringkasan data dan akses cepat ke seluruh modul manajemen NEXA.
                        </p>
                    </div>
                </div>

                {/* ── Quick Stats ── */}
                <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {statCards.map((s) => (
                        <StatCard key={s.label} {...s} />
                    ))}
                </div>

                {/* ── Section label ── */}
                <div className="mb-6 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-400" />
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-purple-300">
                        Modul Manajemen
                    </h2>
                    <div className="ml-2 h-px flex-1" style={{ background: 'rgba(167,139,250,0.15)' }} />
                </div>

                {/* ── Management Cards ── */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {managementCards.map((card) => (
                        <ManagementCard key={card.title} {...card} />
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
