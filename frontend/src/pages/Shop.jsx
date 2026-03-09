import React from 'react';
import { useHUDDepth } from '../hooks/useHUDDepth';
import { useNeuralHaptics } from '../hooks/useNeuralHaptics';
import { useAreni } from '../context/AreniContext';
import { useAudioUI } from '../hooks/useAudioUI';

const Shop = () => {
    const depthRef = useHUDDepth(10);
    const { triggerLightHaptic, triggerRestrictedHaptic } = useNeuralHaptics();
    const { axp, syncGlobalXP, buyItem } = useAreni();
    const { playSuccess, playError } = useAudioUI();

    const armory = [
        { title: "Neon Visor", desc: "Neuro-Link Overlay", cost: 500, color: "cyan", icon: "🕶️" },
        { title: "XP Booster", desc: "2x Match Velocity", cost: 1200, color: "purple", icon: "🚀" },
        { title: "Guild Token", desc: "Faction Entry Pass", cost: 2500, color: "yellow", icon: "🔑" },
        { title: "Shadow Camo", desc: "Stealth Logic Skin", cost: 800, color: "indigo", icon: "🎨" },
        { title: "Neural Core", desc: "Internal Logic Buff", cost: 5000, color: "pink", icon: "🧠" },
        { title: "Areni Prime", desc: "Elite Status Badge", cost: 10000, color: "red", icon: "👑" }
    ];

    const handlePurchase = (item, e) => {
        const success = buyItem(item.cost, item.title);
        if (success) {
            triggerLightHaptic();
            playSuccess();
        } else {
            triggerRestrictedHaptic();
            playError();
        }
    };

    return (
        <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* 1. Identity Core (Financial HUD) */}
            <div
                ref={depthRef}
                className="hud-depth bg-gradient-to-br from-gray-900 to-black border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group"
            >
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30"></div>

                <div className="flex justify-between items-start mb-8">
                    <div>
                        <div className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] mb-1">Identity Core</div>
                        <div className="text-[8px] font-mono text-white/30 truncate max-w-[150px]">SEC_NODE: 0x9F3B...A1C</div>
                    </div>
                    <div className="w-12 h-8 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                        <div className="w-6 h-4 bg-gradient-to-br from-yellow-400/50 to-yellow-600/50 rounded-sm"></div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Syncable Credits</div>
                        <div className="text-5xl font-black text-white italic tracking-tighter axp-shine">
                            {axp.toLocaleString()} <span className="text-xl text-cyan-400 not-italic ml-2 tracking-widest">AXP</span>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            triggerLightHaptic();
                            syncGlobalXP();
                        }}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-3 transition-all active:scale-95 group/btn"
                    >
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Refresh Node</span>
                    </button>
                </div>
            </div>

            {/* 2. Tactical Armory Grid */}
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center px-2">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.4em]">Tactical Armory</h3>
                    <div className="h-[1px] flex-1 mx-4 bg-white/5"></div>
                    <span className="text-[8px] font-black text-gray-600 uppercase italic">Refinement v8.2</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {armory.map((item, i) => {
                        const isLocked = axp < item.cost;
                        return (
                            <div
                                key={i}
                                onClick={(e) => handlePurchase(item, e)}
                                className={`relative group p-6 rounded-[2rem] border transition-all duration-500 flex flex-col items-center text-center cursor-pointer ${isLocked
                                        ? 'bg-gray-900/40 border-white/5 grayscale pointer-events-none'
                                        : `bg-gray-950/60 border-white/10 hover:border-${item.color}-500/50 hover:bg-${item.color}-500/5`
                                    }`}
                            >
                                <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center text-3xl transition-transform duration-500 group-hover:scale-110 shadow-lg ${isLocked ? 'bg-white/5' : `bg-${item.color}-500/10 border border-${item.color}-500/20`
                                    }`}>
                                    {item.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs font-black text-white uppercase tracking-tight mb-1">{item.title}</div>
                                    <div className="text-[8px] text-gray-600 font-bold uppercase tracking-widest mb-4 leading-tight">{item.desc}</div>
                                </div>
                                <div className={`text-[10px] font-black font-mono tracking-tighter px-4 py-2 rounded-full border ${isLocked ? 'border-gray-800 text-gray-700' : `border-${item.color}-500/30 text-${item.color}-400`
                                    }`}>
                                    {item.cost.toLocaleString()} AXP
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Shop;
