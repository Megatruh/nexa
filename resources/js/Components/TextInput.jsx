import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-500 shadow-sm focus:border-purple-500 focus:ring-purple-500 focus:outline-none focus:ring-1 ' +
                className
            }
            ref={localRef}
        />
    );
});
