import React from 'react';

const GameCard = ({ title, description, image }) => {
    return (
        <div className="border border-white/5 bg-slate-900/50 rounded-2xl flex flex-col items-center justify-between text-center overflow-hidden h-80 hover:border-primary/20 group relative transition-colors">
            {/* Background Image / Gradient */}
            <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-all duration-700 scale-110 group-hover:scale-100">
                {image ? (
                    <img src={image} alt={title} className="w-full h-full object-cover grayscale group-hover:grayscale-0" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
                )}
            </div>

            {/* Content overlays */}
            <div className="relative z-10 p-6 w-full h-full flex flex-col justify-end bg-gradient-to-t from-background via-background/60 to-transparent">
                <div className="mb-4">
                    <h3 className="font-bold text-xl text-white mb-2 tracking-wider group-hover:text-primary transition-colors uppercase">{title}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] line-clamp-2">{description}</p>
                </div>

                <div className="mt-2 h-0 group-hover:h-12 transition-all duration-500 overflow-hidden opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0">
                    <button className="w-full py-2.5 font-bold text-[10px] tracking-widest text-primary rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary hover:text-slate-900 transition-all uppercase">
                        View Module
                    </button>
                </div>
            </div>
            
            {/* Scanline Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-px w-full top-0 group-hover:top-full transition-all duration-1000 ease-in-out pointer-events-none" />
        </div>
    );
};

export default GameCard;
