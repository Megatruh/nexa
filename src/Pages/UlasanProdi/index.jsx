  import { useState, useMemo } from 'react'
  import { useQuery } from '@tanstack/react-query'
  import { Search } from 'lucide-react'
  import ProdiCard from '@components/shared/ProdiCard'
  import { getSemuaProdi } from '../../services/prodiService'

  const KATEGORI = ['Semua', 'Teknologi', 'Kesehatan', 'Bisnis', 'Sosial', 'Teknik', 'Seni', 'Sains']

  //mock data untuk testing
  const MOCK_PRODI = [
    { id: 1, nama: 'Teknik Informatika', universitas: 'ITB', slug: 'teknik-informatika-itb', kategori: 'Teknologi' },
    { id: 2, nama: 'Sistem Informasi', universitas: 'UI', slug: 'sistem-informasi-ui', kategori: 'Teknologi' },
    { id: 3, nama: 'Ilmu Komputer', universitas: 'UGM', slug: 'ilmu-komputer-ugm', kategori: 'Teknologi' },
    { id: 4, nama: 'Kedokteran', universitas: 'UNAIR', slug: 'kedokteran-unair', kategori: 'Kesehatan' },
    { id: 5, nama: 'Keperawatan', universitas: 'UI', slug: 'keperawatan-ui', kategori: 'Kesehatan' },
    { id: 6, nama: 'Farmasi', universitas: 'ITB', slug: 'farmasi-itb', kategori: 'Kesehatan' },
    { id: 7, nama: 'Akuntansi', universitas: 'Universitas Indonesia', slug: 'akuntansi-ui', kategori: 'Bisnis' },
    { id: 8, nama: 'Manajemen', universitas: 'IPB', slug: 'manajemen-ipb', kategori: 'Bisnis' },
    { id: 9, nama: 'Hukum', universitas: 'UNPAD', slug: 'hukum-unpad', kategori: 'Sosial' },
  ]

  export default function UlasanProdi() {
    const [search, setSearch] = useState('')
    const [kategori, setKategori] = useState('Semua')

    const { data: prodiList =[], isLoading, error } = useQuery({
      queryKey: ['prodi'],
      queryFn: getSemuaProdi,
      retry: false,
    })

    const actualData = Array.isArray(prodiList) ? prodiList : (prodiList?.data || []);
    const isDataValid = Array.isArray(actualData) && actualData.length > 0;
    // menggunakan mock data jika API gagal atau belum tersedia
    const displayData = error || !isDataValid ? MOCK_PRODI : actualData;

    const filtered = useMemo(() =>
      displayData.filter(p => {
        const matchSearch   = p.nama.toLowerCase().includes(search.toLowerCase())
        const matchKategori = kategori === 'Semua' || p.kategori === kategori
        return matchSearch && matchKategori
      }),
      [displayData, search, kategori]
    )

    return (
      <div className='max-w-7xl mx-auto px-6 py-12'>
        <h1 className='font-display font-bold text-3xl text-white mb-2'>Ulasan Program Studi</h1>
        <p className='text-white/50 mb-8'> Jelajahi program studi di berbagai perguruan tinggi Indonesia</p>

        {error && (
          <div className='bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-6 text-yellow-200 text-sm'>⚠️ Menampilkan data contoh. Hubungkan ke API backend untuk data lengkap.</div>
        )}

        {/* search */}
          <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari Program Studi..."
            className="w-full max-w-md pl-11 pr-4 py-3 rounded-xl bg-nexa-card border border-nexa-border text-white placeholder-white/30 focus:outline-none focus:border-nexa-primary transition-colors"
          />
        </div>

        {/* filter kategori */}
        <div className='flex flex-wrap gap-2 mb-10'>
          {KATEGORI.map(k =>(
            <button 
              key={k}
              onClick={()=> setKategori(k)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${k === kategori ? 'bg-white text-nexa-dark' : 'bg-nexa-card border border-nexa-border text-white/60 hover:text-white hover:border-nexa-primary/50'}`}
            >
              {k}
            </button>
          ))}
        </div>

        {/* grid */}
        {isLoading && prodiList.length === 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {Array(9).fill(0).map((_, i)=>(
              <div key={i} className="h-32 rounded-2xl bg-nexa-card border border-nexa-border animate-pulse" />
            ))}
          </div>
        ): (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filtered.length > 0 ? (
              filtered.map(prodi => <ProdiCard key={prodi.id} prodi={prodi}/>)
            ):(
              <div className='col-span-full text-center py-12 text-white/60'>Tidak ada program studi yang cocok dengan pencarian anda</div>
            )}
          </div>
        )}
      </div>
    )
  }