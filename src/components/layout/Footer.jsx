/**
 * Footer - Footer aplikasi NEXA
 */

import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

export function Footer() {
  return (
    <footer
      className="mt-20 border-t backdrop-blur"
      style={{ borderColor: "rgba(167,139,250,0.15) blur-md" }}
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
              Platform simulasi UTBK-SNBT dan analisis peluang masuk program studi terpercaya.
            </p>
          </div>

          {/* Fitur */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 font-syne">Fitur</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Kesesuaian Jurusan", to: ROUTES.KESESUAIAN },
                { label: "Ulasan Prodi", to: ROUTES.ULASAN_PRODI },
                { label: "Materi Belajar", to: ROUTES.BELAJAR_MATERI },
                { label: "Latihan Soal", to: ROUTES.BELAJAR_LATIHAN },
                { label: "Try Out", to: ROUTES.TRYOUT },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
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
              {[
                { label: "Daftar", to: ROUTES.REGISTER },
                { label: "Masuk", to: ROUTES.LOGIN },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-purple-400 hover:text-purple-200 transition-colors font-syne"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-8 pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderColor: "rgba(167,139,250,0.1)" }}
        >
          <p className="text-xs text-purple-500 font-syne">
            © 2025 NEXA. Platform Simulasi UTBK-SNBT.
          </p>
          <p className="text-xs text-purple-600 font-mono">
            v0.1.0-beta
          </p>
        </div>
      </div>
    </footer>
  );
}
