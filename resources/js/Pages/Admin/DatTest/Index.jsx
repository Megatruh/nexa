import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function DatTestIndex() {
    const questions = usePage().props.questions ?? [];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);

    const { data, setData, post, put, processing, reset } = useForm({
        question: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        category: '',
    });

    const openCreateModal = () => {
        setEditingQuestion(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (question) => {
        setEditingQuestion(question);
        setData({
            question: question.question ?? '',
            option_a: question.option_a ?? '',
            option_b: question.option_b ?? '',
            option_c: question.option_c ?? '',
            option_d: question.option_d ?? '',
            category: question.category ?? '',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingQuestion(null);
        reset();
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (editingQuestion?.id) {
            put(route('admin.dat-tests.update', editingQuestion.id), {
                onSuccess: closeModal,
            });
            return;
        }

        post(route('admin.dat-tests.store'), {
            onSuccess: closeModal,
        });
    };

    const handleDelete = (id) => {
        if (confirm('Hapus soal ini? Tindakan tidak dapat dibatalkan.')) {
            router.delete(route('admin.dat-tests.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Tes DAT" />

            <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <Link
                            href={route('admin.dashboard')}
                            className="text-sm text-indigo-200/80 hover:text-indigo-200"
                        >
                            ← Kembali ke Dashboard
                        </Link>
                        <h1 className="mt-2 text-3xl font-semibold text-white">
                            Manajemen Tes DAT
                        </h1>
                        <p className="mt-2 text-sm text-white/70">
                            Kelola bank soal untuk tes DAT dengan mudah.
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 rounded-full border border-indigo-400/40 bg-indigo-500/20 px-5 py-2 text-sm font-semibold text-indigo-100 transition hover:bg-indigo-500/30"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Soal
                    </button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-space-mid/50 backdrop-blur-md">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-white/10 text-sm text-white">
                            <thead className="bg-space-dark/60 text-xs uppercase tracking-widest text-white/70">
                                <tr>
                                    <th className="px-6 py-4 text-left">Soal</th>
                                    <th className="px-6 py-4 text-left">Opsi A</th>
                                    <th className="px-6 py-4 text-left">Opsi B</th>
                                    <th className="px-6 py-4 text-left">Opsi C</th>
                                    <th className="px-6 py-4 text-left">Opsi D</th>
                                    <th className="px-6 py-4 text-left">Kategori</th>
                                    <th className="px-6 py-4 text-left">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {questions.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-6 py-10 text-center text-sm text-white/60"
                                        >
                                            Belum ada soal DAT yang tersedia.
                                        </td>
                                    </tr>
                                )}
                                {questions.map((question) => (
                                    <tr key={question.id} className="hover:bg-white/5">
                                        <td className="px-6 py-4 text-white/90">
                                            {question.question}
                                        </td>
                                        <td className="px-6 py-4 text-white/80">
                                            {question.option_a}
                                        </td>
                                        <td className="px-6 py-4 text-white/80">
                                            {question.option_b}
                                        </td>
                                        <td className="px-6 py-4 text-white/80">
                                            {question.option_c}
                                        </td>
                                        <td className="px-6 py-4 text-white/80">
                                            {question.option_d}
                                        </td>
                                        <td className="px-6 py-4 text-white/70">
                                            {question.category ?? '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        openEditModal(question)
                                                    }
                                                    className="inline-flex items-center gap-1 rounded-full border border-indigo-400/30 px-3 py-1 text-xs text-indigo-200 hover:bg-indigo-500/20"
                                                >
                                                    <Pencil className="h-3 w-3" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(question.id)
                                                    }
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
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-space-dark/80 px-4 py-10">
                    <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-space-mid/70 p-6 text-white shadow-2xl backdrop-blur-md">
                        <div className="mb-6 flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {editingQuestion ? 'Edit Soal DAT' : 'Tambah Soal DAT'}
                                </h2>
                                <p className="mt-1 text-sm text-white/70">
                                    Lengkapi detail soal dan opsi jawaban.
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
                            <div>
                                <label className="text-xs uppercase tracking-widest text-white/70">
                                    Soal
                                </label>
                                <textarea
                                    value={data.question}
                                    onChange={(event) =>
                                        setData('question', event.target.value)
                                    }
                                    rows={3}
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-space-dark/60 p-3 text-sm text-white placeholder:text-white/40 focus:border-indigo-400 focus:ring-0"
                                    placeholder="Tulis pertanyaan DAT..."
                                    required
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                {['a', 'b', 'c', 'd'].map((label) => (
                                    <div key={label}>
                                        <label className="text-xs uppercase tracking-widest text-white/70">
                                            Opsi {label.toUpperCase()}
                                        </label>
                                        <input
                                            value={data[`option_${label}`]}
                                            onChange={(event) =>
                                                setData(
                                                    `option_${label}`,
                                                    event.target.value
                                                )
                                            }
                                            type="text"
                                            className="mt-2 w-full rounded-xl border border-white/10 bg-space-dark/60 p-3 text-sm text-white placeholder:text-white/40 focus:border-indigo-400 focus:ring-0"
                                            placeholder={`Jawaban opsi ${label.toUpperCase()}`}
                                            required
                                        />
                                    </div>
                                ))}
                            </div>

                            <div>
                                <label className="text-xs uppercase tracking-widest text-white/70">
                                    Kategori
                                </label>
                                <input
                                    value={data.category}
                                    onChange={(event) =>
                                        setData('category', event.target.value)
                                    }
                                    type="text"
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-space-dark/60 p-3 text-sm text-white placeholder:text-white/40 focus:border-indigo-400 focus:ring-0"
                                    placeholder="Contoh: Logika, Bahasa, Kuantitatif"
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
                                        : editingQuestion
                                          ? 'Simpan Perubahan'
                                          : 'Tambah Soal'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
