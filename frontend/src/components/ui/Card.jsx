import React from 'react';
import { cn } from '../../utils/cn';

export function Card({ children, className, hoverEffect = true, glass = true }) {
    return (
        <div
            className={cn(
                "glass-card p-6 relative group border-white/5 overflow-hidden",
                hoverEffect && "hover:-translate-y-2 hover:border-accent-cyan/20",
                className
            )}
        >
            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-accent-cyan/5 to-transparent pointer-events-none group-hover:from-accent-cyan/20 transition-all" />
            
            {/* Subtle inner glare */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none" />
            
            <div className="relative z-10">{children}</div>
        </div>
    );
}
