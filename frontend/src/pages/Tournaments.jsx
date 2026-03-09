import React, { useState, useEffect } from 'react';

const MatchCard = ({ p1, p2, time, status = "UPCOMING" }) => (
    <div className={`relative overflow-hidden bg-gray-950/40 border border-white/5 p-6 rounded-[2rem] transition-all duration-500 group hover:border-white/20 ${status === "LIVE" ? 'border-red-500/30' : ''}`}>
        <div className={`absolute top-0 right-0 px-4 py-1 text-[8px] font-black uppercase tracking-widest ${status === "LIVE" ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-800 text-gray-400'}`}>
            {status}
        </div>

        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs">👤</div>
                    <span className="text-xs font-black text-white uppercase italic tracking-tight">{p1}</span>
                </div>
                <span className="text-[10px] font-mono text-gray-500">04.2</span>
            </div>

            <div className="relative h-px bg-white/5 flex items-center justify-center">
                <div className="bg-gray-950 px-3 text-[8px] font-black text-gray-600 tracking-widest uppercase">vs</div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs">👤</div>
                    <span className="text-xs font-black text-white uppercase italic tracking-tight">{p2}</span>
                </div>
                <span className="text-[10px] font-mono text-gray-500">01.0</span>
            </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{time}</span>
            </div>
            <button className="text-[10px] font-black text-cyan-400 uppercase tracking-widest group-hover:scale-105 transition-transform">Enter_Portal</button>
        </div>
    </div>
);

const Tournaments = () => {
    const [combatMode, setCombatMode] = useState(false);
    const [timeLeft, setTimeLeft] = useState(180);

    useEffect(() => {
        if (!combatMode) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
        return () => clearInterval(timer);
    }, [combatMode]);

    const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    return (
        <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* 1. Syndicate Cup Banner */}
            <div className={`relative overflow-hidden rounded-[3rem] p-8 border transition-all duration-700 ${combatMode ? 'bg-red-950/40 border-red-500/40 shadow-[0_0_50px_rgba(239,68,68,0.2)]' : 'bg-gradient-to-br from-gray-900 to-black border-white/10 shadow-2xl'}`}>
                {/* Visual Flair */}
                <div className={`absolute -top-24 -right-24 w-64 h-64 blur-[100px] rounded-full transition-colors duration-700 ${combatMode ? 'bg-red-500/20' : 'bg-cyan-500/10'}`}></div>
                <div className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-${combatMode ? 'red' : 'cyan'}-500 to-transparent opacity-30`}></div>

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`text-[9px] font-black uppercase tracking-[0.4em] ${combatMode ? 'text-red-400' : 'text-cyan-400'}`}>Areni_Regional_Network</span>
                                <div className={`w-2 h-[1px] ${combatMode ? 'bg-red-500' : 'bg-cyan-500'}`}></div>
                            </div>
                            <h2 className="text-4xl font-black italic text-white tracking-tighter uppercase leading-none">Syndicate_Cup_v8</h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-white/50 uppercase tracking-widest italic">Live_Broadcast</div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl flex items-center gap-3 group/stat">
                            <span className="text-lg">💎</span>
                            <div>
                                <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Prize_Pool</div>
                                <div className="text-xs font-black text-white tracking-widest leading-none uppercase italic">50,000 AXP</div>
                            </div>
                        </div>

                        <button
                            onClick={() => setCombatMode(!combatMode)}
                            className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all relative overflow-hidden group/btn ${combatMode
                                ? 'bg-red-500 text-white shadow-[0_10px_30px_rgba(239,68,68,0.4)] hover:scale-105'
                                : 'bg-white text-gray-900 hover:scale-105 active:scale-95 shadow-xl'
                                }`}
                        >
                            <span className="relative z-10">{combatMode ? 'Abort_Sequence' : 'Engage_Combat'}</span>
                            <div className={`absolute inset-0 translate-x-[-101%] group-hover/btn:translate-x-0 transition-transform duration-500 opacity-20 ${combatMode ? 'bg-white' : 'bg-cyan-500'}`}></div>
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Combat Sequence HUD */}
            {combatMode && (
                <div className="bg-black border border-red-500 p-6 rounded-[2.5rem] flex items-center justify-between relative overflow-hidden animate-in slide-in-from-top-4 duration-300">
                    <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>
                    <div className="flex items-center gap-5 relative z-10">
                        <div className="w-12 h-12 bg-red-500/20 border border-red-500/50 rounded-full flex items-center justify-center text-red-500 text-xl font-black italic">!</div>
                        <div>
                            <div className="text-[10px] font-black text-red-400 uppercase tracking-[0.4em] mb-1 leading-none">Combat_Detected</div>
                            <div className="text-sm font-black text-white uppercase italic tracking-tighter leading-none">Your match sequence is loading...</div>
                        </div>
                    </div>
                    <div className="text-4xl font-black text-red-500 font-mono italic relative z-10 tracking-tighter">{formatTime(timeLeft)}</div>
                </div>
            )}

            {/* 3. Bracket Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between px-4">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Quarter_Finals</h3>
                        <div className="text-[8px] font-black text-cyan-400 uppercase tracking-widest animate-pulse">2 Active</div>
                    </div>
                    <MatchCard p1="SNIPER_GOD" p2="NEURAL_LINK" time="IN_PLAY" status="LIVE" />
                    <MatchCard p1="GHOST_USER" p2="SILENT_AIM" time="T-MINUS 12M" status="UPCOMING" />
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between px-4">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Semi_Finals</h3>
                    </div>
                    <div className="h-full bg-gray-950/20 border-2 border-dashed border-white/5 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center opacity-30 grayscale saturate-50 min-h-[220px]">
                        <div className="w-16 h-16 rounded-full bg-white/5 mb-6 flex items-center justify-center text-3xl">⚔️</div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest max-w-[150px]">Awaiting bracket progression...</p>
                    </div>
                </div>
            </div>

            {/* 4. Rules Footer */}
            <div className="bg-white/5 border border-white/5 p-6 rounded-3xl opacity-50 transition-opacity hover:opacity-100 group">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-[1px] bg-indigo-500"></div>
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Engagement_Rules</span>
                </div>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">Best of 5 rounds • Standard Arena Sens enforced • Global Neural Sync required • Latency check active.</p>
            </div>
        </div>
    );
};

export default Tournaments;
