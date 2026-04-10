import { motion } from 'framer-motion'
import clsx from 'clsx'

export default function ProgressBar({
  value = 0,        
  max = 100,
  label = '',
  showPercent = true,
  size = 'md',
  color = 'primary',
  animated = true,
  className = '',
}) {
  const percent = Math.min(Math.max((value / max) * 100, 0), 100)

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  const colors = {
    primary: 'bg-nexa-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger:  'bg-red-500',
    accent:  'bg-nexa-accent',
  }

  return (
    <div className={clsx('w-full', className)}>
      {/* Label & Persentase */}
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm text-white/70 font-medium">{label}</span>
          )}
          {showPercent && (
            <span className="text-sm text-white/50 font-mono">
              {Math.round(percent)}%
            </span>
          )}
        </div>
      )}

      {/* Track */}
      <div className={clsx('w-full bg-nexa-border rounded-full overflow-hidden', sizes[size])}>
        {/* Bar */}
        <motion.div
          className={clsx('h-full rounded-full', colors[color])}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{
            duration: animated ? 0.8 : 0,
            ease: 'easeOut'
          }}
        />
      </div>
    </div>
  )
}