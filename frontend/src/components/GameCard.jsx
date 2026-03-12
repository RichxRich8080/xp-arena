import React from 'react';

const GameCard = ({ title, description, image, glowColor = 'indigo' }) => {
    return (
        <div className="glass-card flex flex-col items-center justify-between text-center overflow-hidden h-80 border-white/5 hover:border-accent-cyan/20 group">
            {/* Background Image / Gradient */}
            <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-all duration-700 scale-110 group-hover:scale-100">
                {image ? (
                    <img src={image} alt={title} className="w-full h-full object-cover grayscale group-hover:grayscale-0" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-background via-surface-default to-background"></div>
                )}
            </div>

            {/* Content overlays */}
            <div className="relative z-10 p-6 w-full h-full flex flex-col justify-end bg-gradient-to-t from-background via-background/60 to-transparent">
                <div className="mb-4">
                    <h3 className="font-display font-black text-2xl text-white mb-2 tracking-wider group-hover:text-accent-cyan transition-colors">{title}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] line-clamp-2">{description}</p>
                </div>

                <div className="mt-2 h-0 group-hover:h-12 transition-all duration-500 overflow-hidden opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0">
                    <button className="w-full py-2.5 font-display font-black text-[10px] tracking-widest text-white rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 hover:bg-accent-cyan hover:text-background transition-all">
                        ENTER_ARENA
                    </button>
                </div>
            </div>
            
            {/* Scanline Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-px w-full top-0 group-hover:top-full transition-all duration-1000 ease-in-out pointer-events-none" />
        </div>
    );
};

export default GameCard;
