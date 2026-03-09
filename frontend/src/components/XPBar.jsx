import React from 'react';

const XPBar = ({ currentXP, maxXP, level }) => {
    const percentage = Math.min(100, Math.max(0, (currentXP / maxXP) * 100));

    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-1">
                <span className="text-sm font-bold text-gray-300 uppercase tracking-widest">Level {level}</span>
                <span className="text-xs font-semibold text-indigo-400">{currentXP} / {maxXP} XP</span>
            </div>
            <div className="relative w-full h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-700 shadow-inner">
                {/* Animated Glow Wrapper */}
                <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 rounded-full transition-all duration-1000 ease-in-out relative"
                    style={{ width: `${percentage}%` }}
                >
                    {/* Inner pulse effect */}
                    <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
                    {/* Neon Glow Drop Shadow */}
                    <div className="absolute inset-0 shadow-[0_0_10px_rgba(34,211,238,0.8)] mix-blend-screen"></div>
                </div>
            </div>
        </div>
    );
};

export default XPBar;
