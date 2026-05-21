import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-[#0f0826] pt-6 sm:justify-center sm:pt-0">
            <div className="flex flex-col items-center mb-2">
                {/* <Link href="/" className="transition-transform duration-300 hover:scale-110">
                    <ApplicationLogo className="h-28 w-28 fill-current text-purple-400 drop-shadow-lg drop-shadow-purple-500/50" />
                </Link> */}
                <h1 className="mt-4 text-3xl font-bold text-white tracking-wider">NEXA</h1>
                <p className="text-xs text-purple-300/60 font-medium mt-1">Next-Gen Exam Analitics</p>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white/5 backdrop-blur-lg border border-white/10 px-8 py-8 shadow-2xl shadow-purple-950/50 sm:max-w-md sm:rounded-2xl">
                {children}
            </div>
        </div>
    );
}
