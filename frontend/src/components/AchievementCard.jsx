import React from 'react';

const AchievementCard = ({ title, date, icon, unlocked = true }) => {
    return (
        <div className={cn(
            "glass-panel p-5 relative overflow-hidden transition-all duration-500 group border-white/5",
            unlocked 
                ? 'hover:border-accent-cyan/30' 
                : 'opacity-50 grayscale contrast-75'
        )}>
            <div className="flex items-center gap-5">
                {/* Badge Icon Container */}
                <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 relative transition-transform duration-500 group-hover:scale-110",
                    unlocked 
                        ? 'bg-gradient-to-br from-primary via-accent-cyan to-accent-violet p-[1px]' 
                        : 'bg-white/5 border border-white/10'
                )}>
                    <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center">
                        <span className="text-2xl drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">{icon || '🏆'}</span>
                    </div>

                    {unlocked && (
                        <>
                            <div className="absolute inset-0 bg-accent-cyan blur-2xl opacity-20" />
                            <div className="absolute inset-1 border border-white/20 rounded-2xl" />
                        </>
                    )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                    <h4 className={cn(
                        "font-display font-black text-sm tracking-wider uppercase truncate",
                        unlocked ? 'text-white' : 'text-gray-500'
                    )}>
                        {title}
                    </h4>
                    <p className="text-[9px] font-display font-bold text-accent-cyan/80 uppercase tracking-[0.2em] mt-1">
                        {unlocked ? `Unlocked // ${date}` : 'Status // Classified'}
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
