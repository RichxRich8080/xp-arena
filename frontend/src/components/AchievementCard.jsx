import React from 'react';
import { cn } from '../utils/cn';

const AchievementCard = ({ title, date, icon, unlocked = true }) => {
    return (
        <div className={cn(
            "p-5 relative overflow-hidden transition-all duration-500 group border bg-slate-900/50 rounded-2xl",
            unlocked 
                ? 'border-white/5 hover:border-primary/30' 
                : 'border-white/5 opacity-50 grayscale'
        )}>
            <div className="flex items-center gap-5">
                {/* Badge Icon Container */}
                <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 relative transition-transform duration-500 group-hover:scale-105",
                    unlocked 
                        ? 'bg-gradient-to-br from-primary to-primary/50 p-[1px]' 
                        : 'bg-white/5 border border-white/10'
                )}>
                    <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center">
                        <span className="text-2xl drop-shadow-md">{icon || '🏆'}</span>
                    </div>

                    {unlocked && (
                        <>
                            <div className="absolute inset-0 bg-primary blur-2xl opacity-10" />
                            <div className="absolute inset-1 border border-white/10 rounded-2xl" />
                        </>
                    )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                    <h4 className={cn(
                        "font-bold text-sm tracking-wider uppercase truncate",
                        unlocked ? 'text-white' : 'text-slate-500'
                    )}>
                        {title}
                    </h4>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">
                        {unlocked ? `Unlocked // ${date}` : 'Status // Locked'}
                    </p>
                </div>
            </div>
            
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-8 h-8 opacity-[0.05] group-hover:opacity-10 transition-opacity">
                <div className="absolute top-2 right-2 w-4 h-px bg-white" />
                <div className="absolute top-2 right-2 w-px h-4 bg-white" />
            </div>
        </div>
    );
};

export default AchievementCard;
