/**
 * App.jsx - Root komponen & routing NEXA
 * Mendefinisikan semua route dan lazy loading halaman
 */

import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "./constants/routes";
import { FullPageLoader } from "./components/ui/Spinner";

// Lazy loading semua halaman untuk performa optimal
const Beranda                 = lazy(() => import("./pages/Beranda"));
const KesesuaianJurusan       = lazy(() => import("./pages/KesesuaianJurusan"));
const HasilKesesuaian         = lazy(() => import("./pages/KesesuaianJurusan/HasilKesesuaian"));
const UlasanProdi             = lazy(() => import("./pages/UlasanProdi"));
const DetailProdi             = lazy(() => import("./pages/UlasanProdi/Detail"));
const MateriList              = lazy(() => import("./pages/Belajar"));
const MateriDetail            = lazy(() => import("./pages/Belajar/MateriDetail"));
const LatihanSoal             = lazy(() => import("./pages/Belajar/LatihanSoal"));
const LatihanDetail           = lazy(() => import("./pages/Belajar/MateriDetail")); // reuse dengan mode latihan
const TryOut                  = lazy(() => import("./pages/TryOut"));
const TryOutSoal              = lazy(() => import("./pages/TryOut/Soal"));
const HasilTryOut             = lazy(() => import("./pages/TryOut/Hasil"));
const Login                   = lazy(() => import("./pages/Auth/Login"));
const Register                = lazy(() => import("./pages/Auth/Register"));
const NotFound                = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<FullPageLoader message="Memuat halaman..." />}>
        <Routes>
          {/* Beranda */}
          <Route path={ROUTES.HOME} element={<Beranda />} />

          {/* Kesesuaian Jurusan */}
          <Route path={ROUTES.KESESUAIAN} element={<KesesuaianJurusan />} />
          <Route path={ROUTES.HASIL_KESESUAIAN} element={<HasilKesesuaian />} />

          {/* Ulasan Prodi */}
          <Route path={ROUTES.ULASAN_PRODI} element={<UlasanProdi />} />
          <Route path={ROUTES.ULASAN_PRODI_DETAIL} element={<DetailProdi />} />

          {/* Belajar */}
          <Route path={ROUTES.BELAJAR_MATERI} element={<MateriList />} />
          <Route path="/belajar/materi/:subtes" element={<MateriDetail />} />
          <Route path={ROUTES.BELAJAR_LATIHAN} element={<LatihanSoal />} />
          <Route path="/belajar/latihan-soal/:subtes" element={<LatihanDetail />} />

          {/* Try Out */}
          <Route path={ROUTES.TRYOUT} element={<TryOut />} />
          <Route path={ROUTES.TRYOUT_SOAL} element={<TryOutSoal />} />
          <Route path={ROUTES.TRYOUT_HASIL} element={<HasilTryOut />} />

          {/* Auth */}
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />

          {/* 404 */}
          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
