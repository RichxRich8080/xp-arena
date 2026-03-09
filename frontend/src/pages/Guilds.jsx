import React from 'react';
import { useHUDDepth } from '../hooks/useHUDDepth';
import { useNeuralHaptics } from '../hooks/useNeuralHaptics';

const MemberCard = ({ name, rank, axp, status = "OFFLINE" }) => (
    <div className="relative group bg-gray-950/40 border border-white/5 p-6 rounded-[2rem] flex flex-col items-center text-center transition-all duration-500 hover:border-white/20 hover:bg-white/5">
        <div className="relative mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl transition-transform duration-500 group-hover:scale-110">
                {name.charAt(0)}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-gray-950 ${status === "ONLINE" ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-700'}`}></div>
        </div>

        <div className="mb-4">
            <div className="text-xs font-black text-white uppercase italic tracking-tight mb-1 group-hover:text-cyan-400 transition-colors">{name}</div>
            <div className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em]">{rank}</div>
        </div>

        <div className="w-full pt-4 border-t border-white/5">
            <div className="text-[10px] font-black font-mono text-white/80 italic">{axp.toLocaleString()}</div>
            <div className="text-[7px] font-black text-gray-700 uppercase tracking-widest mt-1">AXP_Contribution</div>
        </div>
    </div>
);

const Guilds = () => {
    const depthRef = useHUDDepth(10);
    const { triggerLightHaptic } = useNeuralHaptics();

    return (
        <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-right-5 duration-700">
            {/* 1. Faction Hub Banner */}
            <div
                ref={depthRef}
                className="hud-depth bg-gradient-to-br from-indigo-900/40 to-black border border-white/10 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group"
            >
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full"></div>

                <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
                    <div className="flex gap-6 items-center">
                        <div className="w-20 h-20 bg-gray-950 rounded-[2rem] flex items-center justify-center text-4xl border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.2)] rotate-3 transition-transform group-hover:rotate-0 duration-500">
                            🛡️
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.4em]">Strategic_Syndicate_Node</span>
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                            </div>
                            <h2 className="text-4xl font-black italic text-white tracking-tighter uppercase leading-none">Omega_Squad</h2>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <div className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl">
                            <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">World_Rank</div>
                            <div className="text-sm font-black text-white uppercase italic tracking-widest">#04 Elite</div>
                        </div>
                        <button
                            onClick={() => triggerLightHaptic()}
                            className="px-8 py-3 bg-white text-indigo-950 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-xl"
                        >
                            Neural_Bridge
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex gap-6 border-t border-white/5 pt-6 relative z-10">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Total_Members</span>
                        <span className="text-xs font-black text-white italic">15 / 50</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Faction_XP</span>
                        <span className="text-xs font-black text-indigo-400 italic font-mono">1.2M+</span>
                    </div>
                </div>
            </div>

            {/* 2. Active Roster Grid */}
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center px-4">
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.4em]">Active_Roster</h3>
                    <div className="h-[1px] flex-1 mx-6 bg-white/5"></div>
                    <span className="text-[9px] font-black text-gray-600 uppercase italic">Status: Link_Stable</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <MemberCard name="Sniper_King" rank="OFFICER" axp={15402} status="ONLINE" />
                    <MemberCard name="Neural_V" rank="LEADER" axp={42900} status="ONLINE" />
                    <MemberCard name="Ghost_Walker" rank="SCOUT" axp={8200} />
                    <MemberCard name="Silent_Echo" rank="SCOUT" axp={4500} status="ONLINE" />
                    <MemberCard name="Shadow_Rage" rank="KNIGHT" axp={12300} />
                </div>
            </div>

            {/* 3. Recruitment Portal */}
            <div className="group relative overflow-hidden bg-gray-950/60 border-2 border-dashed border-white/5 p-10 rounded-[3rem] flex flex-col items-center justify-center text-center hover:border-cyan-500/30 transition-all cursor-pointer">
                <div className="absolute inset-0 bg-cyan-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 mb-6 text-3xl font-black relative z-10 transition-transform group-hover:scale-110">+</div>
                <h4 className="text-lg font-black text-white uppercase italic tracking-widest relative z-10 mb-2">Recruit_Operators</h4>
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-tight leading-relaxed max-w-[250px] relative z-10">Generate a secure Neural Link to expand your faction's dominance across the Arena network.</p>
            </div>
        </div>
    );
};

export default Guilds;
