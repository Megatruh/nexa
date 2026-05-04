// import InputError from '@/Components/InputError';
// import InputLabel from '@/Components/InputLabel';
// import PrimaryButton from '@/Components/PrimaryButton';
// import TextInput from '@/Components/TextInput';
// import GuestLayout from '@/Layouts/GuestLayout';
// import { Head, Link, useForm } from '@inertiajs/react';

// export default function Register() {
//     const { data, setData, post, processing, errors, reset } = useForm({
//         name: '',
//         email: '',
//         password: '',
//         password_confirmation: '',
//     });

//     const submit = (e) => {
//         e.preventDefault();

//         post(route('register'), {
//             onFinish: () => reset('password', 'password_confirmation'),
//         });
//     };

//     return (
//         <GuestLayout>
//             <Head title="Register" />

//             <form onSubmit={submit}>
//                 <div>
//                     <InputLabel htmlFor="name" value="Name" />

//                     <TextInput
//                         id="name"
//                         name="name"
//                         value={data.name}
//                         className="mt-1 block w-full"
//                         autoComplete="name"
//                         isFocused={true}
//                         onChange={(e) => setData('name', e.target.value)}
//                         required
//                     />

//                     <InputError message={errors.name} className="mt-2" />
//                 </div>

//                 <div className="mt-4">
//                     <InputLabel htmlFor="email" value="Email" />

//                     <TextInput
//                         id="email"
//                         type="email"
//                         name="email"
//                         value={data.email}
//                         className="mt-1 block w-full"
//                         autoComplete="username"
//                         onChange={(e) => setData('email', e.target.value)}
//                         required
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
//                         autoComplete="new-password"
//                         onChange={(e) => setData('password', e.target.value)}
//                         required
//                     />

//                     <InputError message={errors.password} className="mt-2" />
//                 </div>

//                 <div className="mt-4">
//                     <InputLabel
//                         htmlFor="password_confirmation"
//                         value="Confirm Password"
//                     />

//                     <TextInput
//                         id="password_confirmation"
//                         type="password"
//                         name="password_confirmation"
//                         value={data.password_confirmation}
//                         className="mt-1 block w-full"
//                         autoComplete="new-password"
//                         onChange={(e) =>
//                             setData('password_confirmation', e.target.value)
//                         }
//                         required
//                     />

//                     <InputError
//                         message={errors.password_confirmation}
//                         className="mt-2"
//                     />
//                 </div>

//                 <div className="mt-4 flex items-center justify-end">
//                     <Link
//                         href={route('login')}
//                         className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                     >
//                         Already registered?
//                     </Link>

//                     <PrimaryButton className="ms-4" disabled={processing}>
//                         Register
//                     </PrimaryButton>
//                 </div>
//             </form>
//         </GuestLayout>
//     );
// }
import React, { useState } from 'react';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Register() {
    // 1. Setup Form Inertia bawaan Breeze
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{
                background: "linear-gradient(135deg, #0d0820 0%, #1a1040 50%, #2d1b69 100%)",
            }}
        >
            <Head title="Daftar Akun - NEXA" />

            {/* Glow Background */}
            <div
                className="fixed top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)", filter: "blur(60px)" }}
            />

            <div className="w-full max-w-md relative z-10">
                {/* Logo Section */}
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
                    <p className="text-purple-400 font-syne text-sm mt-2">Buat akun baru</p>
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
                    <form onSubmit={submit} className="space-y-4">
                        {/* Nama */}
                        <div>
                            <label className="block text-sm font-semibold text-purple-300 mb-2 font-syne">Nama Lengkap</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Nama kamu"
                                    className="pl-10 w-full rounded-xl border border-white/10 bg-space-dark/60 text-white placeholder-purple-400/50 focus:border-purple-500 focus:ring-purple-500 text-sm nexa-input py-3"
                                    required
                                    autoComplete="name"
                                />
                            </div>
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        {/* Email */}
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

                        {/* Password */}
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
                                    placeholder="Min. 8 karakter"
                                    className="pl-10 pr-10 w-full rounded-xl border border-white/10 bg-space-dark/60 text-white placeholder-purple-400/50 focus:border-purple-500 focus:ring-purple-500 text-sm nexa-input py-3"
                                    required
                                    autoComplete="new-password"
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

                        {/* Konfirmasi Password */}
                        <div>
                            <label className="block text-sm font-semibold text-purple-300 mb-2 font-syne">Konfirmasi Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                                <input
                                    id="password_confirmation"
                                    type={showConfirmPass ? 'text' : 'password'}
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Ulangi password"
                                    className="pl-10 pr-10 w-full rounded-xl border border-white/10 bg-space-dark/60 text-white placeholder-purple-400/50 focus:border-purple-500 focus:ring-purple-500 text-sm nexa-input py-3"
                                    required
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPass((v) => !v)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white transition-colors"
                                >
                                    {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 mt-6 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-500 transition shadow-lg disabled:opacity-50 font-syne"
                        >
                            {processing ? 'Mendaftarkan...' : 'Buat Akun'}
                        </button>
                    </form>

                    {/* Link Login */}
                    <p className="text-center text-sm text-purple-400 font-syne mt-6">
                        Sudah punya akun?{' '}
                        <Link
                            href={route('login')}
                            className="text-purple-200 hover:text-white font-semibold transition-colors"
                        >
                            Masuk
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}