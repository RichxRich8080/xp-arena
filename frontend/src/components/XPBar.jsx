import React from 'react';

const XPBar = ({ currentXP, maxXP, level }) => {
    const percentage = Math.min(100, Math.max(0, (currentXP / maxXP) * 100));

    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-2 px-1">
                <div className="flex items-center gap-2">
                    <span className="font-display font-black text-sm text-white tracking-widest">LVL</span>
                    <span className="font-display font-black text-2xl text-accent-cyan leading-none">{level}</span>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-display font-bold text-gray-500 uppercase tracking-widest block mb-0.5">Progress to Next Tier</span>
                    <span className="font-display font-black text-xs text-white/70 tracking-widest">{currentXP} / {maxXP} <span className="text-[10px] text-gray-500">AXP</span></span>
                </div>
            </div>
            
            <div className="relative w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5 box-content">
                <div 
                    className="h-full rounded-full bg-gradient-to-r from-primary via-accent-cyan to-accent-violet transition-all duration-1000 ease-out relative shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                    style={{ width: `${percentage}%` }}
                >
                    {/* Glossy Highlight */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50" />
                    
                    {/* Segmented Pattern */}
                    <div className="absolute inset-0 opacity-20" 
                         style={{ backgroundImage: 'linear-gradient(90deg, transparent 96%, black 96%)', backgroundSize: '20px 100%' }} />
                </div>
            </div>
        </div>
    );
};

export default XPBar;
