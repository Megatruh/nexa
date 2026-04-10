import clsx from "clsx";

const variants = {
  primary:  'bg-nexa-primary hover:bg-nexa-secondary text-white shadow-lg shadow-nexa-primary/30',
  outline:  'border border-nexa-primary text-nexa-primary hover:bg-nexa-primary/10',
  ghost:    'text-white/70 hover:text-white hover:bg-white/10',
  danger:   'bg-red-500 hover:bg-red-600 text-white'
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg'
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className='',
  disabled = false,
  loading = false,
  ...props
}){
  return(
    <button className={clsx(
      'font-display font-semibold rounded-full transition-all duration-200',
      'active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
      variants[variant],
      sizes[size],
      className
    )} 
    disabled={disabled || loading}
    {...props}
    >
      {loading ? <span className="animate-spin mr-2">⟳</span> : null}
      {children}
    </button>
  )
}