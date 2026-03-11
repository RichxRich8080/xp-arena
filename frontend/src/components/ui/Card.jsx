import React from 'react';
import { cn } from '../../utils/cn';

export function Card({ children, className, hoverEffect = true, glass = false }) {
    return (
        <div
            className={cn(
                "bg-gray-900 border border-gray-800 rounded-xl p-6 relative overflow-hidden transition-all duration-500",
                glass && "glass-card shadow-2xl",
                hoverEffect && "hover:border-neon-cyan hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] hover:-translate-y-2 hover:scale-[1.01] active:scale-[0.99]",
                className
            )}
        >
            {glass && <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none opacity-50"></div>}
            {/* Subtle top glare effect for depth */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="relative z-10">{children}</div>
        </div>
    );
}
