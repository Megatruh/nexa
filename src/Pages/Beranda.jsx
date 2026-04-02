import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from '@components/ui/Button';
import { Target, GraduationCap, BookOpen, PenTool } from 'lucide-react';

const features = [
  { icon: Target, title: 'Kesesuaian Jurusan', desc: 'Temukan jurusan yang paling sesuai dengan mina dan bakatmu melalui survei interaktif.', to: '/src/Pages/KesesuaianJurusan'},
  { icon: GraduationCap, title: 'Ulasan Prodi', desc: 'Jelajahi program studi di berbagai perguruan tinggi Indonesia', to: '/src/Pages/UlasanProdi'},
  { icon: BookOpen, title: 'Belajar', desc: 'Akses materi pembelajaran yang lengkap dan terstruktur untuk persiapan UTBK', to: '/src/Pages/Belajar'},
  { icon: PenTool, title: 'Try Out', desc: 'Simulasi ujian UTBK dengan soal-soal terbaru untuk persiapan maksimal', to: '/src/Pages/TryOut'},
]

export default function Beranda() {
  return(
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h[80vh] flex flex-col items-center justify-center px-6 bg-hero-gradient overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y:30 }}
          animate={{ opacity: 1, y:0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-3xl"
          >
            <h1 className="font-display font-bold text-6xl md:text-7xl text-white mb-6 tracking-tight">
              NEXA
            </h1>
            <h2 className="font-display font-semibold text-xl md:text-2xl text-white/80 mb-4 leading-relaxed">
              Pengembangan Aplikasi Simulasi UTBK-SNBT <br/>dan Analisis Peluang Masuk Program Studi
            </h2>
            <p className="text-white/50 text-base mb-10 max-w-xl mx-auto">
              Persiapkan dirimu menghadapi UTBK-SNBT dengan simulasi realistis, materi lengkapm dan analisis peluang masuk yang akurat.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" as={Link} to="/src/Pages/TryOut">Mulai Try Out</Button>
              <Button size="lg" variant="outline" as={Link} to="/src/Pages/KesesuaianJurusan">Cari Jurusanmu</Button>
            </div>
          </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-7xl max-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.a
              key={f.title}
              href={f.to}
              initial={{ opacity: 0, y:20 }}
              animate={{ opacity: 1, y:0 }}
              transition={{ delay: i*0.1 }}
              className="bg-card-gradient border border-nexa-border rounded-2xl p-6 hover:border-nexa-primary/50 hover:shadow-lg hover:shadow-nexa-primary/10 transition-all duration-300 group">
            <f.icon size={28} className="text-nexa-accent mb-4 froup-hover:scale-110 transition-transform" />
                <h3 className="font-display font-semibold text-white text-lg mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </motion.a>
          ))}
        </div>
      </section>
    </div>
  )
}