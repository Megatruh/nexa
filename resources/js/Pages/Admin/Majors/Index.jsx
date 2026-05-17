import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Plus, Pencil, Search, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function MajorsIndex() {
    const { majors, filters } = usePage().props;
    const majorList = majors?.data ?? [];
    const paginationLinks = majors?.links ?? [];
    const sort = filters?.sort ?? 'name';
    const direction = filters?.direction ?? 'asc';
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMajor, setEditingMajor] = useState(null);
    const [search, setSearch] = useState(filters?.search ?? '');
    const [passingGradeDisplay, setPassingGradeDisplay] = useState('');
    const [passingGradeError, setPassingGradeError] = useState('');

    const { data, setData, post, put, processing, reset } = useForm({
        name: '',
        accreditation: '',
        rating: '',
        passing_grade_min: '',
        passing_grade_max: '',
        capacity: '',
        enthusiasts: '',
        ukt_range: '',
        related_subjects: '',
        career_prospects: '',
        description: '',
    });

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search !== (filters?.search ?? '')) {
                router.get(
                    route('admin.majors.index'),
                    { search, sort, direction },
                    { preserveState: true, replace: true }
                );
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const openCreateModal = () => {
        setEditingMajor(null);
        reset();
        setPassingGradeDisplay('');
        setPassingGradeError('');
        setIsModalOpen(true);
    };

    const openEditModal = (major) => {
        setEditingMajor(major);
        const min = major.passing_grade_min ?? '';
        const max = major.passing_grade_max ?? '';
        setPassingGradeDisplay(
            min || max ? `${min}-${max}` : ''
        );
        setPassingGradeError('');
        setData({
            name: major.name ?? '',
            accreditation: major.accreditation ?? '',
            rating: major.rating ?? '',
            passing_grade_min: min,
            passing_grade_max: max,
            capacity: major.capacity ?? '',
            enthusiasts: major.enthusiasts ?? '',
            ukt_range: major.ukt_range ?? '',
            related_subjects: major.related_subjects ?? '',
            career_prospects: major.career_prospects ?? '',
            description: major.description ?? '',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingMajor(null);
        reset();
        setPassingGradeDisplay('');
        setPassingGradeError('');
    };

    const handlePassingGradeChange = (value) => {
        setPassingGradeDisplay(value);

        // Allow empty value (clear both fields)
        if (value.trim() === '') {
            setData((prev) => ({
                ...prev,
                passing_grade_min: '',
                passing_grade_max: '',
            }));
            setPassingGradeError('');
            return;
        }

        // Check if value contains a dash separator
        if (!value.includes('-')) {
            setPassingGradeError('Gunakan format: min-max (contoh: 590-680)');
            setData((prev) => ({
                ...prev,
                passing_grade_min: '',
                passing_grade_max: '',
            }));
            return;
        }

        const parts = value.split('-').map((p) => p.trim());
        if (parts.length !== 2 || parts[0] === '' || parts[1] === '') {
            setPassingGradeError('Gunakan format: min-max (contoh: 590-680)');
            setData((prev) => ({
                ...prev,
                passing_grade_min: '',
                passing_grade_max: '',
            }));
            return;
        }

        const min = Number(parts[0]);
        const max = Number(parts[1]);

        if (isNaN(min) || isNaN(max)) {
            setPassingGradeError('Nilai harus berupa angka');
            setData((prev) => ({
                ...prev,
                passing_grade_min: '',
                passing_grade_max: '',
            }));
            return;
        }

        if (min < 0 || max < 0) {
            setPassingGradeError('Nilai harus positif (tidak boleh negatif)');
            setData((prev) => ({
                ...prev,
                passing_grade_min: '',
                passing_grade_max: '',
            }));
            return;
        }

        if (min >= max) {
            setPassingGradeError('Nilai minimum harus lebih kecil dari nilai maksimum');
            setData((prev) => ({
                ...prev,
                passing_grade_min: '',
                passing_grade_max: '',
            }));
            return;
        }

        // Valid input
        setPassingGradeError('');
        setData((prev) => ({
            ...prev,
            passing_grade_min: String(min),
            passing_grade_max: String(max),
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (passingGradeError) {
            return;
        }

        if (editingMajor?.id) {
            put(route('admin.majors.update', editingMajor.id), {
                onSuccess: closeModal,
            });
            return;
        }

        post(route('admin.majors.store'), {
            onSuccess: closeModal,
        });
    };

    const handleDelete = (id) => {
        if (confirm('Hapus data jurusan ini? Tindakan tidak dapat dibatalkan.')) {
            router.delete(route('admin.majors.destroy', id));
        }
    };

    const handleSort = (key) => {
        const nextDirection =
            sort === key && direction === 'asc' ? 'desc' : 'asc';

        router.get(
            route('admin.majors.index'),
            { sort: key, direction: nextDirection, search },
            { preserveState: true, replace: true }
        );
    };

    const sortIndicator = (key) => {
        if (sort !== key) return '';
        return direction === 'asc' ? '↑' : '↓';
    };
    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Data Jurusan" />

            <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <Link
                        href={route('admin.dashboard')}
                        className="text-sm text-indigo-200/80 hover:text-indigo-200"
                    >
                        ← Kembali ke Dashboard
                    </Link>
                    <div>
                        <h1 className="mt-2 text-3xl font-semibold text-white">
                            Manajemen Data Jurusan
                        </h1>
                        <p className="mt-2 text-sm text-white/70">
                            Data jurusan diambil dari fitur Ulasan Prodi yang sudah
                            tersedia.
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 rounded-full border border-indigo-400/40 bg-indigo-500/20 px-5 py-2 text-sm font-semibold text-indigo-100 transition hover:bg-indigo-500/30"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Jurusan
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-white/40" />
                        </div>
                        <input
                            type="text"
                            className="block w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/40 backdrop-blur-md focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            placeholder="Cari nama jurusan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-space-mid/50 backdrop-blur-md">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-white/10 text-sm text-white">
                            <thead className="bg-space-dark/60 text-xs uppercase tracking-widest text-white/70">
                                <tr>
                                    <th className="px-6 py-4 text-left">
                                        <button
                                            type="button"
                                            onClick={() => handleSort('name')}
                                            className="inline-flex items-center gap-2 text-left"
                                        >
                                            Nama Jurusan
                                            <span className="text-indigo-200/70">
                                                {sortIndicator('name')}
                                            </span>
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleSort('accreditation')
                                            }
                                            className="inline-flex items-center gap-2 text-left"
                                        >
                                            Akreditasi
                                            <span className="text-indigo-200/70">
                                                {sortIndicator('accreditation')}
                                            </span>
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <button
                                            type="button"
                                            onClick={() => handleSort('rating')}
                                            className="inline-flex items-center gap-2 text-left"
                                        >
                                            Rating
                                            <span className="text-indigo-200/70">
                                                {sortIndicator('rating')}
                                            </span>
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleSort('passing_grade_max')
                                            }
                                            className="inline-flex items-center gap-2 text-left"
                                        >
                                            Passing Grade
                                            <span className="text-indigo-200/70">
                                                {sortIndicator('passing_grade_max')}
                                            </span>
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <button
                                            type="button"
                                            onClick={() => handleSort('capacity')}
                                            className="inline-flex items-center gap-2 text-left"
                                        >
                                            Daya Tampung
                                            <span className="text-indigo-200/70">
                                                {sortIndicator('capacity')}
                                            </span>
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <button
                                            type="button"
                                            onClick={() => handleSort('enthusiasts')}
                                            className="inline-flex items-center gap-2 text-left"
                                        >
                                            Peminat
                                            <span className="text-indigo-200/70">
                                                {sortIndicator('enthusiasts')}
                                            </span>
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-left">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {majorList.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-6 py-10 text-center text-sm text-white/60"
                                        >
                                            {search
                                                ? `Tidak ada jurusan yang cocok dengan pencarian "${search}".`
                                                : 'Belum ada data jurusan untuk ditampilkan.'}
                                        </td>
                                    </tr>
                                )}
                                {majorList.map((major) => (
                                    <tr key={major.id} className="hover:bg-white/5">
                                        <td className="px-6 py-4 text-white/90">
                                            <div className="font-semibold">
                                                {major.name}
                                            </div>
                                            {major.description && (
                                                <p className="mt-1 text-xs text-white/60 line-clamp-2">
                                                    {major.description}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-white/70">
                                            {major.accreditation || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-white/70">
                                            {major.rating ?? '-'}
                                        </td>
                                        <td className="px-6 py-4 text-white/70">
                                            {major.passing_grade_max || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-white/70">
                                            {major.capacity ?? '-'}
                                        </td>
                                        <td className="px-6 py-4 text-white/70">
                                            {major.enthusiasts ?? '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(major)}
                                                    className="inline-flex items-center gap-1 rounded-full border border-indigo-400/30 px-3 py-1 text-xs text-indigo-200 hover:bg-indigo-500/20"
                                                >
                                                    <Pencil className="h-3 w-3" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(major.id)}
                                                    className="inline-flex items-center gap-1 rounded-full border border-rose-400/30 px-3 py-1 text-xs text-rose-200 hover:bg-rose-500/20"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {paginationLinks.length > 3 && (
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                        {paginationLinks.map((link, index) =>
                            link.url ? (
                                <Link
                                    key={index}
                                    href={link.url}
                                    className={`px-4 py-2 rounded-xl border text-sm transition-all ${
                                        link.active
                                            ? 'bg-purple-600/80 text-white border-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.4)]'
                                            : 'bg-space-mid/40 text-purple-300 border-white/10 hover:bg-space-light/50 hover:border-purple-400/50'
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ) : (
                                <span
                                    key={index}
                                    className="px-4 py-2 rounded-xl border bg-space-dark/50 border-white/5 text-gray-600 cursor-not-allowed text-sm"
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            )
                        )}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-space-dark/80 px-4 py-10">
                    <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-space-mid/70 p-6 text-white shadow-2xl backdrop-blur-md">
                        <div className="mb-6 flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {editingMajor
                                        ? 'Edit Data Jurusan'
                                        : 'Tambah Data Jurusan'}
                                </h2>
                                <p className="mt-1 text-sm text-white/70">
                                    Lengkapi detail jurusan dari fitur Ulasan Prodi.
                                </p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="text-sm text-white/60 hover:text-white"
                            >
                                Tutup
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-xs uppercase tracking-widest text-white/70">
                                        Nama Jurusan
                                    </label>
                                    <input
                                        value={data.name}
                                        onChange={(event) =>
                                            setData('name', event.target.value)
                                        }
                                        type="text"
                                        className="mt-2 w-full rounded-xl border border-white/10 bg-space-dark/60 p-3 text-sm text-white placeholder:text-white/40 focus:border-indigo-400 focus:ring-0"
                                        placeholder="Contoh: Informatika (S1)"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs uppercase tracking-widest text-white/70">
                                        Akreditasi
                                    </label>
                                    <input
                                        value={data.accreditation}
                                        onChange={(event) =>
                                            setData(
                                                'accreditation',
                                                event.target.value
                                            )
                                        }
                                        type="text"
                                        className="mt-2 w-full rounded-xl border border-white/10 bg-space-dark/60 p-3 text-sm text-white placeholder:text-white/40 focus:border-indigo-400 focus:ring-0"
                                        placeholder="Contoh: Unggul"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <label className="text-xs uppercase tracking-widest text-white/70">
                                        Rating (0-5)
                                    </label>
                                    <input
                                        value={data.rating}
                                        onChange={(event) =>
                                            setData('rating', event.target.value)
                                        }
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        className="mt-2 w-full rounded-xl border border-white/10 bg-space-dark/60 p-3 text-sm text-white placeholder:text-white/40 focus:border-indigo-400 focus:ring-0"
                                        placeholder="4.8"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs uppercase tracking-widest text-white/70">
                                        Range Passing Grade
                                    </label>
                                    <input
                                        value={passingGradeDisplay}
                                        onChange={(event) =>
                                            handlePassingGradeChange(
                                                event.target.value
                                            )
                                        }
                                        type="text"
                                        className={`mt-2 w-full rounded-xl border bg-space-dark/60 p-3 text-sm text-white placeholder:text-white/40 focus:ring-0 ${
                                            passingGradeError
                                                ? 'border-rose-400/60 focus:border-rose-400'
                                                : 'border-white/10 focus:border-indigo-400'
                                        }`}
                                        placeholder="Contoh: 590-680"
                                    />
                                    {passingGradeError && (
                                        <p className="mt-1.5 text-xs text-rose-400">
                                            {passingGradeError}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-xs uppercase tracking-widest text-white/70">
                                        Range UKT
                                    </label>
                                    <input
                                        value={data.ukt_range}
                                        onChange={(event) =>
                                            setData('ukt_range', event.target.value)
                                        }
                                        type="text"
                                        className="mt-2 w-full rounded-xl border border-white/10 bg-space-dark/60 p-3 text-sm text-white placeholder:text-white/40 focus:border-indigo-400 focus:ring-0"
                                        placeholder="Contoh: 2.000.000 - 6.000.000"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-xs uppercase tracking-widest text-white/70">
                                        Daya Tampung
                                    </label>
                                    <input
                                        value={data.capacity}
                                        onChange={(event) =>
                                            setData('capacity', event.target.value)
                                        }
                                        type="number"
                                        min="0"
                                        className="mt-2 w-full rounded-xl border border-white/10 bg-space-dark/60 p-3 text-sm text-white placeholder:text-white/40 focus:border-indigo-400 focus:ring-0"
                                        placeholder="120"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs uppercase tracking-widest text-white/70">
                                        Peminat
                                    </label>
                                    <input
                                        value={data.enthusiasts}
                                        onChange={(event) =>
                                            setData('enthusiasts', event.target.value)
                                        }
                                        type="number"
                                        min="0"
                                        className="mt-2 w-full rounded-xl border border-white/10 bg-space-dark/60 p-3 text-sm text-white placeholder:text-white/40 focus:border-indigo-400 focus:ring-0"
                                        placeholder="900"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs uppercase tracking-widest text-white/70">
                                    Mata Pelajaran Terkait
                                </label>
                                <input
                                    value={data.related_subjects}
                                    onChange={(event) =>
                                        setData(
                                            'related_subjects',
                                            event.target.value
                                        )
                                    }
                                    type="text"
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-space-dark/60 p-3 text-sm text-white placeholder:text-white/40 focus:border-indigo-400 focus:ring-0"
                                    placeholder="Contoh: Matematika, Fisika, Logika"
                                />
                            </div>

                            <div>
                                <label className="text-xs uppercase tracking-widest text-white/70">
                                    Prospek Karir
                                </label>
                                <textarea
                                    value={data.career_prospects}
                                    onChange={(event) =>
                                        setData(
                                            'career_prospects',
                                            event.target.value
                                        )
                                    }
                                    rows={2}
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-space-dark/60 p-3 text-sm text-white placeholder:text-white/40 focus:border-indigo-400 focus:ring-0"
                                    placeholder="Contoh: Data Analyst, Software Engineer, Product Manager"
                                />
                            </div>

                            <div>
                                <label className="text-xs uppercase tracking-widest text-white/70">
                                    Deskripsi
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(event) =>
                                        setData('description', event.target.value)
                                    }
                                    rows={3}
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-space-dark/60 p-3 text-sm text-white placeholder:text-white/40 focus:border-indigo-400 focus:ring-0"
                                    placeholder="Tuliskan deskripsi singkat jurusan"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 hover:bg-white/5"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-full bg-indigo-500/80 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processing
                                        ? 'Menyimpan...'
                                        : editingMajor
                                          ? 'Simpan Perubahan'
                                          : 'Tambah Jurusan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
