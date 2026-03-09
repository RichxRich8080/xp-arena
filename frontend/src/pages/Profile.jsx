import React from 'react';
import { useHUDDepth } from '../hooks/useHUDDepth';

const Profile = () => {
    const depthRef = useHUDDepth(5);
    const { axp, level, xp } = useAreni();

    return (
        <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-top-5 duration-700">
            {/* 1. Operator Identity HUD */}
            <div
                ref={depthRef}
                className="hud-depth bg-gradient-to-br from-gray-950 to-black border border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group"
            >
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30"></div>

                <div className="flex flex-col items-center text-center relative z-10">
                    <div className="relative mb-8">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-tr from-cyan-400 to-indigo-600 p-[3px] shadow-[0_0_50px_rgba(6,182,212,0.3)] rotate-3 transition-transform group-hover:rotate-0 duration-500">
                            <div className="w-full h-full bg-gray-950 rounded-[2.1rem] flex items-center justify-center font-black text-5xl text-white">S</div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-gray-950 flex items-center justify-center text-xs shadow-lg animate-pulse">⚡</div>
                    </div>

                    <div className="flex flex-col items-center gap-2 mb-8">
                        <h2 className="text-3xl font-black italic text-white tracking-tighter uppercase leading-none">Sniper_King_99</h2>
                        <div className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] leading-none mb-2">Master_Tier_III</div>
                        <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-gray-500 uppercase tracking-widest italic">Node_Active: SIN_772</div>
                    </div>

                    <div className="w-full max-w-sm">
                        <XPBar currentXP={4500} maxXP={10000} level={level} />
                        <div className="flex justify-between mt-3 px-1">
                            <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Progress to Lvl {level + 1}</span>
                            <span className="text-[8px] font-black text-white/50 font-mono tracking-widest">4,500 / 10,000 XP</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Tactical Stats Grid */}
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center px-4">
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.4em]">Performance_Metrics</h3>
                    <div className="h-[1px] flex-1 mx-6 bg-white/5"></div>
                    <span className="text-[9px] font-black text-gray-600 uppercase italic">Metric: Link_Stable</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Matches", val: "1,244", color: "indigo" },
                        { label: "Win Rate", val: "68%", color: "cyan" },
                        { label: "KD Ratio", val: "2.44", color: "purple" },
                        { label: "Headshots", val: "44%", color: "red" }
                    ].map(stat => (
                        <div key={stat.label} className="bg-gray-950/40 border border-white/5 p-6 rounded-[2rem] group hover:border-white/20 transition-all">
                            <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2 leading-none">{stat.label}</div>
                            <div className={`text-2xl font-black italic font-mono text-white tracking-tighter group-hover:text-${stat.color}-400 transition-colors`}>{stat.val}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Control Panel (Settings) */}
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center px-4">
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.4em]">Control_Panel</h3>
                    <div className="h-[1px] flex-1 mx-6 bg-white/5"></div>
                </div>

                <div className="flex flex-col gap-3">
                    {[
                        { icon: "🔈", label: "Neural Audio", status: "ENABLED", color: "cyan" },
                        { icon: "🫳", label: "Tactile Haptics", status: "ENABLED", color: "purple" },
                        { icon: "👁️", label: "HUD Depth", status: "STABLE", color: "indigo" }
                    ].map(opt => (
                        <div key={opt.label} className="bg-gray-950/40 border border-white/5 p-6 rounded-[2rem] flex items-center justify-between group hover:border-white/20">
                            <div className="flex items-center gap-5">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">{opt.icon}</div>
                                <span className="text-sm font-black text-white uppercase italic tracking-tight">{opt.label}</span>
                            </div>
                            <div className={`text-[9px] font-black tracking-widest px-4 py-2 rounded-full border border-white/5 bg-white/5 text-${opt.color}-400`}>
                                {opt.status}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Logout Sequence */}
            <button className="mt-4 w-full bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 p-8 rounded-[3rem] transition-all flex flex-col items-center group">
                <div className="text-[10px] font-black text-gray-500 group-hover:text-red-400 uppercase tracking-[0.5em] transition-colors">Terminate_Session</div>
                <div className="mt-2 text-[8px] font-black text-gray-700 uppercase tracking-widest italic opacity-50">Secure Logoff v8.0</div>
            </button>
        </div>
    );
};

export default Profile;
