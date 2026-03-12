import React from 'react';
import { Globe, Cpu, Zap, Activity, ShieldCheck, Database, Network, ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';

const NodeItem = ({ id, title, emoji, desc, color, glow }) => (
    <div className={cn(
        "group relative overflow-hidden glass-panel p-10 border-white/5 transition-all duration-700 bg-white/[0.01] hover:bg-white/[0.03]",
        `hover:border-${color}/30`
    )}>
        <div className={cn("absolute -top-12 -right-12 w-48 h-48 blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity rounded-full", `bg-${color}`)} />
        
        <div className="flex flex-col md:flex-row items-start gap-10 relative z-10">
            <div className={cn(
                "w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-2xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 border",
                `bg-${color}/10 border-${color}/20`
            )}>
                {emoji}
            </div>
            <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                    <span className={cn("text-[8px] font-black uppercase tracking-[0.4em]", `text-${color}`)}>{id}</span>
                    <div className={cn("w-2 h-2 rounded-full animate-ping", `bg-${color}`)} />
                </div>
                <h3 className={cn("text-2xl font-black italic text-white tracking-tighter uppercase font-display", glow)}>{title}</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed max-w-xl italic">{desc}</p>
            </div>
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-white/5 pt-6 opacity-30 group-hover:opacity-70 transition-opacity">
            <div className="flex items-center gap-3">
                <Network className="w-3.5 h-3.5" />
                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Protocol: ACTIVE_V8.4</span>
            </div>
            <div className="flex items-center gap-2 group/link cursor-pointer">
                <span className="text-[8px] font-black text-white uppercase italic tracking-[0.3em]">VERIFY_NODE_INTEGRITY</span>
                <ChevronRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
            </div>
        </div>
    </div>
);

const Ecosystem = () => {
    return (
        <div className="space-y-16 pb-20 animate-slide-in font-display">
            {/* Ecosystem Header */}
            <div className="text-center space-y-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-4">
                    <div className="h-1px w-10 bg-accent-cyan/50" />
                    <span className="text-[10px] font-black italic text-accent-cyan uppercase tracking-[0.5em]">Global_Areni_Network</span>
                    <div className="h-1px w-10 bg-accent-cyan/50" />
                </div>
                <h1 className="text-5xl md:text-7xl font-black italic text-white tracking-tighter uppercase leading-none">
                    ARENA <span className="text-accent-cyan">ECOSYSTEM</span>
                </h1>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-lg mx-auto italic">
                    Mapping mechanical precision into universally accepted tokens and tactical identity protocols across the metaverse.
                </p>
            </div>

            {/* Infrastructure Nodes */}
            <div className="space-y-8">
                 <div className="flex items-center gap-4 ml-4">
                    <Database className="w-4 h-4 text-gray-500" />
                    <h3 className="text-[10px] font-black text-gray-500 tracking-[0.4em] uppercase">SYSTEM_NODES_FOUNDATION</h3>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <NodeItem 
                        id="NODE_01"
                        title="AXP_SOURCE_CORE"
                        emoji="🪙"
                        desc="Generate AXP through daily objectives, top-tier leaderboard performance, and gold-level neural device synchronization."
                        color="axp-gold"
                        glow="text-glow-gold"
                    />
                    <NodeItem 
                        id="NODE_02"
                        title="UNIVERSAL_ID_SYNC"
                        emoji="🌐"
                        desc="Your tactical signature is immutable across the entire network. Seamlessly display cross-title statistics and achievements."
                        color="accent-cyan"
                        glow="text-glow-cyan"
                    />
                    <NodeItem 
                        id="NODE_03"
                        title="NEURAL_CALIBRATION_HUB"
                        emoji="📱"
                        desc="Access high-fidelity sensitivity tuning logic derived from hardware-level physics and professional-grade kinematics."
                        color="accent-green"
                        glow="text-glow-green"
                    />
                </div>
            </div>

            {/* Network Analytics HUD */}
            <div className="glass-panel border-white/5 bg-white/[0.01] p-10 flex flex-col md:flex-row items-center justify-between gap-10 opacity-60 hover:opacity-100 transition-opacity">
                <div className="flex gap-12 items-center">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] mb-2 leading-none">TOTAL_NETWORK_REACH</span>
                        <div className="flex items-end gap-3">
                            <span className="text-4xl font-black text-white italic tracking-tighter font-mono uppercase">142,500<span className="text-gray-600 text-xs tracking-widest">+</span></span>
                            <span className="text-[8px] font-black text-accent-cyan uppercase mb-1">ARENIS_JOINED</span>
                        </div>
                    </div>
                    <div className="h-12 w-1px bg-white/5 hidden md:block" />
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] mb-2 leading-none">ACTIVE_INFRA_NODES</span>
                        <div className="flex items-end gap-3">
                             <span className="text-4xl font-black text-accent-cyan italic tracking-tighter font-mono uppercase">06_MAJOR</span>
                             <span className="text-[8px] font-black text-accent-green uppercase mb-1">STABLE_UPTIME</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                        <span className="text-[8px] font-black text-gray-500 tracking-[0.3em] uppercase block">SYSTEM_STATUS</span>
                        <span className="text-[10px] font-black text-accent-green italic uppercase tracking-widest">NOMINAL_OPTIMIZED</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-accent-green animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ecosystem;
