import React from 'react';
import { cn } from '../../utils/cn';
import { useAudioUI } from '../../hooks/useAudioUI';

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    className,
    onClick,
    onMouseEnter,
    ...props
}) {
    const { playClick, playHover } = useAudioUI();

    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-md active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-primary hover:bg-primary/90 text-white shadow-sm",
        secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/5",
        outline: "bg-transparent border border-slate-700 text-slate-300 hover:bg-white/5 hover:text-white",
        danger: "bg-red-600/10 text-red-500 border border-red-500/20 hover:bg-red-600 hover:text-white",
        ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-white/5",
        neon: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md", // Professional alternative to 'neon'
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-6 py-3 text-base",
    };

    const handleClick = (e) => {
        playClick();
        if (onClick) onClick(e);
    };

    const handleMouseEnter = (e) => {
        playHover();
        if (onMouseEnter) onMouseEnter(e);
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            {...props}
        >
            {children}
        </button>
    );
}
