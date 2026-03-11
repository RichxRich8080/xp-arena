import React from 'react';
import { useLocation } from 'react-router-dom';

export default function GlitchTransition({ children }) {
    const { key } = useLocation();

    return (
        <div
            key={key}
            className="h-full relative animate-page-glitch"
        >
            {children}
            {/* The flickering glitch overlay is now CSS-only for performance and linting compliance */}
            <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden mix-blend-screen opacity-0 animate-glitch-overlay">
                <div className="absolute top-0 left-0 w-full h-[40%] bg-neon-cyan/5 blur-[4px] border-t border-neon-cyan/20"></div>
                <div className="absolute bottom-0 left-0 w-full h-[40%] bg-neon-green/5 blur-[4px] border-b border-neon-green/20"></div>
            </div>
        </div>
    );
}
