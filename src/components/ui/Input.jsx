import clsx from 'clsx'

export default function Input({
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = '',
  disabled = false,
  icon: Icon = null,
  className = '',
  ...props
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {/* Label */}
      {label && (
        <label className="text-sm font-medium text-white/70">
          {label}
        </label>
      )}

      {/* Input Wrapper */}
      <div className="relative">
        {/* Icon kiri */}
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
            <Icon size={16} />
          </div>
        )}

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={clsx(
            'w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/30',
            'bg-nexa-card border transition-all duration-200 outline-none',
            Icon && 'pl-10',
            error
              ? 'border-red-500 focus:border-red-400'
              : 'border-nexa-border focus:border-nexa-primary',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          {...props}
        />
      </div>

      {/* Pesan Error */}
      {error && (
        <p className="text-xs text-red-400 mt-0.5">{error}</p>
      )}
    </div>
  )
}