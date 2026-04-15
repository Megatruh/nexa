import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, FileText } from 'lucide-react'
import Button from '@components/ui/Button'
import { getMateriById } from '@services/materiServices'

export default function MateriDetail() {
  const { materiId } = useParams()
  const navigate = useNavigate()

  const { data: materi, isLoading } = useQuery({
    queryKey: ['materi', materiId],
    queryFn: () => getMateriById(materiId),
  })

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <div className="text-white/60">Memuat materi...</div>
      </div>
    )
  }

  if (!materi) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <div className="text-white/60 mb-6">Materi tidak ditemukan</div>
        <Button onClick={() => navigate('/belajar')}>Kembali ke Belajar</Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <button onClick={() => navigate('/belajar')} className="flex items-center gap-2 text-nexa-primary hover:text-white transition-colors mb-6">
        <ChevronLeft size={20} /> Kembali
      </button>

      <h1 className="font-display font-bold text-4xl text-white mb-4">{materi.judul}</h1>
      <p className="text-white/60 mb-8">{materi.deskripsi}</p>

      <div className="bg-nexa-card border border-nexa-border rounded-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="text-nexa-primary" />
          <span className="text-white font-semibold">Konten Materi</span>
        </div>
        <div className="text-white/80 whitespace-pre-wrap">{materi.konten || 'Konten materi sedang dipersiapkan...'}</div>
      </div>
    </div>
  )
}