import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
// Import NavLink bawaan Breeze agar bisa dipakai di Navbar
import NavLink from '@/Components/NavLink';
import { Footer } from '../Components/Footer';

// Komponen bintang-bintang di background
function StarField() {
  const stars = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 4,
      opacity: Math.random() * 0.6 + 0.2,
    }));
  }, []);

  return (
    <div className="stars-bg">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            "--duration": `${star.duration}s`,
            "--delay": `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function AuthenticatedLayout({ header, children }) {
    const {auth} = usePage().props;
    const user = auth.user;
    const isAdmin = user?.role === 'admin';

    const adminNavItems = [
        {
            label: 'Dashboard Admin',
            href: route('admin.dashboard'),
            active: route().current('admin.dashboard'),
        },
        {
            label: 'Tes DAT',
            href: route('admin.dat-tests.index'),
            active: route().current('admin.dat-tests.index'),
        },
        {
            label: 'Pengguna',
            href: route('admin.users.index'),
            active: route().current('admin.users.index'),
        },
        {
            label: 'Jurusan',
            href: route('admin.majors.index'),
            active: route().current('admin.majors.index'),
        },
        {
            label: 'Materi',
            href: route('admin.study-materials.index'),
            active: route().current('admin.study-materials.index'),
        },
        {
            label: 'Tryout',
            href: route('admin.tryouts.index'),
            active: route().current('admin.tryouts.index'),
        },
    ];

    const userNavItems = [
        {
            label: 'Beranda',
            href: route('dashboard'),
            active: route().current('dashboard'),
        },
        {
            label: 'Kesesuaian Jurusan',
            href: route('jurusan.index'),
            active: route().current('jurusan.index'),
        },
        {
            label: 'Ulasan Prodi',
            href: route('prodi.index'),
            active: route().current('prodi.index'),
        },
        {
            label: 'Belajar',
            href: route('subtests.index'),
            active: route().current('subtests.index'),
        },
        {
            label: 'Try Out',
            href: user ? route('tryout.index') : route('login'),
            active: route().current('tryout.index'),
        },
    ];

    const navigation = isAdmin ? adminNavItems : userNavItems;
    const mobileNavClass = (active) =>
        `rounded-xl border border-white/10 border-l-0 px-4 py-2 text-sm font-medium transition ${
            active
                ? 'bg-space-mid/60 text-white border-purple-400'
                : 'text-white/70 hover:text-white hover:border-purple-300 hover:bg-white/5'
        }`;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-space-gradient pt-24">
            <StarField/>
            <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 rounded-2xl border border-white/10 bg-space-dark/60 backdrop-blur-lg shadow-2xl shadow-purple-900/20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex mx-8">
                            <div className="flex shrink-0 items-center">
                                <Link href={isAdmin ? route('admin.dashboard') : route('dashboard')}>
                                    {/* <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" /> */}
                                    <span
                                        className="font-display font-bold text-xl tracking-widest"
                                        style={{
                                        background: "linear-gradient(135deg, #c4b5fd, #a78bfa)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        }}
                                    >
                                        NEXA
                                    </span>
                                </Link>
                            </div>

                            <div className="hidden space-x-4 sm:-my-px sm:ms-10 sm:flex">
                                {navigation.map((item) => (
                                    <NavLink
                                        key={item.label}
                                        href={item.href}
                                        active={item.active}
                                    >
                                        {item.label}
                                    </NavLink>
                                ))}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            {user ? (
                               <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent px-3 py-2 text-sm font-medium leading-4 text-gray-200 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none cursor-pointer"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                                </div> 
                            ) : (
                                // kalau belum login
                                <div className="flex space-x-4">
                                    <Link
                                        href={route('login')}
                                        className="rounded-md px-4 py-2 text-sm my-auto font-medium text-white hover:bg-white/5"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-indigo-700"
                                    >
                                        Daftar
                                    </Link>
                                </div>
                            )}
                            
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        {navigation.map((item) => (
                            <ResponsiveNavLink
                                key={item.label}
                                href={item.href}
                                active={item.active}
                                className={mobileNavClass(item.active)}
                            >
                                {item.label}
                            </ResponsiveNavLink>
                        ))}
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user?.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user?.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
            {/* Pasang Footer di sini agar muncul di semua halaman */}
            <Footer />
        </div>
    );
}
