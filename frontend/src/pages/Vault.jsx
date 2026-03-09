import React from 'react';
import { useHUDDepth } from '../hooks/useHUDDepth';
import { useNeuralHaptics } from '../hooks/useNeuralHaptics';
import { useAreni } from '../context/AreniContext';
import { useAudioUI } from '../hooks/useAudioUI';

import { NavLink } from 'react-router-dom';

const Vault = () => {
    const depthRef = useHUDDepth(10);
    const { triggerLightHaptic, triggerRestrictedHaptic } = useNeuralHaptics();
    const { axp, syncGlobalXP } = useAreni();
    const { playSuccess, playError } = useAudioUI();

    return (
        <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-left-5 duration-700">
            {/* 1. Identity Core (Financial HUD) - Consistent with Shop */}
            <div
                ref={depthRef}
                className="hud-depth bg-gradient-to-br from-indigo-900/40 to-black border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group"
            >
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full"></div>
                <div className="flex justify-between items-start mb-8 text-left">
                    <div>
                        <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-1">Vault Access</div>
                        <div className="text-[8px] font-mono text-white/30 truncate max-w-[150px]">SEC_NODE: 0x9F3B...A1C</div>
                    </div>
                    <div className="w-12 h-8 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                        <div className="w-6 h-4 bg-gradient-to-br from-indigo-400/50 to-indigo-600/50 rounded-sm"></div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
                    <div>
                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Vaulted Credits</div>
                        <div className="text-5xl font-black text-white italic tracking-tighter axp-shine">
                            {axp.toLocaleString()} <span className="text-xl text-indigo-400 not-italic ml-2 tracking-widest">AXP</span>
                        </div>
                    </div>
                    <button
                        onClick={() => { triggerLightHaptic(); syncGlobalXP(); }}
                        className="bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 px-6 py-4 rounded-2xl text-[10px] font-black text-indigo-400 uppercase tracking-widest transition-all active:scale-95"
                    >
                        Secure Sync
                    </button>
                </div>
            </div>

            {/* 2. Storage Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <NavLink to="/presets" className="group bg-gray-950/60 border border-white/5 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center hover:border-cyan-500/30 transition-all shadow-xl">
                    <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">🎯</div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">Neural Presets</h3>
                    <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tight mb-6">Access your archived sensitivity configurations.</p>
                    <div className="px-6 py-2 bg-white/5 rounded-full text-[8px] font-black text-cyan-400 uppercase tracking-widest group-hover:bg-cyan-500 group-hover:text-gray-950 transition-all">Open Archive</div>
                </NavLink>

                <div className="group bg-gray-950/60 border border-white/5 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center opacity-40 grayscale pointer-events-none shadow-xl">
                    <div className="w-20 h-20 rounded-3xl bg-purple-500/10 flex items-center justify-center text-4xl mb-6">📦</div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">Digital Armory</h3>
                    <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tight mb-6">Vaulted cosmetics and temporary boosters.</p>
                    <div className="px-6 py-2 bg-white/5 rounded-full text-[8px] font-black text-gray-600 uppercase tracking-widest">Modules Empty</div>
                </div>
            </div>

            {/* 3. Status Terminal */}
            <div className="bg-black/40 border border-white/5 p-6 rounded-3xl text-left font-mono">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[9px] font-black text-green-500 uppercase tracking-widest leading-none">Vault Active / Encrypted</span>
                </div>
                <div className="space-y-1">
                    <div className="text-[8px] text-gray-600">SECURITY_LEVEL: OMEGA</div>
                    <div className="text-[8px] text-gray-600">STORAGE_USED: 12%</div>
                    <div className="text-[8px] text-gray-600">LAST_ACCESS: {new Date().toLocaleTimeString()}</div>
                </div>
            </div>
        </div>
    );
};

export default Vault;
