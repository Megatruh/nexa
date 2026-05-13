import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

const spaceInputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#fff',
    borderRadius: '0.625rem',
};

const spaceLabelStyle = {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '0.875rem',
    fontWeight: '500',
    marginBottom: '0.375rem',
    display: 'block',
};

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-5 ${className}`}>
            <header>
                <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4" style={{ color: '#f87171' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <h2 className="text-base font-semibold" style={{ color: '#fca5a5' }}>
                        Hapus Akun
                    </h2>
                </div>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    Setelah akun dihapus, semua data akan hilang secara permanen. Pastikan Anda telah mengunduh data penting sebelum melanjutkan.
                </p>
            </header>

            <button
                onClick={confirmUserDeletion}
                className="px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200"
                style={{
                    background: 'rgba(239,68,68,0.12)',
                    border: '1px solid rgba(239,68,68,0.35)',
                    color: '#f87171',
                    cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239,68,68,0.22)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(239,68,68,0.12)';
                }}
            >
                Hapus Akun
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6 sm:p-8"
                    style={{
                        background: 'linear-gradient(135deg, #0f0c29, #1a1040)',
                        borderRadius: '1rem',
                    }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0"
                            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}
                        >
                            <svg className="w-5 h-5" style={{ color: '#f87171' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-white">
                            Yakin ingin menghapus akun?
                        </h2>
                    </div>

                    <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                        Setelah akun dihapus, semua data akan hilang secara permanen. Masukkan kata sandi Anda untuk konfirmasi.
                    </p>

                    <div className="mb-4">
                        <label htmlFor="delete_password" style={spaceLabelStyle}>Kata Sandi</label>
                        <input
                            id="delete_password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="block w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40 transition"
                            style={spaceInputStyle}
                            placeholder="Masukkan kata sandi"
                            autoFocus
                        />
                        <InputError message={errors.password} className="mt-1.5" />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
                            style={{
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                color: 'rgba(255,255,255,0.7)',
                                cursor: 'pointer',
                            }}
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200"
                            style={{
                                background: processing ? 'rgba(239,68,68,0.4)' : 'rgba(239,68,68,0.85)',
                                border: '1px solid rgba(239,68,68,0.5)',
                                color: '#fff',
                                cursor: processing ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {processing ? 'Menghapus...' : 'Hapus Akun'}
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
