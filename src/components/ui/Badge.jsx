export default function Badge({
  label,
  color = 'default'
}) {
  const colors = {
    default:    'bg-white/10 text-white border border-white/20',
    teknologi:  'bg-blue-500/20  text-blue-300  border border-blue-500/30',
    kesehatan:  'bg-green-500/20 text-green-300 border border-green-500/30',
    bisnis:     'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[color] || colors.default}`}>
      {label}
    </span>
  )
}