import { useNavigate } from 'react-router-dom'
import { CheckCircle, ArrowRight } from 'lucide-react'
import Button from '@components/ui/Button'

export default function HasilKesesuaian() {
  const navigate = useNavigate()

  const hasilRekomendasi = [
    {
      jurusan: 'Teknik Informatika',
      persentase: 85,
      deskripsi: 'Cocok dengan minat Anda pada teknologi dan problem-solving',
      universitas: 'ITB, UI, UGM',
    },
    {
      jurusan: 'Sistem Informasi',
      persentase: 78,
      deskripsi: 'Domain bisnis dan teknologi yang seimbang',
      universitas: 'BINUS, ITB, Telkom University',
    },
    {
      jurusan: 'Teknik Komputer',
      persentase: 72,
      deskripsi: 'Fokus pada hardware dan infrastruktur teknologi',
      universitas: 'UI, ITB, UNPAR',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="font-display font-bold text-3xl text-white mb-2">Hasil Tes Selesai!</h1>
        <p className="text-white/60">Berikut rekomendasi jurusan yang sesuai dengan profil Anda</p>
      </div>

      <div className="space-y-4 mb-8">
        {hasilRekomendasi.map((result, idx) => (
          <div key={idx} className="bg-nexa-card border border-nexa-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white text-lg mb-1">{result.jurusan}</h3>
                <p className="text-white/60 text-sm">{result.deskripsi}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-nexa-primary">{result.persentase}%</span>
                <p className="text-white/60 text-xs">Kesesuaian</p>
              </div>
            </div>
            <div className="h-2 bg-nexa-border rounded-full overflow-hidden mb-3">
              <div className="h-full bg-gradient-to-r from-nexa-primary to-nexa-secondary" style={{ width: `${result.persentase}%` }}></div>
            </div>
            <p className="text-white/60 text-sm"><span className="text-white font-semibold">Universitas:</span> {result.universitas}</p>
          </div>
        ))}
      </div>

      <div className="bg-nexa-card border border-nexa-border rounded-lg p-6 mb-8">
        <h2 className="font-semibold text-white mb-4">Langkah Selanjutnya</h2>
        <ul className="space-y-2 text-white/80 text-sm">
          <li>✓ Jelajahi ulasan program studi untuk informasi lebih detail</li>
          <li>✓ Pelajari materi UTBK di bagian Belajar</li>
          <li>✓ Ikuti try out untuk mengukur kesiapanmu</li>
        </ul>
      </div>

      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={() => navigate('/ulasan-prodi')}>Lihat Ulasan Prodi</Button>
        <Button onClick={() => navigate('/belajar')}>Mulai Belajar <ArrowRight size={18} /></Button>
      </div>
    </div>
  )
}