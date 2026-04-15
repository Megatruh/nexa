import { Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'

export default function ProdiCard({ prodi }) {
  return (
    <Link
      to={`/ulasan-prodi/${prodi.slug}`}
      className='group relative overflow-hidden rounded-2xl border border-nexa-border bg-card-gradient hover:border-nexa-primary/50 hover:shadow-xl hover:shadow-nexa-primary/10 transition-all duration-300 cursor-pointer'
    >
      {/* efek bg */}
      <div className='absolute inset-0 bg-hero-gradient opacity-40 group-hover:opacity-60 transition-opacity'>
        {/* content */}
        <div className='relative p-5 flex flex-col gap-2'>
          <GraduationCap size={20} className='text-nexa-accent' />
          <h3 className='font-display font-semibold text-white text-base leading-tight'>{prodi.nama}</h3>
          <p className='text-white/50 text-sm'>{prodi.universitas}</p>
        </div>
      </div>
    </Link>
  )
}