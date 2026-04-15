import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, ArrowRight } from 'lucide-react' 
import { Link, useSearchParams } from 'react-router-dom'
import { getSemuaMateri } from '../../services/materiService'

// mock data materi
const MOCK_MATERI = [
  { id: 1, judul: 'Persamaan Kuadrat', deskripsi: 'Pelajari cara menyelesaikan persamaan kuadrat dengan berbagai metode', kategori: 'matematika' },
  { id: 2, judul: 'Trigonometri Dasar', deskripsi: 'Memahami konsep sin, cos, dan tan dalam segitiga', kategori: 'matematika' },
  { id: 3, judul: 'Integral dan Diferensial', deskripsi: 'Kalkulus tingkat lanjut untuk UTBK', kategori: 'matematika' },
  { id: 4, judul: 'Gerak Lurus Berubah Beraturan', deskripsi: 'Memahami konsep GLBB dengan contoh praktis', kategori: 'fisika' },
  { id: 5, judul: 'Hukum Newton', deskripsi: 'Tiga hukum gerak Newton dan aplikasinya', kategori: 'fisika' },
  { id: 6, judul: 'Optik Geometris', deskripsi: 'Pemantulan dan pembiasan cahaya', kategori: 'fisika' },
  { id: 7, judul: 'Reaksi Kimia', deskripsi: 'Jenis-jenis reaksi dan stoikiometri', kategori: 'kimia' },
  { id: 8, judul: 'Asam Basa', deskripsi: 'Konsep pH, buffer, dan titrasi', kategori: 'kimia' },
  { id: 9, judul: 'Termodinamika', deskripsi: 'Energi, kalor, dan entropi dalam kimia', kategori: 'kimia' },
  { id: 10, judul: 'Struktur Sel', deskripsi: 'Bagian-bagian sel dan fungsinya', kategori: 'biologi' },
  { id: 11, judul: 'Fotosintesis', deskripsi: 'Proses dan hasil fotosintesis pada tumbuhan', kategori: 'biologi' },
  { id: 12, judul: 'Genetika Mendel', deskripsi: 'Hukum pewarisan sifat dan penysilangan', kategori: 'biologi' },
]

const KATEGORI = [
  { value: 'semua', label: 'Semua Materi' },
  { value: 'matematika', label: 'Matematika' },
  { value: 'fisika', label: 'Fisika' },
  { value: 'kimia', label: 'Kimia' },
  { value: 'biologi', label: 'Biologi' },
]

export default function Belajar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const kategori = searchParams.get('kategori') || 'semua'

  
  const { data: materiList = [], isLoading, error } = useQuery({
    queryKey: ['materi', kategori],
    queryFn: () => getSemuaMateri(),
    retry: false,
  })

  const actualData = Array.isArray(materiList) ? materiList : (materiList?.data || []);
  const isDataValid = Array.isArray(actualData) && actualData.length > 0;
  
  const displayData = error || !isDataValid ? MOCK_MATERI : actualData;

  const filtered = useMemo(() => {
    if (kategori === 'semua') return displayData
    return displayData.filter(m => m.kategori === kategori)
  }, [displayData, kategori])

  const handleKategoriChange = (value) => {
    setSearchParams({ kategori: value })
  }

  return (
    <div className='max-w-7xl mx-auto px-6 py-12'>
      <h1 className='font-display font-bold text-3xl text-white mb-2'>Materi Belajar UTBK-SNBT</h1>
      <p className='text-white/60 mb-8'>Akses materi lengkap dalam format terstruktur</p>

      {error && (
        <div className='bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-6 text-yellow-200 text-sm'>
          ⚠️ Menampilkan data contoh. Hubungkan ke API backend untuk data lengkap.
        </div>
      )}

      {/* filter dropdown */}
      <div className='mb-8 flex items-center gap-4'>
        <label className='text-white font-medium '>Filter Kategori:</label>
        <select
          value={kategori}
          onChange={(e) => handleKategoriChange(e.target.value)}
          className='bg-nexa-card border border-nexa-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-nexa-primary cursor-pointer transition-colors'
        >
          {KATEGORI.map(k => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </select>
      </div>

      {/* materi grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {isLoading && !isDataValid ? (
          // FIX: fil(0) -> fill(0)
          Array(6).fill(0).map((_, i) => (
            <div key={i} className='h-32 rounded-lg bg-nexa-card border border-nexa-border animate-pulse' />
          ))
        ) : filtered.length > 0 ? (
          filtered.map((materi) => (
            <Link key={materi.id} to={`/belajar?${materi.id}`} className='group'>
              <div className='bg-nexa-card border border-nexa-border rounded-lg p-6 hover:border-nexa-primary transition-all h-full'>
                <div className='flex items-center gap-3 mb-3'>
                  <BookOpen className='text-nexa-primary' />
                  <span className='text-xs bg-nexa-primary/20 text-nexa-primary px-2 py-1 rounded'>
                    {materi.kategori}
                  </span>
                </div>
                <h3 className='font-semibold text-white mb-2'>{materi.judul}</h3>
                <p className='text-white/60 text-sm mb-4'>{materi.deskripsi}</p>
                <div className='flex items-center text-nexa-primary text-sm font-medium group-hover:gap-2 transition-all'>
                  Belajar <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className='col-span-full text-center py-12 text-white/60'>Belum ada materi untuk kategori ini.</div>
        )}
      </div>
    </div>
  )
}