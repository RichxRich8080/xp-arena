import React from 'react';
import { cn } from '../../utils/cn';

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    className,
    ...props
}) {
    const baseStyles = "relative inline-flex items-center justify-center font-bold transition-all duration-300 rounded-xl overflow-hidden active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-primary-blue text-white hover:bg-opacity-80 shadow-[0_0_15px_rgba(30,58,138,0.4)]",
        secondary: "bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700",
        neonGreen: "bg-neon-green text-gray-900 shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:shadow-[0_0_30px_rgba(34,197,94,0.7)]",
        neonCyan: "bg-neon-cyan text-gray-900 shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)]",
        outline: "bg-transparent border-2 border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white",
        ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-gray-800",
    };

    const sizes = {
        sm: "px-4 py-2 text-xs",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base",
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], "electric-hover", className)}
            {...props}
        >
            <span className="relative z-10 flex items-center gap-2">{children}</span>
            {/* Subtle inner scanline for buttons */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-1/2 w-full -translate-y-full group-hover:animate-scan pointer-events-none opacity-0 group-hover:opacity-100"></div>
        </button>
    );
}
