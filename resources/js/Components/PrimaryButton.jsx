export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-lg border border-transparent bg-purple-600 px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition-all duration-300 ease-in-out hover:bg-purple-700 focus:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent active:bg-purple-800 shadow-lg shadow-purple-500/30 hover:shadow-lg hover:shadow-purple-500/50 ${
                    disabled && 'opacity-50 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
