/**
 * Navbar - Navigasi utama aplikasi NEXA
 * Fitur: navigasi antar halaman, dropdown Belajar, toggle login/profil
 */

import React, { useState, useRef, useEffect } from "react";
import { Link } from "@inertiajs/react";
import {
  ChevronDown, User, LogOut, BookOpen, FileText,
  Brain, Target, Star
} from "lucide-react";
import { ROUTES } from "../../_constants/routes";
import { useAuthStore } from "../../_store/authStore";
import NavLink from '@/Components/NavLink';

export function Navbar() {
  const [belajarOpen, setBelajarOpen] = useState(false);
  const [profilOpen, setProfilOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profilRef = useRef(null);
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  // const navigate = useNavigate();

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setBelajarOpen(false);
      if (!profilRef.current?.contains(e.target)) setProfilOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `text-sm font-semibold font-syne transition-colors duration-200 px-1 py-0.5
    ${isActive ? "text-white" : "text-purple-300 hover:text-white"}`;

  return (
    <nav className="relative z-40">
      <div
        className="mx-4 mt-4 rounded-2xl px-6 py-3 flex items-center justify-between"
        style={{
          background: "linear-gradient(135deg, rgba(45,27,105,0.6) 0%, rgba(26,16,64,0.8) 100%)",
          border: "1px solid rgba(167,139,250,0.2)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Logo */}
        <Link to={ROUTES.HOME} className="flex items-center gap-2">
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

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-7">
          <NavLink href={route('dashboard')} active={route().current('dashboard')}>
              Dashboard
          </NavLink>

          <NavLink to={ROUTES.KESESUAIAN} className={navLinkClass}>
            Kesesuaian Jurusan
          </NavLink>

          <NavLink to={ROUTES.ULASAN_PRODI} className={navLinkClass}>
            Ulasan Prodi
          </NavLink>

          {/* Dropdown Belajar */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setBelajarOpen((v) => !v)}
              className={`flex items-center gap-1 text-sm font-semibold font-syne transition-colors duration-200
                ${belajarOpen ? "text-white" : "text-purple-300 hover:text-white"}`}
            >
              Belajar <ChevronDown size={14} className={`transition-transform ${belajarOpen ? "rotate-180" : ""}`} />
            </button>

            {belajarOpen && (
              <div
                className="absolute top-full mt-2 left-0 w-52 rounded-xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #1a1040, #0d0820)",
                  border: "1px solid rgba(167,139,250,0.25)",
                  boxShadow: "0 16px 48px rgba(91,33,182,0.3)",
                }}
              >
                <Link
                  to={ROUTES.BELAJAR_MATERI}
                  onClick={() => setBelajarOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-purple-300 hover:text-white hover:bg-purple-500/15 transition-colors font-syne"
                >
                  <BookOpen size={16} />
                  Materi Belajar
                </Link>
                <Link
                  to={ROUTES.BELAJAR_LATIHAN}
                  onClick={() => setBelajarOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-purple-300 hover:text-white hover:bg-purple-500/15 transition-colors font-syne"
                >
                  <FileText size={16} />
                  Latihan Soal
                </Link>
              </div>
            )}
          </div>

          <NavLink to={ROUTES.TRYOUT} className={navLinkClass}>
            Try Out
          </NavLink>
        </div>

        {/* Auth area */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative" ref={profilRef}>
              <button
                onClick={() => setProfilOpen((v) => !v)}
                className="flex items-center gap-2 p-1.5 rounded-full text-purple-300 hover:text-white transition-colors"
                style={{ border: "1px solid rgba(167,139,250,0.3)" }}
              >
                <User size={20} />
              </button>

              {profilOpen && (
                <div
                  className="absolute top-full right-0 mt-2 w-52 rounded-xl overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #1a1040, #0d0820)",
                    border: "1px solid rgba(167,139,250,0.25)",
                    boxShadow: "0 16px 48px rgba(91,33,182,0.3)",
                  }}
                >
                  <div className="px-4 py-3 border-b border-purple-500/20">
                    <p className="text-sm font-bold text-white font-syne truncate">{user?.nama}</p>
                    <p className="text-xs text-purple-400 font-syne truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      clearAuth();
                      setProfilOpen(false);
                      navigate(ROUTES.LOGIN);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors font-syne"
                  >
                    <LogOut size={16} />
                    Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to={ROUTES.LOGIN}
              className="flex items-center p-1.5 rounded-full text-purple-300 hover:text-white transition-colors"
              style={{ border: "1px solid rgba(167,139,250,0.3)" }}
            >
              <User size={20} />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
