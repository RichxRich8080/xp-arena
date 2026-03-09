import React, { useState } from 'react';
import { useHUDDepth } from '../hooks/useHUDDepth';
import { useNeuralHaptics } from '../hooks/useNeuralHaptics';

const StatBar = ({ label, p1, p2, max, color }) => {
    const p1Perc = (p1 / max) * 100;
    const p2Perc = (p2 / max) * 100;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end px-1">
                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
                <div className="flex gap-4">
                    <span className="text-[10px] font-black text-white italic font-mono">{p1}</span>
                    <span className={`text-[10px] font-black text-${color}-400 italic font-mono`}>{p2}</span>
                </div>
            </div>
            <div className="h-2 bg-gray-950 rounded-full overflow-hidden flex">
                <div
                    className="h-full bg-white transition-all duration-1000 ease-out"
                    style={{ width: `${p1Perc / 2}%` }}
                />
                <div className="w-[2px] h-full bg-gray-800" />
                <div
                    className={`h-full bg-${color}-500 transition-all duration-1000 ease-out`}
                    style={{ width: `${p2Perc / 2}%` }}
                />
            </div>
        </div>
    );
};

const Compare = () => {
    const depthRef = useHUDDepth(10);
    const { triggerLightHaptic } = useNeuralHaptics();
    const [targetPlayer, setTargetPlayer] = useState("Elite_Operator");

    return (
        <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-right-5 duration-700">
            {/* Header */}
            <div className="flex flex-col items-center text-center px-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-[1px] bg-purple-500"></div>
                    <span className="text-[10px] font-black italic text-purple-400 uppercase tracking-[0.4em]">Neural_Comparison_Node</span>
                    <div className="w-4 h-[1px] bg-purple-500"></div>
                </div>
                <h2 className="text-4xl font-black italic text-white tracking-tighter uppercase leading-none mb-2">Versus_HUD</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest max-w-[250px]">Contrast your tactical bio-signature against high-tier Arena operators.</p>
            </div>

            {/* Versus Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-950/40 border border-white/10 p-6 rounded-[2.5rem] flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mb-4">👤</div>
                    <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">YOU</div>
                    <div className="text-sm font-black text-white uppercase italic tracking-tighter">Sniper_King</div>
                </div>
                <div className="bg-gray-950/40 border border-purple-500/20 p-6 rounded-[2.5rem] flex flex-col items-center text-center group">
                    <div className="w-16 h-16 rounded-2xl bg-purple-500/5 border border-purple-500/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">👤</div>
                    <div className="text-[8px] font-black text-purple-500 uppercase tracking-widest mb-1">TARGET</div>
                    <div className="text-sm font-black text-white uppercase italic tracking-tighter">{targetPlayer}</div>
                </div>
            </div>

            {/* Search HUD */}
            <div className="px-4">
                <div className="relative group/search">
                    <input
                        type="text"
                        placeholder="Search_Neural_ID..."
                        className="w-full bg-white/5 border border-white/5 px-8 py-5 rounded-[2rem] text-xs font-black text-white uppercase italic tracking-widest outline-none focus:border-purple-500/30 transition-all placeholder:text-gray-700"
                    />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-gray-950 px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest">LINK_ID</button>
                </div>
            </div>

            {/* Metrics HUD */}
            <div
                ref={depthRef}
                className="hud-depth bg-gray-950/40 border border-white/5 p-10 rounded-[3rem] shadow-2xl space-y-8"
            >
                <StatBar label="AXP TOTAL" p1={42500} p2={51200} max={60000} color="purple" />
                <StatBar label="KD RATIO" p1={2.4} p2={2.8} max={5.0} color="cyan" />
                <StatBar label="HEADSHOT %" p1={44} p2={48} max={100} color="red" />
                <StatBar label="ARENA LEVEL" p1={42} p2={55} max={100} color="indigo" />
            </div>

            {/* Win Analysis */}
            <div className="bg-white/5 border border-white/5 p-6 rounded-3xl opacity-50 text-center flex flex-col gap-2">
                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Performance_Gap_Analysis</span>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight italic">Target leads by 12.4% in mechanical precision.</p>
            </div>
        </div>
    );
};

export default Compare;
