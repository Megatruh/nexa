import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, children, ...props }) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-purple-400 text-white' // Warna saat menu aktif (Nexa Style)
                    : 'border-transparent text-purple-300 hover:text-white hover:border-purple-300') // Warna saat biasa
            }
        >
            {children}
        </Link>
    );
}