// import Checkbox from '@/Components/Checkbox';
// import InputError from '@/Components/InputError';
// import InputLabel from '@/Components/InputLabel';
// import PrimaryButton from '@/Components/PrimaryButton';
// import TextInput from '@/Components/TextInput';
// import GuestLayout from '@/Layouts/GuestLayout';
// import { Head, Link, useForm } from '@inertiajs/react';

// export default function Login({ status, canResetPassword }) {
//     const { data, setData, post, processing, errors, reset } = useForm({
//         email: '',
//         password: '',
//         remember: false,
//     });

//     const submit = (e) => {
//         e.preventDefault();

//         post(route('login'), {
//             onFinish: () => reset('password'),
//         });
//     };

//     return (
//         <GuestLayout>
//             <Head title="Log in" />

//             {status && (
//                 <div className="mb-4 text-sm font-medium text-green-600">
//                     {status}
//                 </div>
//             )}

//             <form onSubmit={submit}>
//                 <div>
//                     <InputLabel htmlFor="email" value="Email" />

//                     <TextInput
//                         id="email"
//                         type="email"
//                         name="email"
//                         value={data.email}
//                         className="mt-1 block w-full"
//                         autoComplete="username"
//                         isFocused={true}
//                         onChange={(e) => setData('email', e.target.value)}
//                     />

//                     <InputError message={errors.email} className="mt-2" />
//                 </div>

//                 <div className="mt-4">
//                     <InputLabel htmlFor="password" value="Password" />

//                     <TextInput
//                         id="password"
//                         type="password"
//                         name="password"
//                         value={data.password}
//                         className="mt-1 block w-full"
//                         autoComplete="current-password"
//                         onChange={(e) => setData('password', e.target.value)}
//                     />

//                     <InputError message={errors.password} className="mt-2" />
//                 </div>

//                 <div className="mt-4 block">
//                     <label className="flex items-center">
//                         <Checkbox
//                             name="remember"
//                             checked={data.remember}
//                             onChange={(e) =>
//                                 setData('remember', e.target.checked)
//                             }
//                         />
//                         <span className="ms-2 text-sm text-gray-600">
//                             Remember me
//                         </span>
//                     </label>
//                 </div>

//                 <div className="mt-4 flex items-center justify-end">
//                     {canResetPassword && (
//                         <Link
//                             href={route('password.request')}
//                             className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                         >
//                             Forgot your password?
//                         </Link>
//                     )}

//                     <PrimaryButton className="ms-4" disabled={processing}>
//                         Log in
//                     </PrimaryButton>
//                 </div>
//             </form>
//         </GuestLayout>
//     );
// }
import React, { useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPass, setShowPass] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{
                background: "linear-gradient(135deg, #0d0820 0%, #1a1040 50%, #2d1b69 100%)",
            }}
        >
            <Head title="Log in" />

            {/* Glow Background */}
            <div
                className="fixed top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)", filter: "blur(60px)" }}
            />

            <div className="w-full max-w-md relative z-10">
                {/* Logo / Header Section */}
                <div className="text-center mb-8">
                    <Link href={route('dashboard')}>
                        <span
                            className="font-display font-black text-4xl tracking-widest"
                            style={{
                                background: "linear-gradient(135deg, #c4b5fd, #a78bfa)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            NEXA
                        </span>
                    </Link>
                    <p className="text-purple-400 font-syne text-sm mt-2">Masuk ke akunmu</p>
                </div>

                {/* Form Card */}
                <div
                    className="p-7 rounded-2xl"
                    style={{
                        background: "rgba(26,16,64,0.8)",
                        border: "1px solid rgba(167,139,250,0.2)",
                        backdropFilter: "blur(16px)",
                    }}
                >
                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-400 font-syne">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-semibold text-purple-300 mb-2 font-syne">Email</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="nama@email.com"
                                    className="pl-10 w-full rounded-xl border border-white/10 bg-space-dark/60 text-white placeholder-purple-400/50 focus:border-purple-500 focus:ring-purple-500 text-sm nexa-input py-3"
                                    required
                                    autoComplete="username"
                                />
                            </div>
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-semibold text-purple-300 mb-2 font-syne">Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                                <input
                                    id="password"
                                    type={showPass ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10 w-full rounded-xl border border-white/10 bg-space-dark/60 text-white placeholder-purple-400/50 focus:border-purple-500 focus:ring-purple-500 text-sm nexa-input py-3"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass((v) => !v)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white transition-colors"
                                >
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between mt-4">
                            <label className="flex items-center text-purple-300 text-sm font-syne select-none">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-purple-500 text-purple-600 focus:ring-purple-500 bg-space-mid border-white/10"
                                />
                                <span className="ms-2">Remember me</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-purple-400 hover:text-white transition font-syne"
                                >
                                    Forgot your password?
                                </Link>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 mt-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-500 transition shadow-lg disabled:opacity-50 font-syne"
                        >
                            {processing ? 'Memproses...' : 'Masuk'}
                        </button>
                    </form>

                    {/* Link Register */}
                    <p className="text-center text-sm text-purple-400 font-syne mt-6">
                        Belum punya akun?{' '}
                        <Link
                            href={route('register')}
                            className="text-purple-200 hover:text-white font-semibold transition-colors"
                        >
                            Daftar sekarang
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}