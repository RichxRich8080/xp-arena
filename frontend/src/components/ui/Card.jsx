import React from 'react';
import { cn } from '../../utils/cn';
import { useAudioUI } from '../../hooks/useAudioUI';

export function Card({ children, className, hoverEffect = true, onMouseEnter, ...props }) {
    const { playHover } = useAudioUI();

    const handleMouseEnter = (e) => {
        if (hoverEffect) playHover();
        if (onMouseEnter) onMouseEnter(e);
    };

    return (
        <div
            className={cn(
                "glass-panel p-6 border border-white/5 transition-colors duration-200",
                hoverEffect && "hover:border-white/10",
                className
            )}
            onMouseEnter={handleMouseEnter}
            {...props}
        >
            {children}
        </div>
    );
}
