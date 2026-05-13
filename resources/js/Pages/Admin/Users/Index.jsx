import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Pencil, Search, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function UsersIndex() {
    const { users, filters } = usePage().props;
    const userList = users?.data ?? [];
    const paginationLinks = users?.links ?? [];
    const sort = filters?.sort ?? 'created_at';
    const direction = filters?.direction ?? 'desc';
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [search, setSearch] = useState(filters?.search ?? '');

    const { data, setData, put, processing, reset } = useForm({
        role: 'user',
    });

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search !== (filters?.search ?? '')) {
                router.get(
                    route('admin.users.index'),
                    { search, sort, direction },
                    { preserveState: true, replace: true }
                );
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

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

    const handleSort = (key) => {
        const nextDirection =
            sort === key && direction === 'asc' ? 'desc' : 'asc';

        router.get(
            route('admin.users.index'),
            { sort: key, direction: nextDirection, search },
            { preserveState: true, replace: true }
        );
    };

    const sortIndicator = (key) => {
        if (sort !== key) return '';
        return direction === 'asc' ? '↑' : '↓';
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

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-white/40" />
                        </div>
                        <input
                            type="text"
                            className="block w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/40 backdrop-blur-md focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            placeholder="Cari pengguna berdasarkan nama atau email..."
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
                                            Nama
                                            <span className="text-indigo-200/70">
                                                {sortIndicator('name')}
                                            </span>
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-left">Email</th>
                                    <th className="px-6 py-4 text-left">
                                        <button
                                            type="button"
                                            onClick={() => handleSort('role')}
                                            className="inline-flex items-center gap-2 text-left"
                                        >
                                            Role
                                            <span className="text-indigo-200/70">
                                                {sortIndicator('role')}
                                            </span>
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleSort('created_at')
                                            }
                                            className="inline-flex items-center gap-2 text-left"
                                        >
                                            Tanggal Bergabung
                                            <span className="text-indigo-200/70">
                                                {sortIndicator('created_at')}
                                            </span>
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-left">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {userList.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-10 text-center text-sm text-white/60"
                                        >
                                            {search
                                                ? `Tidak ada pengguna yang cocok dengan pencarian "${search}".`
                                                : 'Belum ada pengguna terdaftar.'}
                                        </td>
                                    </tr>
                                )}
                                {userList.map((user) => (
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
