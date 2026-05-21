import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { BookOpen, FileText, Plus, Pencil, Trash2, Search, Upload, X, ChevronUp, ChevronDown, Filter } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

/* ────────────────────────────────────────────
   BADGE TIPE MATERI
──────────────────────────────────────────── */
function TypeBadge({ type }) {
    const cfg = {
        materi: { bg: 'bg-indigo-500/20 border-indigo-400/30', text: 'text-indigo-200', label: 'Materi', icon: BookOpen },
        latsol: { bg: 'bg-amber-500/20  border-amber-400/30', text: 'text-amber-200', label: 'Latsol', icon: FileText },
    }[type] ?? { bg: 'bg-white/10 border-white/20', text: 'text-white/70', label: type, icon: FileText };
    const Icon = cfg.icon;
    return (
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.text}`}>
            <Icon className="h-3 w-3" /> {cfg.label}
        </span>
    );
}

/* ────────────────────────────────────────────
   MODAL FORM TAMBAH / EDIT
──────────────────────────────────────────── */
function MaterialModal({ subtests, editingMaterial, onClose, onSubmit, processing }) {
    const isEdit = Boolean(editingMaterial);

    const [form, setForm] = useState({
        title: editingMaterial?.title ?? '',
        description: editingMaterial?.description ?? '',
        type: editingMaterial?.type ?? 'materi',
        subtest_id: editingMaterial?.subtest_id ?? (subtests[0]?.id ?? ''),
    });
    const [file, setFile] = useState(null);
    const [fileError, setFileError] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef();

    const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

    const handleFile = (f) => {
        if (!f) return;
        if (f.type !== 'application/pdf') { setFileError('Hanya file PDF yang diizinkan.'); return; }
        if (f.size > 10 * 1024 * 1024) { setFileError('Ukuran file maksimal 10 MB.'); return; }
        setFileError('');
        setFile(f);
    };

    const handleDrop = (e) => {
        e.preventDefault(); setDragOver(false);
        handleFile(e.dataTransfer.files?.[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isEdit && !file) { setFileError('File PDF wajib diunggah.'); return; }
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('description', form.description);
        formData.append('type', form.type);
        formData.append('subtest_id', form.subtest_id);
        if (file) formData.append('file_path', file);
        onSubmit(formData, isEdit ? editingMaterial.id : null);
    };

    /* Field helper */
    const inputCls = 'mt-2 w-full rounded-xl border border-white/10 bg-space-dark/60 p-3 text-sm text-white placeholder:text-white/40 focus:border-indigo-400 focus:ring-0 outline-none';
    const labelCls = 'text-xs uppercase tracking-widest text-white/60 font-semibold';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-10 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0f0f1a]/95 p-6 text-white shadow-2xl">
                {/* Header */}
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">
                            {isEdit ? 'Edit Materi' : 'Tambah Materi Baru'}
                        </h2>
                        <p className="mt-1 text-sm text-white/50">
                            {isEdit
                                ? 'Perbarui data dan/atau ganti file PDF materi.'
                                : 'Isi detail materi dan unggah file PDF.'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-4 flex-shrink-0 rounded-full p-1.5 text-white/40 hover:bg-white/10 hover:text-white transition"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Judul */}
                    <div>
                        <label className={labelCls}>Judul Materi</label>
                        <input
                            value={form.title}
                            onChange={e => set('title', e.target.value)}
                            type="text"
                            className={inputCls}
                            placeholder="Contoh: Penalaran Umum - Rangkuman"
                            required
                        />
                    </div>

                    {/* Tipe + Subtest */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className={labelCls}>Tipe</label>
                            <select
                                value={form.type}
                                onChange={e => set('type', e.target.value)}
                                className={inputCls}
                            >
                                <option value="materi">Materi</option>
                                <option value="latsol">Latsol (Latihan Soal)</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>Subtest</label>
                            <select
                                value={form.subtest_id}
                                onChange={e => set('subtest_id', e.target.value)}
                                className={inputCls}
                                required
                            >
                                {subtests.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <label className={labelCls}>Deskripsi <span className="normal-case text-white/30">(opsional)</span></label>
                        <textarea
                            value={form.description}
                            onChange={e => set('description', e.target.value)}
                            rows={2}
                            className={inputCls}
                            placeholder="Deskripsi singkat tentang isi materi ini..."
                        />
                    </div>

                    {/* Upload PDF */}
                    <div>
                        <label className={labelCls}>
                            File PDF {isEdit && <span className="normal-case text-white/30">(kosongkan jika tidak diganti)</span>}
                        </label>
                        <div
                            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-sm transition
                                ${dragOver
                                    ? 'border-indigo-400 bg-indigo-500/10 text-indigo-200'
                                    : file
                                        ? 'border-emerald-400/50 bg-emerald-500/10 text-emerald-200'
                                        : 'border-white/20 bg-white/5 text-white/50 hover:border-indigo-400/50 hover:bg-indigo-500/5 hover:text-white/70'
                                }`}
                        >
                            <Upload className={`h-7 w-7 ${file ? 'text-emerald-300' : 'text-white/30'}`} />
                            {file
                                ? <span className="font-medium text-emerald-200">{file.name}</span>
                                : <span>Seret file PDF ke sini atau <span className="font-semibold text-indigo-300">klik untuk pilih</span></span>
                            }
                            <span className="text-xs text-white/30">Maks. 10 MB • Format PDF</span>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={e => handleFile(e.target.files?.[0])}
                        />
                        {fileError && <p className="mt-1.5 text-xs text-rose-400">{fileError}</p>}
                        {isEdit && editingMaterial?.file_path && !file && (
                            <p className="mt-1.5 text-xs text-white/40">
                                File saat ini: <span className="text-indigo-300">{editingMaterial.file_path.split('/').pop()}</span>
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full border border-white/10 px-5 py-2 text-sm text-white/60 hover:bg-white/5 transition"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-full bg-indigo-600/90 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Materi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ────────────────────────────────────────────
   HALAMAN UTAMA
──────────────────────────────────────────── */
export default function StudyMaterialsIndex() {
    const { materials, subtests, filters, flash } = usePage().props;

    const materialList = materials?.data ?? [];
    const paginationLinks = materials?.links ?? [];

    const sort = filters?.sort ?? 'created_at';
    const direction = filters?.direction ?? 'desc';
    const filterType = filters?.filterType ?? '';

    const [search, setSearch] = useState(filters?.search ?? '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMat, setEditingMat] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [notification, setNotif] = useState(null);

    /* Debounce search */
    useEffect(() => {
        const t = setTimeout(() => {
            if (search !== (filters?.search ?? '')) {
                router.get(
                    route('admin.study-materials.index'),
                    { search, sort, direction, type: filterType },
                    { preserveState: true, replace: true }
                );
            }
        }, 350);
        return () => clearTimeout(t);
    }, [search]);

    /* Flash notification */
    useEffect(() => {
        if (flash?.success) {
            setNotif({ type: 'success', message: flash.success });
            const t = setTimeout(() => setNotif(null), 3500);
            return () => clearTimeout(t);
        }
        if (flash?.error) {
            setNotif({ type: 'error', message: flash.error });
            const t = setTimeout(() => setNotif(null), 4000);
            return () => clearTimeout(t);
        }
    }, [flash]);

    const openCreate = () => { setEditingMat(null); setIsModalOpen(true); };
    const openEdit = (m) => { setEditingMat(m); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setEditingMat(null); };

    const handleSort = (key) => {
        const nextDir = sort === key && direction === 'asc' ? 'desc' : 'asc';
        router.get(
            route('admin.study-materials.index'),
            { sort: key, direction: nextDir, search, type: filterType },
            { preserveState: true, replace: true }
        );
    };

    const handleTypeFilter = (t) => {
        router.get(
            route('admin.study-materials.index'),
            { sort, direction, search, type: t },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = (id) => {
        if (!confirm('Hapus materi ini? File PDF juga akan dihapus secara permanen.')) return;
        router.delete(route('admin.study-materials.destroy', id), {
            onSuccess: () => { },
            onError: () => { },
        });
    };

    const handleSubmit = (formData, id) => {
        setProcessing(true);
        const url = id
            ? route('admin.study-materials.update', id)
            : route('admin.study-materials.store');

        router.post(url, formData, {
            forceFormData: true,
            onSuccess: () => { setProcessing(false); closeModal(); },
            onError: () => { setProcessing(false); },
        });
    };

    const SortIcon = ({ col }) => {
        if (sort !== col) return null;
        return direction === 'asc'
            ? <ChevronUp className="h-3.5 w-3.5 text-indigo-300" />
            : <ChevronDown className="h-3.5 w-3.5 text-indigo-300" />;
    };

    const thBtn = 'inline-flex items-center gap-1.5 text-left hover:text-indigo-200 transition';

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Materi Belajar" />

            {/* ── Notifikasi ── */}
            {notification && (
                <div className={`fixed right-5 top-5 z-[60] flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-xl transition-all
                    ${notification.type === 'success'
                        ? 'border-emerald-400/30 bg-emerald-500/20 text-emerald-200'
                        : 'border-rose-400/30    bg-rose-500/20    text-rose-200'
                    }`}
                >
                    {notification.message}
                    <button onClick={() => setNotif(null)} className="ml-1 text-white/40 hover:text-white">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">

                {/* ── Header ── */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <Link
                            href={route('admin.dashboard')}
                            className="text-sm text-indigo-200/70 hover:text-indigo-200 transition"
                        >
                            ← Kembali ke Dashboard
                        </Link>
                        <h1 className="mt-2 text-3xl font-semibold text-white">Manajemen Materi Belajar</h1>
                        <p className="mt-1 text-sm text-white/50">
                            Kelola materi dan latihan soal PDF untuk setiap subtest.
                        </p>
                    </div>
                    <button
                        onClick={openCreate}
                        id="btn-tambah-materi"
                        className="inline-flex items-center gap-2 rounded-full border border-indigo-400/40 bg-indigo-500/20 px-5 py-2.5 text-sm font-semibold text-indigo-100 shadow-lg shadow-indigo-500/10 transition hover:bg-indigo-500/30 hover:shadow-indigo-500/20"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Materi
                    </button>
                </div>

                {/* ── Search + Filter ── */}
                <div className="mb-5 flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                        <Search className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-white/30" />
                        <input
                            id="search-materi"
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Cari judul materi..."
                            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 backdrop-blur focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                        />
                    </div>

                    {/* Filter Tipe */}
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-white/30" />
                        {[
                            { val: '', label: 'Semua' },
                            { val: 'materi', label: 'Materi' },
                            { val: 'latsol', label: 'Latsol' },
                        ].map(opt => (
                            <button
                                key={opt.val}
                                id={`filter-${opt.val || 'semua'}`}
                                onClick={() => handleTypeFilter(opt.val)}
                                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition
                                    ${filterType === opt.val
                                        ? 'border-indigo-400 bg-indigo-500/30 text-indigo-100'
                                        : 'border-white/10 bg-white/5 text-white/50 hover:border-indigo-400/40 hover:text-white/80'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Tabel ── */}
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-space-mid/50 backdrop-blur-md">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-white/8 text-sm text-white">
                            <thead className="bg-space-dark/60 text-xs uppercase tracking-widest text-white/50">
                                <tr>
                                    <th className="px-6 py-4 text-left">
                                        <button type="button" onClick={() => handleSort('title')} className={thBtn}>
                                            Judul <SortIcon col="title" />
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-left">Subtest</th>
                                    <th className="px-6 py-4 text-left">
                                        <button type="button" onClick={() => handleSort('type')} className={thBtn}>
                                            Tipe <SortIcon col="type" />
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <button type="button" onClick={() => handleSort('created_at')} className={thBtn}>
                                            Ditambahkan <SortIcon col="created_at" />
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-left">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {materialList.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-14 text-center text-white/40">
                                            <BookOpen className="mx-auto mb-3 h-10 w-10 opacity-20" />
                                            {search || filterType
                                                ? 'Tidak ada materi yang cocok dengan filter.'
                                                : 'Belum ada materi. Klik "+ Tambah Materi" untuk memulai.'}
                                        </td>
                                    </tr>
                                )}
                                {materialList.map((m) => (
                                    <tr key={m.id} className="group hover:bg-white/[0.03] transition">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white/90 group-hover:text-white transition max-w-xs">
                                                {m.title}
                                            </div>
                                            {m.description && (
                                                <p className="mt-0.5 text-xs text-white/40 line-clamp-1">
                                                    {m.description}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-white/60">
                                            {m.subtest?.name ?? '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <TypeBadge type={m.type} />
                                        </td>
                                        <td className="px-6 py-4 text-white/40 text-xs">
                                            {new Date(m.created_at).toLocaleDateString('id-ID', {
                                                day: '2-digit', month: 'short', year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    id={`btn-edit-${m.id}`}
                                                    onClick={() => openEdit(m)}
                                                    className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/30 px-3 py-1.5 text-xs text-indigo-200 transition hover:bg-indigo-500/20"
                                                >
                                                    <Pencil className="h-3 w-3" /> Edit
                                                </button>
                                                <button
                                                    id={`btn-hapus-${m.id}`}
                                                    onClick={() => handleDelete(m.id)}
                                                    className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/30 px-3 py-1.5 text-xs text-rose-200 transition hover:bg-rose-500/20"
                                                >
                                                    <Trash2 className="h-3 w-3" /> Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── Pagination ── */}
                {paginationLinks.length > 3 && (
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                        {paginationLinks.map((link, i) =>
                            link.url ? (
                                <Link
                                    key={i}
                                    href={link.url}
                                    className={`rounded-xl border px-4 py-2 text-sm transition-all ${link.active
                                            ? 'border-purple-500 bg-purple-600/80 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]'
                                            : 'border-white/10 bg-space-mid/40 text-purple-300 hover:border-purple-400/50 hover:bg-space-light/50'
                                        }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span
                                    key={i}
                                    className="cursor-not-allowed rounded-xl border border-white/5 bg-space-dark/50 px-4 py-2 text-sm text-gray-600"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            )
                        )}
                    </div>
                )}
            </div>

            {/* ── Modal ── */}
            {isModalOpen && (
                <MaterialModal
                    subtests={subtests}
                    editingMaterial={editingMat}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    processing={processing}
                />
            )}
        </AuthenticatedLayout>
    );
}
