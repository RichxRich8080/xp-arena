import React from 'react';

const Ecosystem = () => {
    return (
        <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-right-5 duration-700">
            {/* 1. Ecosystem Header */}
            <div className="flex flex-col items-center text-center px-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-[1px] bg-cyan-500"></div>
                    <span className="text-[10px] font-black italic text-cyan-400 uppercase tracking-[0.4em]">Global_Areni_Network</span>
                    <div className="w-4 h-[1px] bg-cyan-500"></div>
                </div>
                <h2 className="text-4xl font-black italic text-white tracking-tighter uppercase leading-none mb-2">The_Arena_Ecosystem</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest max-w-[300px]">Mapping your mechanical precision into universally accepted tokens and identity protocols.</p>
            </div>

            {/* 2. Infrastructure Nodes */}
            <div className="flex flex-col gap-6">
                {[
                    {
                        id: "NODE_01",
                        title: "AXP_Source_Core",
                        emoji: "🪙",
                        desc: "Earn AXP through daily objectives, top-tier leaderboard performance, and neural device synchronization.",
                        color: "yellow",
                        glow: "axp-shine"
                    },
                    {
                        id: "NODE_02",
                        title: "Universal_Identity_Sync",
                        emoji: "🌐",
                        desc: "Your tactical signature follows you across the entire network. Seamlessly display stats across supported titles.",
                        color: "cyan",
                        glow: "text-neon-cyan"
                    },
                    {
                        id: "NODE_03",
                        title: "Neural_Calibration_Hub",
                        emoji: "📱",
                        desc: "Access high-fidelity sensitivity tuning logic derived from hardware-level physics and professional gameplay data.",
                        color: "indigo",
                        glow: "text-indigo-400"
                    }
                ].map((node) => (
                    <div
                        key={node.id}
                        className={`group relative overflow-hidden bg-gray-950/40 border border-white/5 p-8 rounded-[3rem] transition-all duration-500 hover:border-${node.color}-500/30 hover:bg-white/5`}
                    >
                        <div className={`absolute -top-12 -right-12 w-32 h-32 bg-${node.color}-500/10 blur-[60px] rounded-full transition-opacity opacity-50 group-hover:opacity-100`}></div>

                        <div className="flex items-start gap-6 relative z-10">
                            <div className={`w-14 h-14 rounded-2xl bg-${node.color}-500/10 border border-${node.color}-500/20 flex items-center justify-center text-2xl shadow-xl transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                                {node.emoji}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className={`text-[8px] font-black text-${node.color}-500 uppercase tracking-widest`}>{node.id}</span>
                                    <div className={`w-1.5 h-1.5 rounded-full bg-${node.color}-500 animate-pulse`}></div>
                                </div>
                                <h3 className={`text-xl font-black italic text-white tracking-tighter uppercase mb-2 ${node.glow}`}>{node.title}</h3>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight leading-relaxed max-w-[90%]">{node.desc}</p>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4 opacity-50">
                            <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Protocol: Active_v8.4</span>
                            <span className="text-[8px] font-black text-white uppercase italic tracking-widest">Verify_Node</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Global Stats HUD */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center justify-between opacity-50 contrast-125">
                <div className="flex flex-col">
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Network_Reach</span>
                    <span className="text-xl font-bold font-mono text-white tracking-tighter">142,500+</span>
                </div>
                <div className="h-8 w-[1px] bg-white/10"></div>
                <div className="flex flex-col text-right">
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Active_Nodes</span>
                    <span className="text-xl font-bold font-mono text-cyan-400 tracking-tighter">05_Major</span>
                </div>
            </div>
        </div>
    );
};

export default Ecosystem;
