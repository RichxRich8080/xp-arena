import React from 'react';
import { useAreni } from '../context/AreniContext';
import { useHUDDepth } from '../hooks/useHUDDepth';

const Leaderboard = () => {
    const { xp, level } = useAreni();
    const depthRef = useHUDDepth(5);

    const players = [
        { rank: 1, name: "Sniper_God", level: 99, xp: "1.2M", badge: "🏆", color: "yellow" },
        { rank: 2, name: "Neural_Link", level: 95, xp: "980K", badge: "🥈", color: "gray" },
        { rank: 3, name: "Areni_Master", level: 92, xp: "910K", badge: "🥉", color: "orange" },
        { rank: 4, name: "Ghost_User", level: 88, xp: "850K" },
        { rank: 5, name: "Silent_Aim", level: 85, xp: "790K" },
        { rank: 6, name: "Shadow_Step", level: 82, xp: "720K" },
        { rank: 7, name: "Matrix_Void", level: 79, xp: "680K" },
        { rank: 8, name: "Prism_Core", level: 75, xp: "610K" }
    ];

    return (
        <div className="flex flex-col gap-6 animate-in fade-in zoom-in duration-700">
            {/* 1. Elite Podium HUD */}
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-end px-4">
                    <h2 className="text-3xl font-black italic text-white tracking-tighter uppercase">Global_Ranks</h2>
                    <div className="text-[9px] font-black text-cyan-400 uppercase tracking-widest border-b border-cyan-500/50 pb-1">Archive_ID: LVL_772</div>
                </div>

                <div className="relative h-[220px] flex items-end justify-center gap-2 mt-8">
                    {/* Rank 2 */}
                    <div className="w-1/3 bg-gray-900/60 border border-white/5 rounded-t-[2.5rem] h-[60%] flex flex-col items-center justify-center p-4 relative group">
                        <div className="absolute -top-6 w-10 h-10 rounded-full bg-gray-400/20 border border-gray-400/50 flex items-center justify-center text-xl shadow-lg">🥈</div>
                        <div className="text-[10px] font-black text-white uppercase tracking-tighter mb-1 mt-2">Neural_Link</div>
                        <div className="text-[8px] font-black text-gray-500 uppercase">LVL 95</div>
                    </div>

                    {/* Rank 1 */}
                    <div className="w-1/3 bg-gray-950/80 border border-yellow-500/30 rounded-t-[3rem] h-[85%] flex flex-col items-center justify-center p-4 relative shadow-[0_-20px_50px_rgba(234,179,8,0.1)] z-10 group">
                        <div className="absolute -top-8 w-14 h-14 rounded-full bg-yellow-400/20 border border-yellow-400 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(234,179,8,0.5)] animate-bounce">🏆</div>
                        <div className="text-sm font-black text-white uppercase italic tracking-tighter mb-1 mt-4">Sniper_God</div>
                        <div className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">LVL 99</div>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
                    </div>

                    {/* Rank 3 */}
                    <div className="w-1/3 bg-gray-900/60 border border-white/5 rounded-t-[2.5rem] h-[45%] flex flex-col items-center justify-center p-4 relative group">
                        <div className="absolute -top-6 w-10 h-10 rounded-full bg-orange-400/20 border border-orange-400/50 flex items-center justify-center text-xl shadow-lg">🥉</div>
                        <div className="text-[10px] font-black text-white uppercase tracking-tighter mb-1 mt-2">Areni_Master</div>
                        <div className="text-[8px] font-black text-gray-500 uppercase">LVL 92</div>
                    </div>
                </div>
            </div>

            {/* 2. Neural Link List */}
            <div className="flex flex-col gap-3">
                {players.slice(3).map(p => (
                    <div key={p.name} className="bg-gray-950/40 backdrop-blur-md border border-white/5 p-5 rounded-[2rem] flex items-center justify-between group hover:border-white/20 transition-all hover:bg-white/5">
                        <div className="flex items-center gap-5">
                            <span className="text-xl font-black italic text-gray-800 tracking-tighter w-8">#0{p.rank}</span>
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">👤</div>
                            <div>
                                <div className="text-sm font-black text-white uppercase tracking-tight group-hover:text-cyan-400 transition-colors">{p.name}</div>
                                <div className="text-[8px] font-bold text-gray-600 uppercase tracking-[0.2em]">Tier_Legendary • Lvl {p.level}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-black text-white font-mono">{p.xp}</div>
                            <div className="text-[8px] font-black text-gray-700 uppercase tracking-widest leading-none">Global_XP</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. User Presence Bar (Floating HUD) */}
            <div className="mt-4 bg-indigo-600 p-6 rounded-[2.5rem] flex items-center justify-between shadow-[0_15px_40px_rgba(79,70,229,0.4)] border border-indigo-400 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-full bg-white opacity-5 translate-x-32 group-hover:translate-x-0 transition-transform duration-700 skew-x-12"></div>
                <div className="flex items-center gap-5">
                    <div className="text-2xl font-black italic text-white/40 tracking-tighter">#1,402</div>
                    <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center font-black text-white bg-indigo-500">S</div>
                    <div>
                        <div className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.3em] mb-1">Your Standing</div>
                        <div className="text-lg font-black text-white uppercase italic tracking-tighter leading-none">Sniper_King_99</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xl font-bold font-mono text-white leading-none">{xp.toLocaleString()}</div>
                    <div className="text-[8px] font-black text-indigo-300 uppercase tracking-widest mt-1">XP Points</div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
