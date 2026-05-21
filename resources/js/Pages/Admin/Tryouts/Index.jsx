import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
// ─── CUSTOM DEBOUNCE ─────────────────────────────────────────────────────────
function debounce(func, wait) {
    let timeout;
    const executedFunction = function(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
    executedFunction.cancel = function() {
        clearTimeout(timeout);
    };
    return executedFunction;
}

// ─── ICONS ───────────────────────────────────────────────────────────────────
const PlusIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);
const PencilIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
);
const TrashIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);
const XIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const DocumentArrowUpIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

export default function TryoutsIndex({ auth, tryouts, filters, standardSubtests }) {
    const [search, setSearch] = useState(filters.search || '');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTryout, setCurrentTryout] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        batch_name: '',
        description: '',
        is_active: true,
        started_at: '',
        ended_at: '',
        subtests: standardSubtests.map(s => ({ ...s, file: null })),
        _method: 'post',
    });

    // Handle body scroll lock
    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showModal]);

    // Debounced Search
    const debouncedSearch = useCallback(
        debounce((query) => {
            router.get(
                route('admin.tryouts.index'),
                { search: query, sort: filters.sort, direction: filters.direction },
                { preserveState: true, replace: true }
            );
        }, 500),
        [filters]
    );

    useEffect(() => {
        if (search !== (filters.search || '')) {
            debouncedSearch(search);
        }
        return () => {
            if (debouncedSearch.cancel) debouncedSearch.cancel();
        };
    }, [search, debouncedSearch, filters.search]);

    const openModal = (tryout = null) => {
        clearErrors();
        if (tryout) {
            setIsEditing(true);
            setCurrentTryout(tryout);
            setData({
                batch_name: tryout.batch_name,
                description: tryout.description || '',
                is_active: tryout.is_active,
                started_at: tryout.started_at ? tryout.started_at.substring(0, 16) : '',
                ended_at: tryout.ended_at ? tryout.ended_at.substring(0, 16) : '',
                subtests: tryout.subtests.length > 0 
                    ? tryout.subtests.map(s => ({ ...s, file: null }))
                    : standardSubtests.map(s => ({ ...s, file: null })),
                _method: 'put',
            });
        } else {
            setIsEditing(false);
            setCurrentTryout(null);
            setData({
                batch_name: '',
                description: '',
                is_active: true,
                started_at: '',
                ended_at: '',
                subtests: standardSubtests.map(s => ({ ...s, file: null })),
                _method: 'post',
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setTimeout(() => reset(), 300);
    };

    const submitForm = (e) => {
        e.preventDefault();
        const routeName = isEditing ? 'admin.tryouts.update' : 'admin.tryouts.store';
        const routeParams = isEditing ? currentTryout.id : undefined;

        // Note: Inertia uses POST with _method='put' when handling files.
        post(route(routeName, routeParams), {
            onSuccess: () => closeModal(),
            forceFormData: true,
        });
    };

    const deleteTryout = (tryout) => {
        if (confirm(`Apakah Anda yakin ingin menghapus Tryout: ${tryout.batch_name}?`)) {
            router.delete(route('admin.tryouts.destroy', tryout.id), {
                preserveScroll: true,
            });
        }
    };

    const handleSort = (column) => {
        const direction = filters.sort === column && filters.direction === 'asc' ? 'desc' : 'asc';
        router.get(
            route('admin.tryouts.index'),
            { search, sort: column, direction },
            { preserveState: true }
        );
    };

    const updateSubtestData = (index, field, value) => {
        const newSubtests = [...data.subtests];
        newSubtests[index][field] = value;
        setData('subtests', newSubtests);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Manajemen Tryout" />

            <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Manajemen Tryout</h1>
                        <p className="mt-2 text-sm text-white/60">
                            Kelola batch tryout dan bank soal (CSV) per subtes.
                        </p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-600 active:scale-95"
                    >
                        <PlusIcon /> Tambah Tryout
                    </button>
                </div>

                {/* Main Content Card */}
                <div className="rounded-2xl border border-white/10 bg-[#0f0826]/60 p-6 backdrop-blur-xl sm:p-8">
                    {/* Search Bar */}
                    <div className="mb-6 flex max-w-md items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                        <svg className="h-5 w-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Cari nama batch..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border-none bg-transparent p-0 text-sm text-white placeholder-white/40 focus:ring-0"
                        />
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-xl border border-white/10">
                        <table className="w-full text-left text-sm text-white/80">
                            <thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-white/60">
                                <tr>
                                    <th className="cursor-pointer px-6 py-4 hover:text-white" onClick={() => handleSort('batch_name')}>
                                        Nama Batch {filters.sort === 'batch_name' && (filters.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="px-6 py-4">Rentang Waktu</th>
                                    <th className="px-6 py-4">Subtes</th>
                                    <th className="cursor-pointer px-6 py-4 hover:text-white" onClick={() => handleSort('is_active')}>
                                        Status {filters.sort === 'is_active' && (filters.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {tryouts.data.length > 0 ? (
                                    tryouts.data.map((tryout) => (
                                        <tr key={tryout.id} className="transition-colors hover:bg-white/5">
                                            <td className="px-6 py-4 font-medium text-white">
                                                {tryout.batch_name}
                                                <div className="text-xs text-white/40 mt-1">{tryout.description?.substring(0,50)}</div>
                                            </td>
                                            <td className="px-6 py-4 text-xs">
                                                <div className="text-emerald-400">Mulai: {tryout.started_at ? new Date(tryout.started_at).toLocaleString('id-ID') : '-'}</div>
                                                <div className="text-rose-400">Tutup: {tryout.ended_at ? new Date(tryout.ended_at).toLocaleString('id-ID') : '-'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/80">
                                                    {tryout.subtests_count} Subtes
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                    tryout.is_active
                                                        ? 'bg-emerald-500/20 text-emerald-400'
                                                        : 'bg-rose-500/20 text-rose-400'
                                                }`}>
                                                    {tryout.is_active ? 'Aktif' : 'Nonaktif'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => openModal(tryout)}
                                                        className="rounded-lg bg-amber-500/20 p-2 text-amber-400 transition-colors hover:bg-amber-500/30"
                                                        title="Edit Tryout"
                                                    >
                                                        <PencilIcon />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteTryout(tryout)}
                                                        className="rounded-lg bg-rose-500/20 p-2 text-rose-400 transition-colors hover:bg-rose-500/30"
                                                        title="Hapus Tryout"
                                                    >
                                                        <TrashIcon />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-white/50">
                                            Belum ada data tryout.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-[#0f0826]/80 backdrop-blur-sm transition-opacity" onClick={closeModal} />
                    
                    {/* Modal Content */}
                    <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#160d33] shadow-2xl">
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#160d33]/90 px-6 py-4 backdrop-blur-md">
                            <h2 className="text-xl font-bold text-white">
                                {isEditing ? 'Edit Tryout' : 'Tambah Tryout Baru'}
                            </h2>
                            <button onClick={closeModal} className="text-white/50 hover:text-white">
                                <XIcon />
                            </button>
                        </div>

                        <form onSubmit={submitForm} className="p-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Basic Info Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white/90">Informasi Umum</h3>
                                    
                                    <div>
                                        <label className="mb-2 block text-sm text-white/70">Nama Batch</label>
                                        <input
                                            type="text"
                                            value={data.batch_name}
                                            onChange={e => setData('batch_name', e.target.value)}
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                            placeholder="Contoh: UTBK SNBT Batch 2"
                                            required
                                        />
                                        {errors.batch_name && <p className="mt-1 text-xs text-rose-400">{errors.batch_name}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm text-white/70">Deskripsi</label>
                                        <textarea
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                            rows="2"
                                            placeholder="Opsional..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="mb-2 block text-sm text-white/70">Waktu Mulai (Opsional)</label>
                                            <input
                                                type="datetime-local"
                                                value={data.started_at}
                                                onChange={e => setData('started_at', e.target.value)}
                                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm text-white/70">Waktu Selesai (Opsional)</label>
                                            <input
                                                type="datetime-local"
                                                value={data.ended_at}
                                                onChange={e => setData('ended_at', e.target.value)}
                                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-indigo-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="relative flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.is_active}
                                                onChange={e => setData('is_active', e.target.checked)}
                                                className="sr-only peer"
                                                id="isActiveToggle"
                                            />
                                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                                        </div>
                                        <label htmlFor="isActiveToggle" className="text-sm text-white/80 cursor-pointer">
                                            Status: {data.is_active ? 'Aktif (Dapat dikerjakan)' : 'Nonaktif'}
                                        </label>
                                    </div>
                                </div>

                                {/* Subtests Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white/90">Bank Soal (Subtes)</h3>
                                    <p className="text-xs text-white/50">
                                        Unggah CSV bank soal untuk meng-override soal di subtes terkait. Kosongkan jika tidak ada perubahan soal.
                                    </p>
                                    
                                    <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                                        {data.subtests.map((subtest, idx) => (
                                            <div key={idx} className="rounded-xl border border-white/10 bg-white/5 p-4">
                                                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                    <input
                                                        type="text"
                                                        value={subtest.name}
                                                        onChange={e => updateSubtestData(idx, 'name', e.target.value)}
                                                        className="bg-transparent border-none text-sm font-semibold text-white focus:ring-0 p-0 w-full"
                                                        placeholder="Nama Subtes"
                                                        required
                                                    />
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <span className="text-white/50">Durasi (menit):</span>
                                                        <input
                                                            type="number"
                                                            step="0.1"
                                                            value={subtest.duration}
                                                            onChange={e => updateSubtestData(idx, 'duration', e.target.value)}
                                                            className="w-16 rounded border border-white/10 bg-white/5 px-2 py-1 text-white text-right focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-500/20 px-3 py-1.5 text-xs font-medium text-indigo-300 transition-colors hover:bg-indigo-500/30">
                                                        <DocumentArrowUpIcon />
                                                        Pilih File CSV
                                                        <input
                                                            type="file"
                                                            accept=".csv,.txt"
                                                            className="hidden"
                                                            onChange={e => updateSubtestData(idx, 'file', e.target.files[0])}
                                                        />
                                                    </label>
                                                    {subtest.file && (
                                                        <span className="text-xs text-emerald-400 truncate max-w-[150px]">
                                                            {subtest.file.name}
                                                        </span>
                                                    )}
                                                </div>
                                                {errors[`subtests.${idx}.file`] && (
                                                    <p className="mt-1 text-[10px] text-rose-400">{errors[`subtests.${idx}.file`]}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-3 border-t border-white/10 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-white/70 hover:bg-white/5"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-indigo-500 px-6 py-2.5 text-sm font-medium text-white shadow-lg hover:bg-indigo-600 disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
