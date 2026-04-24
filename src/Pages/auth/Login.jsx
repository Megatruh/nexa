/**
 * Login - Halaman masuk akun NEXA
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email dan password harus diisi.");
      return;
    }
    const res = await login(email, password);
    if (!res.success) setError(res.message || "Login gagal.");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #0d0820 0%, #1a1040 50%, #2d1b69 100%)",
      }}
    >
      {/* Glow */}
      <div
        className="fixed top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)", filter: "blur(60px)" }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to={ROUTES.HOME}>
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

        {/* Form card */}
        <div
          className="p-7 rounded-2xl"
          style={{
            background: "rgba(26,16,64,0.8)",
            border: "1px solid rgba(167,139,250,0.2)",
            backdropFilter: "blur(16px)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-purple-300 mb-2 font-syne">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="nexa-input pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-purple-300 mb-2 font-syne">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="nexa-input pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-400 font-syne bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="nexa-btn-primary w-full py-3 mt-2"
            >
              {isLoading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          {/* Link register */}
          <p className="text-center text-sm text-purple-400 font-syne mt-6">
            Belum punya akun?{" "}
            <Link to={ROUTES.REGISTER} className="text-purple-200 hover:text-white font-semibold transition-colors">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
