import { Link, useLocation } from "react-router-dom";
import { User as UserIcon, ChevronDown } from "lucide-react";
import { ROUTES } from '@/constants/routes';
import useAuthStore from '@store/authStore';

  const navLinks = [
    { label: 'Beranda', to: ROUTES.BERANDA },
    { label: 'Kesesuaian Jurusan', to: ROUTES.KESESUAIAN_JURUSAN },
    { label: 'Ulasan Prodi', to: ROUTES.ULASAN_PRODI },
    { label: 'Belajar', to: ROUTES.BELAJAR, hasDropdown: true  },
    { label: 'Try Out', to: ROUTES.TRY_OUT },
  ]

  export default function Navbar() {
    const { pathname } = useLocation();
    const { User } = useAuthStore();

    return (
      <nav className="sticky top-0 z-50 bg-[#1a0e3a]/90 backdrop-blur-md border-b border-nexa-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to={ROUTES.BERANDA} className="font-display font-bold text-2xl text-nexa-primary tracking-wide">
            NEXA
          </Link>

          {/* nav link */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link)=> (
              <li key={link.to} className="relative group">
                <Link
                  to={link.to}
                  className={`flex items-center gap-1 font-medium transition-colors duration-200
                    ${pathname === link.to ? 'text-white font-semibold' : 'text-white/60 hover:text-white'}`}
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown size={14} />}
                </Link>
              </li>
            ))}
          </ul>

          {/* auth icon */}
          <button className="w-9 h-9 rounded-full border border-nexa-border flex items-center justify-center text-white/70 hover:text-white hover:border-nexa-primary transition-all">
            <UserIcon size={18} />
          </button>
        </div>
      </nav>
    )
  }