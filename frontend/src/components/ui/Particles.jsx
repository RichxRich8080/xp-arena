import React, { useState, useEffect } from 'react';

/**
 * Sparkles component.
 * Uses useEffect to generate random data to ensure the render function remains pure.
 */
export const Sparkles = ({ count = 20, color = "bg-primary" }) => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const newParticles = [...Array(count)].map((_, i) => ({
                id: i,
                size: Math.random() * 4 + 2,
                left: Math.random() * 100,
                top: Math.random() * 100,
                delay: Math.random() * 2,
                duration: Math.random() * 2 + 1,
            }));
            setParticles(newParticles);
        }, 0);
        return () => clearTimeout(timer);
    }, [count]);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden h-full w-full">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className={`absolute rounded-full opacity-0 animate-pulse ${color} blur-[1px]`}
                    style={{
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        left: `${p.left}%`,
                        top: `${p.top}%`,
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${p.duration}s`,
                    }}
                />
            ))}
        </div>
    );
};

/**
 * Burst component for radial impact effects.
 */
export const Burst = ({ active }) => {
    if (!active) return null;

    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
                <div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-1 h-32 bg-gradient-to-t from-transparent via-primary/40 to-transparent -translate-x-1/2 -translate-y-1/2 opacity-0 animate-ping"
                    style={{
                        transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
                        animationDelay: `${i * 0.05}s`,
                        animationDuration: '1s'
                    }}
                />
            ))}
        </div>
    );
};
