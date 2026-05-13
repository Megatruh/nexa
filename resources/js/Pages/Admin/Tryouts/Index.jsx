import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function StudyMaterialsIndex() {
    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Tryout" />

            <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
                <div className="rounded-2xl border border-white/10 bg-space-mid/50 p-8 text-white backdrop-blur-md">
                    <h1 className="text-2xl font-semibold">
                        Manajemen Tryout
                    </h1>
                    <p className="mt-2 text-sm text-white/70">
                        Fitur ini sedang dalam tahap pengembangan.
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
