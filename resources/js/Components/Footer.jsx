/**
 * Footer - Footer aplikasi NEXA
 * Role-aware: admin/user menu berbeda, jika login tampil Keluar saja
 */

import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { ROUTES } from "../_constants/routes";

export function Footer() {
  const { auth } = usePage().props;
  const user = auth?.user ?? null;
  const isAdmin = user?.role === "admin";

  // Menu navigasi berdasarkan role
  const featureLinks = isAdmin
    ? [
        { label: "Dashboard", href: route("admin.dashboard") },
        { label: "Tes DAT", href: route("admin.dat-tests.index") },
        { label: "Pengguna", href: route("admin.users.index") },
        { label: "Jurusan", href: route("admin.majors.index") },
        { label: "Materi", href: route("admin.study-materials.index") },
      ]
    : [
        { label: "Kesesuaian Jurusan", href: route("jurusan.index") },
        { label: "Ulasan Prodi", href: route("prodi.index") },
        { label: "Belajar", href: route("subtests.index") },
        { label: "Try Out", href: route("tryout.index") },
      ];

  // Menu akun: jika sudah login → Keluar saja, jika belum → Daftar & Masuk
  const accountLinks = user
    ? [{ label: "Keluar", href: route("logout"), method: "post", as: "button" }]
    : [
        { label: "Daftar", href: route("register") },
        { label: "Masuk", href: route("login") },
      ];

  return (
    <footer
      className="mt-20 border-t backdrop-blur"
      style={{ borderColor: "rgba(167,139,250,0.15)" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <span
              className="font-display font-bold text-2xl tracking-widest"
              style={{
                background: "linear-gradient(135deg, #c4b5fd, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              NEXA
            </span>
            <p className="mt-3 text-sm text-purple-400 font-syne leading-relaxed max-w-xs">
              Next-Gen Exam Analytics. Platform analisis peluang masuk program studi berbasis data yang dirancang khusus untuk mahasiswa masa depan.  
            </p>
          </div>

          {/* Navigasi — label berubah sesuai role */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 font-syne">
              {isAdmin ? "Admin" : "Fitur"}
            </h4>
            <ul className="space-y-2.5">
              {featureLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-purple-400 hover:text-purple-200 transition-colors font-syne"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Akun */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 font-syne">Akun</h4>
            <ul className="space-y-2.5">
              {accountLinks.map((item) =>
                item.method === "post" ? (
                  // Tombol Keluar — pakai POST untuk logout
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      method="post"
                      as="button"
                      className="text-sm text-red-400 hover:text-red-200 transition-colors font-syne cursor-pointer"
                    >
                      {item.label}
                    </Link>
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-purple-400 hover:text-purple-200 transition-colors font-syne"
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div
          className="mt-8 pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderColor: "rgba(167,139,250,0.1)" }}
        >
          <p className="text-xs text-purple-500 font-syne">
            © 2026 NEXA. Platform Simulasi UTBK-SNBT.
          </p>
          <p className="text-xs text-purple-600 font-mono">
            v0.1.0-beta
          </p>
        </div>
      </div>
    </footer>
  );
}
