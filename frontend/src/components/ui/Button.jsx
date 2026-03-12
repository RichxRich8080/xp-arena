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

    const baseStyles = "relative inline-flex items-center justify-center font-display font-black uppercase tracking-widest transition-all duration-300 rounded-xl overflow-hidden active:scale-95 disabled:opacity-50 disabled:pointer-events-none group";

    const variants = {
        primary: "bg-gradient-to-r from-primary to-accent-cyan text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]",
        secondary: "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white",
        neon: "bg-accent-cyan text-background shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:bg-white hover:shadow-[0_0_30px_rgba(6,182,212,0.8)]",
        danger: "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white",
        outline: "bg-transparent border-2 border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-background",
        ghost: "bg-transparent text-gray-500 hover:text-white hover:bg-white/5",
    };

    const sizes = {
        sm: "px-4 py-2 text-[10px]",
        md: "px-6 py-3 text-xs",
        lg: "px-8 py-4 text-sm",
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
            <span className="relative z-10 flex items-center gap-2">{children}</span>
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            {/* Animated scanline */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
        </button>
    );
}
