import React, { useState } from 'react';
import { useHUDDepth } from '../hooks/useHUDDepth';
import { useNeuralHaptics } from '../hooks/useNeuralHaptics';
import { Link } from 'react-router-dom';

const ClipCard = ({ title, user, views, likes, color }) => (
    <div className="relative group overflow-hidden bg-gray-950/40 border border-white/5 rounded-[2.5rem] transition-all duration-500 hover:border-white/20 hover:scale-[1.02]">
        {/* Placeholder Thumbnail */}
        <div className={`w-full aspect-video bg-gradient-to-br from-${color}-900/40 to-black relative flex items-center justify-center`}>
            <div className="text-4xl opacity-30 group-hover:scale-110 transition-transform duration-500">🎮</div>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform">
                    ▶
                </div>
            </div>

            {/* View Count Badge */}
            <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[8px] font-black text-white/50 border border-white/10 uppercase tracking-widest italic">
                {views} Views
            </div>
        </div>

        <div className="p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-sm font-black text-white uppercase italic tracking-tighter mb-1 line-clamp-1">{title}</h3>
                    <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-none">by {user}</div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px]">❤️</span>
                    <span className="text-[10px] font-black text-indigo-400 font-mono italic">{likes}</span>
                </div>
            </div>

            <div className="flex gap-2">
                <button className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-[8px] font-black text-gray-400 uppercase tracking-widest hover:text-white transition-colors">Share_Link</button>
                <button className="flex-1 py-2 rounded-xl bg-white text-gray-950 text-[8px] font-black uppercase tracking-widest hover:scale-105 transition-transform">Watch_Now</button>
            </div>
        </div>
    </div>
);

const Clips = () => {
    const depthRef = useHUDDepth(10);
    const { triggerLightHaptic } = useNeuralHaptics();

    return (
        <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-right-5 duration-700">
            {/* Header HUD */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 px-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-[1px] bg-cyan-500"></div>
                        <span className="text-[10px] font-black italic text-cyan-400 uppercase tracking-[0.4em]">Community_Broadcast</span>
                    </div>
                    <h2 className="text-4xl font-black italic text-white tracking-tighter uppercase leading-none">Neural_Clips</h2>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">Discover high-tier mechanical highlights from across the Arena.</p>
                </div>
                <Link
                    to="/submit"
                    onClick={() => triggerLightHaptic()}
                    className="px-8 py-4 bg-white text-gray-950 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all"
                >
                    Submit_Entry
                </Link>
            </div>

            {/* Main Feed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ClipCard title="4-Piece Neural Wipeout" user="Sniper_01" views="12.4K" likes="442" color="indigo" />
                <ClipCard title="1v4 Clutch | Arena Series" user="Ghost_V" views="8.2K" likes="210" color="red" />
                <ClipCard title="Perfect Sens Tracking" user="Neural_Link" views="15.1K" likes="890" color="cyan" />
                <ClipCard title="Impossible Headshot" user="Elite_One" views="5.5K" likes="124" color="purple" />
            </div>

            {/* Trending Tags */}
            <div className="flex gap-3 overflow-x-auto pb-4 px-2 no-scrollbar">
                {['#Clutch', '#Headshot', '#NeuralLink', '#AreniElite', '#SyndicateCup'].map(tag => (
                    <button key={tag} className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-500 uppercase tracking-widest italic hover:text-cyan-400 hover:border-cyan-400/30 transition-all whitespace-nowrap">
                        {tag}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Clips;
