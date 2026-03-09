import React from 'react';

const GameCard = ({ title, description, image, glowColor = 'indigo' }) => {
    // Tailwind dynamic safelist for arbitrary glow glowColor isn't optimal, but using predefined classes is
    const glowBorder = glowColor === 'indigo' ? 'hover:border-indigo-500' : 'hover:border-cyan-400';
    const glowShadow = glowColor === 'indigo' ? 'hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'hover:shadow-[0_0_15px_rgba(34,211,238,0.5)]';

    return (
        <div className={`game-card group flex flex-col items-center justify-between text-center overflow-hidden h-72 ${glowBorder} ${glowShadow}`}>
            {/* Background Image / Gradient */}
            <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-60 transition-opacity">
                {image ? (
                    <img src={image} alt={title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900"></div>
                )}
            </div>

            {/* Content overlays */}
            <div className="relative z-10 p-4 w-full h-full flex flex-col justify-end bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent">
                <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{title}</h3>
                <p className="text-sm text-gray-300 font-medium">{description}</p>

                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <button className={`w-full py-2 font-bold text-white rounded-lg transition-colors border border-${glowColor}-500 bg-${glowColor}-600/30 hover:bg-${glowColor}-600`}>
                        Enter Arena
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameCard;
