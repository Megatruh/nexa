import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Play, Clock, BarChart3 } from 'lucide-react'
import Button from '@components/ui/Button'
import { getSemuaPaketTryOut } from '../../services/tryOutService'

// Mock data paket try out
const MOCK_PAKET = [
  {
    id: 1,
    nama: 'Try Out UTBK Full 1',
    deskripsi: 'Simulasi lengkap UTBK dengan 135 soal untuk semua subtes',
    durasi: 105,
    jumlahSoal: 135,
  },
  {
    id: 2,
    nama: 'Try Out UTBK Full 2',
    deskripsi: 'Simulasi lengkap UTBK dengan 135 soal set ke-2',
    durasi: 105,
    jumlahSoal: 135,
  },
  {
    id: 3,
    nama: 'Try Out Penalaran Umum',
    deskripsi: 'Fokus pada subtes PU dengan 30 soal',
    durasi: 30,
    jumlahSoal: 30,
  },
  {
    id: 4,
    nama: 'Try Out Pemahaman IPA',
    deskripsi: 'Fokus pada subtes IPA dengan 60 soal',
    durasi: 60,
    jumlahSoal: 60,
  },
]

export default function TryOut() {
  const navigate = useNavigate()

  const { data: paketList = [], isLoading, error } = useQuery({
    queryKey: ['paket-tryout'],
    queryFn: () => getSemuaPaketTryOut(),
    retry: false,
  })

  // Gunakan mock data jika API gagal
  const displayData = error || paketList.length === 0 ? MOCK_PAKET : paketList

  const handleStartTryOut = (paketId) => {
    navigate(`/try-out/${paketId}/soal`)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="font-display font-bold text-3xl text-white mb-2">Try Out UTBK-SNBT</h1>
        <p className="text-white/60">Simulasi ujian dengan pengacakan soal dinamis dan analisis skor real-time</p>
      </div>

      {error && (
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-6 text-yellow-200 text-sm">
          ⚠️ Menampilkan data contoh. Hubungkan ke API backend untuk data lengkap.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-40 rounded-lg bg-nexa-card border border-nexa-border animate-pulse" />
          ))
        ) : displayData.length > 0 ? (
          displayData.map((paket) => (
            <div key={paket.id} className="bg-nexa-card border border-nexa-border rounded-lg p-6 hover:border-nexa-primary/50 transition-all">
              <h3 className="font-semibold text-white text-lg mb-2">{paket.nama}</h3>
              <p className="text-white/60 text-sm mb-4">{paket.deskripsi}</p>

              <div className="space-y-2 mb-6 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <Clock size={16} /> Durasi: {paket.durasi} menit
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 size={16} /> Jumlah Soal: {paket.jumlahSoal}
                </div>
              </div>

              <Button 
                onClick={() => handleStartTryOut(paket.id)}
                className="w-full"
              >
                <Play size={16} /> Mulai Try Out
              </Button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-white/60">Belum ada paket try out</div>
        )}
      </div>

      <div className="bg-nexa-card border border-nexa-border rounded-lg p-8">
        <h2 className="font-semibold text-white mb-4 text-lg">Tips Mengerjakan Try Out</h2>
        <ul className="space-y-3 text-white/80">
          <li className="flex gap-3">
            <span className="text-nexa-primary font-bold">1.</span>
            <span>Pastikan Anda berada di tempat yang tenang dan nyaman</span>
          </li>
          <li className="flex gap-3">
            <span className="text-nexa-primary font-bold">2.</span>
            <span>Jangan membuka tab atau jendela lain selama mengerjakan</span>
          </li>
          <li className="flex gap-3">
            <span className="text-nexa-primary font-bold">3.</span>
            <span>Kelola waktu dengan baik, jangan terpaku pada satu soal</span>
          </li>
          <li className="flex gap-3">
            <span className="text-nexa-primary font-bold">4.</span>
            <span>Review jawaban sebelum submit soal terakhir</span>
          </li>
        </ul>
      </div>
    </div>
  )
}