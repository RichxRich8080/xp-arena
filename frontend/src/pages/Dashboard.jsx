import React from 'react';
import XPBar from '../components/XPBar';
import GameCard from '../components/GameCard';
import { useAreni } from '../context/AreniContext';
import { useAudioUI } from '../hooks/useAudioUI';

const Dashboard = () => {
    const { claimDaily, lastLoginString, axp, level, xp } = useAreni();
    const { playClick, playSuccess, playError } = useAudioUI();

    const handleDailyReward = () => {
        const success = claimDaily();
        if (success) playSuccess();
        else playError();
    };

    return (
        <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            {/* 1. Tactical Combat ID (Profile HUD) */}
            <div className="relative group perspective-1000">
                <div className="bg-gray-950/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden transition-all duration-500 hover:border-cyan-500/30">
                    <div className="absolute top-0 right-0 p-6 opacity-10 font-black italic text-4xl">D-042</div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-20 group-hover:opacity-60 transition-opacity"></div>

                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyan-400 to-indigo-600 p-[3px] shadow-[0_0_30px_rgba(6,182,212,0.3)] animate-pulse">
                                <div className="w-full h-full bg-gray-950 rounded-[1.4rem] flex items-center justify-center font-black text-3xl text-white">S</div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-gray-950 flex items-center justify-center text-[10px] shadow-lg">⚡</div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                                <h1 className="text-3xl font-black italic tracking-tighter text-white">SNIPER_KING_99</h1>
                                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-white/50 uppercase tracking-[0.2em]">ELITE_SYNDICATE</div>
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                                <div className="flex items-center gap-2"><span className="text-cyan-400">●</span> LVL {level}</div>
                                <div className="flex items-center gap-2"><span className="text-indigo-400">●</span> {xp.toLocaleString()} XP</div>
                            </div>
                            <div className="mt-6">
                                <XPBar currentXP={4500} maxXP={10000} level={level} />
                            </div>
                        </div>

                        <button
                            onClick={handleDailyReward}
                            disabled={lastLoginString === new Date().toDateString()}
                            className={`px-8 py-5 rounded-3xl text-[10px] font-black uppercase tracking-[0.4em] transition-all relative overflow-hidden group shadow-xl ${lastLoginString === new Date().toDateString()
                                    ? 'bg-white/5 text-gray-600 border border-white/5 pointer-events-none'
                                    : 'bg-white text-gray-900 hover:scale-105 active:scale-95'
                                }`}
                        >
                            <span className="relative z-10">{lastLoginString === new Date().toDateString() ? 'Claimed' : 'Daily Uplink'}</span>
                            <div className="absolute inset-0 bg-cyan-400 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 opacity-20"></div>
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Mission Control Hub */}
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-end px-2">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.4em]">Mission Control</h3>
                    <div className="text-[10px] font-black text-cyan-400 uppercase tracking-widest animate-pulse">3 Objectives Active</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <GameCard
                        title="Sensitivity Tool"
                        description="Recalibrate your neural optics for maximum headshot precision."
                        glowColor="cyan"
                    />
                    <GameCard
                        title="Daily Challenge"
                        description="Win 3 ranked matches to earn 500 XP and a mystery crate."
                        glowColor="indigo"
                    />
                    <GameCard
                        title="Guild Wars"
                        description="Represent your faction in this week's 50v50 global event."
                        glowColor="purple"
                    />
                </div>
            </div>

            {/* 3. Global Stats Footer */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 opacity-50 contrast-125">
                {[
                    { label: "Matches", val: "1,244" },
                    { label: "Win Rate", val: "68%" },
                    { label: "KD Ratio", val: "2.44" },
                    { label: "Headshots", val: "44%" }
                ].map(stat => (
                    <div key={stat.label} className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                        <div className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1">{stat.label}</div>
                        <div className="text-xl font-bold font-mono text-white">{stat.val}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
