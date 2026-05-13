import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

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

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h2 className="text-base font-semibold text-white">
                        Informasi Profil
                    </h2>
                </div>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    Perbarui nama dan alamat email akun Anda.
                </p>
            </header>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label htmlFor="name" style={spaceLabelStyle}>Nama</label>
                    <input
                        id="name"
                        type="text"
                        className="block w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
                        style={spaceInputStyle}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                    />
                    <InputError className="mt-1.5" message={errors.name} />
                </div>

                <div>
                    <label htmlFor="email" style={spaceLabelStyle}>Email</label>
                    <input
                        id="email"
                        type="email"
                        className="block w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
                        style={spaceInputStyle}
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-1.5" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div
                        className="rounded-xl px-4 py-3 text-sm"
                        style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)', color: '#fde68a' }}
                    >
                        Email Anda belum diverifikasi.{' '}
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="underline hover:no-underline"
                            style={{ color: '#c4b5fd' }}
                        >
                            Klik di sini untuk kirim ulang email verifikasi.
                        </Link>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2" style={{ color: '#86efac' }}>
                                Link verifikasi baru telah dikirim ke email Anda.
                            </div>
                        )}
                    </div>
                )}

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
