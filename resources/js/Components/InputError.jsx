export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p
            {...props}
            className={'text-sm text-rose-400 font-medium ' + className}
        >
            {message}
        </p>
    ) : null;
}
