import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function UsersIndex() {
    const users = usePage().props.users ?? [];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const { data, setData, put, processing, reset } = useForm({
        role: 'user',
    });

    const openEditRole = (user) => {
        setSelectedUser(user);
        setData('role', user.role ?? 'user');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
        reset();
    };

    const submitRoleUpdate = (event) => {
        event.preventDefault();
        if (!selectedUser?.id) return;

        put(route('admin.users.update-role', selectedUser.id), {
            onSuccess: closeModal,
        });
    };

    const handleDelete = (id) => {
        if (confirm('Hapus pengguna ini? Tindakan tidak dapat dibatalkan.')) {
            router.delete(route('admin.users.destroy', id));
        }
    };

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Pengguna" />

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
                            Manajemen Pengguna
                        </h1>
                        <p className="mt-2 text-sm text-white/70">
                            Kelola role dan status akun pengguna NEXA.
                        </p>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-space-mid/50 backdrop-blur-md">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-white/10 text-sm text-white">
                            <thead className="bg-space-dark/60 text-xs uppercase tracking-widest text-white/70">
                                <tr>
                                    <th className="px-6 py-4 text-left">Nama</th>
                                    <th className="px-6 py-4 text-left">Email</th>
                                    <th className="px-6 py-4 text-left">Role</th>
                                    <th className="px-6 py-4 text-left">Tanggal Bergabung</th>
                                    <th className="px-6 py-4 text-left">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-10 text-center text-sm text-white/60"
                                        >
                                            Belum ada pengguna terdaftar.
                                        </td>
                                    </tr>
                                )}
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/5">
                                        <td className="px-6 py-4 text-white/90">
                                            {user.name}
                                        </td>
                                        <td className="px-6 py-4 text-white/80">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 text-white/70">
                                            <span className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs uppercase tracking-widest text-indigo-200">
                                                {user.role ?? 'user'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-white/70">
                                            {formatDate(user.created_at)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        openEditRole(user)
                                                    }
                                                    className="inline-flex items-center gap-1 rounded-full border border-indigo-400/30 px-3 py-1 text-xs text-indigo-200 hover:bg-indigo-500/20"
                                                >
                                                    <Pencil className="h-3 w-3" />
                                                    Edit Role
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(user.id)
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
                    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-space-mid/70 p-6 text-white shadow-2xl backdrop-blur-md">
                        <div className="mb-5 flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Update Role Pengguna
                                </h2>
                                <p className="mt-1 text-sm text-white/70">
                                    Ubah role untuk {selectedUser?.name}.
                                </p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="text-sm text-white/60 hover:text-white"
                            >
                                Tutup
                            </button>
                        </div>

                        <form onSubmit={submitRoleUpdate} className="space-y-4">
                            <div>
                                <label className="text-xs uppercase tracking-widest text-white/70">
                                    Role
                                </label>
                                <select
                                    value={data.role}
                                    onChange={(event) =>
                                        setData('role', event.target.value)
                                    }
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-space-dark/60 p-3 text-sm text-white focus:border-indigo-400 focus:ring-0"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </select>
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
                                        : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
