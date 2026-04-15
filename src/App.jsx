// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

import Navbar        from '@components/layout/Navbar'
import PageWrapper   from '@components/layout/PageWrapper'
import { ROUTES }   from '@/constants/routes'

// Lazy load halaman
import { lazy, Suspense } from 'react'
const Beranda            = lazy(() => import('@pages/Beranda'))
const KesesuaianJurusan  = lazy(() => import('@pages/KesesuaianJurusan'))
const HasilKesesuaian    = lazy(() => import('@pages/KesesuaianJurusan/HasilKesesuaian'))
const UlasanProdi        = lazy(() => import('@pages/UlasanProdi'))
const UlasanProdiDetail  = lazy(() => import('@pages/UlasanProdi/Detail'))
const Belajar            = lazy(() => import('@pages/Belajar'))
const MateriDetail       = lazy(() => import('@pages/Belajar/MateriDetail'))
const TryOut             = lazy(() => import('@pages/TryOut'))
const SoalTryOut         = lazy(() => import('@pages/TryOut/Soal'))
const HasilTryOut        = lazy(() => import('@pages/TryOut/Hasil'))
const Login              = lazy(() => import('@pages/Auth/Login'))
const Register           = lazy(() => import('@pages/Auth/Register'))
const NotFound           = lazy(() => import('@pages/NotFound'))

const queryClient = new QueryClient()

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-nexa-dark">
      <div className="w-8 h-8 border-2 border-nexa-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Navbar />
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path={ROUTES.BERANDA} element={<PageWrapper><Beranda /></PageWrapper>} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
            <Route path={ROUTES.KESESUAIAN_JURUSAN} element={<PageWrapper><KesesuaianJurusan /></PageWrapper>} />
            <Route path={ROUTES.KESESUAIAN_HASIL} element={<PageWrapper><HasilKesesuaian /></PageWrapper>} />
            <Route path={ROUTES.ULASAN_PRODI} element={<PageWrapper><UlasanProdi /></PageWrapper>} />
            <Route path={ROUTES.ULASAN_PRODI_DETAIL} element={<PageWrapper><UlasanProdiDetail /></PageWrapper>} />
            <Route path={ROUTES.BELAJAR} element={<PageWrapper><Belajar /></PageWrapper>} />
            <Route path={ROUTES.BELAJAR_MATERI} element={<PageWrapper><MateriDetail /></PageWrapper>} />
            <Route path={ROUTES.TRY_OUT} element={<PageWrapper><TryOut /></PageWrapper>} />
            <Route path={ROUTES.TRY_OUT_SOAL} element={<SoalTryOut />} />
            <Route path={ROUTES.TRY_OUT_HASIL} element={<PageWrapper><HasilTryOut /></PageWrapper>} />
            <Route path="*"element={<NotFound />} />
          </Routes>
        </Suspense>
        <Toaster position="top-right" toastOptions={{ style: { background: '#1A1535', color: '#fff', border: '1px solid #2D2550' } }} />
      </BrowserRouter>
    </QueryClientProvider>
  )
}