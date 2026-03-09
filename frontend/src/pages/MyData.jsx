import React, { useState } from 'react';
import { useHUDDepth } from '../hooks/useHUDDepth';
import { useNeuralHaptics } from '../hooks/useNeuralHaptics';
import { useAreni } from '../context/AreniContext';

const MyData = () => {
    const depthRef = useHUDDepth(10);
    const { triggerLightHaptic } = useNeuralHaptics();
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = () => {
        setIsExporting(true);
        triggerLightHaptic();
        setTimeout(() => setIsExporting(false), 3000);
    };

    return (
        <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-right-5 duration-700">
            {/* Header */}
            <div className="flex flex-col items-center text-center px-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-[1px] bg-indigo-500"></div>
                    <span className="text-[10px] font-black italic text-indigo-400 uppercase tracking-[0.4em]">Data_Governance_Node</span>
                    <div className="w-4 h-[1px] bg-indigo-500"></div>
                </div>
                <h2 className="text-4xl font-black italic text-white tracking-tighter uppercase leading-none mb-2">Neural_Vault_Export</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest max-w-[250px]">Manage your tactical bio-signature and export your performance history.</p>
            </div>

            {/* Data Summary HUD */}
            <div
                ref={depthRef}
                className="hud-depth bg-gray-950/40 border border-white/5 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl pointer-events-none"></div>

                <div className="flex flex-col gap-6 relative z-10">
                    <div className="flex justify-between items-center px-2">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Storage_Stability</span>
                        <span className="text-[9px] font-black text-green-400 uppercase italic">99.8% Optimized</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {[
                            { label: "Profile Metadata", size: "1.2 MB", status: "SYNCED" },
                            { label: "Combat History", size: "4.8 MB", status: "SYNCED" },
                            { label: "Neural Presets", size: "0.4 MB", status: "SYNCED" }
                        ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between bg-white/5 border border-white/5 p-5 rounded-2xl group hover:border-indigo-500/30 transition-all">
                                <div>
                                    <div className="text-xs font-black text-white uppercase italic tracking-tight">{item.label}</div>
                                    <div className="text-[8px] font-black text-gray-600 uppercase tracking-widest mt-1">{item.size}</div>
                                </div>
                                <div className="text-[8px] font-black text-indigo-400 tracking-widest uppercase px-3 py-1.5 rounded-full bg-indigo-500/10">{item.status}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Export Section */}
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center px-4">
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.4em]">Export_Protocol</h3>
                    <div className="h-[1px] flex-1 mx-6 bg-white/5"></div>
                </div>

                <div className="bg-white/5 border border-white/5 p-8 rounded-[3rem] flex flex-col items-center text-center group">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl mb-6 transition-transform group-hover:scale-110">📦</div>
                    <h4 className="text-lg font-black text-white uppercase italic tracking-widest mb-2">Request_Data_Archive</h4>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tight leading-relaxed max-w-[220px] mb-8">Initiate a secure neural dump of all associated tactical data in JSON format.</p>

                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className={`w-full py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] transition-all relative overflow-hidden ${isExporting
                                ? 'bg-gray-800 text-gray-500'
                                : 'bg-white text-gray-950 hover:scale-105 active:scale-95 shadow-xl'
                            }`}
                    >
                        <span className="relative z-10">{isExporting ? 'Packaging_Data...' : 'Begin_Neural_Dump'}</span>
                        <div className={`absolute inset-0 bg-indigo-500/10 transition-transform duration-[3000ms] ${isExporting ? 'translate-x-0' : 'translate-x-[-101%]'}`}></div>
                    </button>
                </div>
            </div>

            {/* Termination HUD */}
            <div className="bg-red-500/5 border border-red-500/10 p-6 rounded-3xl opacity-50 transition-opacity hover:opacity-100 group cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-[1px] bg-red-500"></div>
                    <span className="text-[10px] font-black text-red-400 uppercase tracking-[0.4em]">Self_Destruct_Protocol</span>
                </div>
                <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest leading-relaxed">Permanently purge all neural data and terminate your Arena bio-signature. This action is irreversible.</p>
            </div>
        </div>
    );
};

export default MyData;
