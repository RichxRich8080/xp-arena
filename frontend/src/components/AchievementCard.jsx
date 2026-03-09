import React from 'react';

const AchievementCard = ({ title, date, icon, unlocked = true }) => {
    return (
        <div className={`relative p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 ${unlocked
                ? 'bg-gray-800/80 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.15)] hover:border-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]'
                : 'bg-gray-900/50 border-gray-800 opacity-60 grayscale'
            }`}>
            {/* Badge Icon Container */}
            <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 relative ${unlocked ? 'bg-gradient-to-br from-yellow-400 to-amber-600 shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'bg-gray-800 border-2 border-gray-700'
                }`}>
                <span className="text-2xl">{icon || '🏆'}</span>

                {unlocked && (
                    <div className="absolute inset-0 border-2 border-yellow-300 rounded-full animate-ping opacity-20"></div>
                )}
            </div>

            {/* Details */}
            <div className="flex-1">
                <h4 className={`font-bold text-lg ${unlocked ? 'text-yellow-400' : 'text-gray-400'}`}>{title}</h4>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{unlocked ? `Unlocked: ${date}` : 'Locked'}</p>
            </div>
        </div>
    );
};

export default AchievementCard;
