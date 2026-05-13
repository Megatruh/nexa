import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout>
            <Head title="Edit Profil" />

            <div className="py-12 px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mx-auto max-w-4xl mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div
                            className="flex items-center justify-center w-10 h-10 rounded-xl"
                            style={{
                                background: 'linear-gradient(135deg, rgba(196,181,253,0.2), rgba(167,139,250,0.2))',
                                border: '1px solid rgba(196,181,253,0.3)',
                            }}
                        >
                            <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <h1
                                className="text-2xl font-bold tracking-tight"
                                style={{
                                    background: 'linear-gradient(135deg, #c4b5fd, #a78bfa)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Pengaturan Profil
                            </h1>
                            <p className="text-sm text-white/50">Kelola informasi akun dan keamanan Anda</p>
                        </div>
                    </div>
                </div>

                {/* Cards */}
                <div className="mx-auto max-w-4xl space-y-6">
                    {/* Profile Information */}
                    <div
                        className="rounded-2xl p-6 sm:p-8"
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            backdropFilter: 'blur(12px)',
                        }}
                    >
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    {/* Update Password */}
                    <div
                        className="rounded-2xl p-6 sm:p-8"
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            backdropFilter: 'blur(12px)',
                        }}
                    >
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    {/* Delete Account */}
                    <div
                        className="rounded-2xl p-6 sm:p-8"
                        style={{
                            background: 'rgba(239,68,68,0.04)',
                            border: '1px solid rgba(239,68,68,0.15)',
                            backdropFilter: 'blur(12px)',
                        }}
                    >
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
