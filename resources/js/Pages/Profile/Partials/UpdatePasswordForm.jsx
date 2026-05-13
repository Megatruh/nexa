import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

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

const spaceSaveBtnStyle = {
    background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
    border: 'none',
    color: '#fff',
    borderRadius: '0.625rem',
    padding: '0.5rem 1.25rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
};

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h2 className="text-base font-semibold text-white">
                        Ubah Kata Sandi
                    </h2>
                </div>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    Gunakan kata sandi yang panjang dan acak agar akun Anda tetap aman.
                </p>
            </header>

            <form onSubmit={updatePassword} className="space-y-5">
                <div>
                    <label htmlFor="current_password" style={spaceLabelStyle}>Kata Sandi Saat Ini</label>
                    <input
                        id="current_password"
                        type="password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        className="block w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
                        style={spaceInputStyle}
                        autoComplete="current-password"
                    />
                    <InputError message={errors.current_password} className="mt-1.5" />
                </div>

                <div>
                    <label htmlFor="password" style={spaceLabelStyle}>Kata Sandi Baru</label>
                    <input
                        id="password"
                        type="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="block w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
                        style={spaceInputStyle}
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                <div>
                    <label htmlFor="password_confirmation" style={spaceLabelStyle}>Konfirmasi Kata Sandi</label>
                    <input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        className="block w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
                        style={spaceInputStyle}
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password_confirmation} className="mt-1.5" />
                </div>

                <div className="flex items-center gap-4 pt-1">
                    <button
                        type="submit"
                        disabled={processing}
                        style={{ ...spaceSaveBtnStyle, opacity: processing ? 0.6 : 1 }}
                    >
                        Simpan
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0 translate-y-1"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm flex items-center gap-1" style={{ color: '#86efac' }}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Tersimpan.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
