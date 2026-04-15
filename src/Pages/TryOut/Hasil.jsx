import { useParams, useNavigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import Button from "@components/ui/Button"
import useTryOutStore from "@store/tryOutStore"

export default function HasilTryOut() {
  const { paketId } = useParams()
  const navigate = useNavigate()
  const store = useTryOutStore()

  if (!store.selesai || store.skor === null) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <div className="text-white/60 mb-6">Belum ada hasil try out</div>
        <Button onClick={() => navigate("/try-out")}>Kembali ke Try Out</Button>
      </div>
    )
  }

  const subtesDetail = [
    { nama: "Penalaran Umum", skor: Math.round(store.skor * 0.85) },
    { nama: "Pemahaman IPA", skor: Math.round(store.skor * 0.78) },
    { nama: "Penalaran Matematika", skor: Math.round(store.skor * 0.92) },
  ]

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="font-display font-bold text-4xl text-white mb-2">Hasil Try Out</h1>
        <p className="text-white/60">Try Out UTBK #{paketId}</p>
      </div>

      <div className="bg-gradient-to-br from-nexa-primary/20 to-nexa-secondary/10 border border-nexa-primary/30 rounded-lg p-8 mb-8 text-center">
        <div className="mb-4">
          <span className="text-6xl font-bold text-nexa-primary">{store.skor}</span>
          <p className="text-white/60 mt-2">Skor Total</p>
        </div>
        <div className="flex justify-around mt-8 pt-8 border-t border-nexa-primary/20">
          <div>
            <p className="text-white/60 text-sm mb-1">Rata-rata Akurasi</p>
            <p className="text-2xl font-bold text-white">{store.skor}%</p>
          </div>
          <div>
            <p className="text-white/60 text-sm mb-1">Status</p>
            <p className={`text-2xl font-bold ${store.skor >= 80 ? "text-green-400" : store.skor >= 60 ? "text-yellow-400" : "text-red-400"}`}>
              {store.skor >= 80 ? "Lulus" : store.skor >= 60 ? "Cukup" : "Perlu Belajar"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-nexa-card border border-nexa-border rounded-lg p-6 mb-8">
        <h2 className="font-semibold text-white mb-6">Detail Skor per Subtes</h2>
        <div className="space-y-4">
          {subtesDetail.map((subtes, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">{subtes.nama}</span>
                <span className="text-nexa-primary font-bold">{subtes.skor}</span>
              </div>
              <div className="h-2 bg-nexa-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-nexa-primary to-nexa-secondary"
                  style={{ width: `${subtes.skor}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-nexa-card border border-nexa-border rounded-lg p-6 mb-8">
        <h2 className="font-semibold text-white mb-4">Rekomendasi Pembelajaran</h2>
        <ul className="space-y-2 text-white/80 text-sm">
          {store.skor >= 80 ? (
            <>
              <li>✓ Pertahankan performa dengan terus berlatih</li>
              <li>✓ Fokus pada topik-topik yang sedikit lemah</li>
              <li>✓ Coba try out dengan tingkat kesulitan lebih tinggi</li>
            </>
          ) : store.skor >= 60 ? (
            <>
              <li>✓ Tingkatkan intensitas belajar pada materi sulit</li>
              <li>✓ Ulangi try out secara berkala</li>
              <li>✓ Manfaatkan fitur belajar untuk materi yang lemah</li>
            </>
          ) : (
            <>
              <li>✓ Pelajari kembali konsep dasar dari materi UTBK</li>
              <li>✓ Lakukan try out lebih sering untuk mengukur progress</li>
              <li>✓ Konsultasikan dengan mentor atau guru</li>
            </>
          )}
        </ul>
      </div>

      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={() => {
          store.reset()
          navigate("/try-out")
        }}>
          Kembali ke Try Out
        </Button>
        <Button onClick={() => navigate("/belajar")}>
          Belajar <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  )
}