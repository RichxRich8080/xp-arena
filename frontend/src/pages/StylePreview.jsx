import React from 'react';
import { useHUDDepth } from '../hooks/useHUDDepth';

const StylePreview = () => {
    const depthRef = useHUDDepth(10);

    return (
        <div className="flex flex-col gap-12 pb-24 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Header */}
            <div className="flex flex-col items-center text-center px-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-[1px] bg-indigo-500"></div>
                    <span className="text-[10px] font-black italic text-indigo-400 uppercase tracking-[0.4em]">Design_Protocol_Preview</span>
                    <div className="w-4 h-[1px] bg-indigo-500"></div>
                </div>
                <h2 className="text-4xl font-black italic text-white tracking-tighter uppercase leading-none mb-2">Areni_UI_Kit</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest max-w-[300px]">Tactical design tokens and high-fidelity component architectures.</p>
            </div>

            {/* Typography Section */}
            <section className="flex flex-col gap-6">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.4em] px-4 italic">01_Typography</h3>
                <div className="bg-gray-950/40 border border-white/5 p-8 rounded-[3rem] space-y-6">
                    <div className="space-y-1">
                        <div className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Display Main</div>
                        <div className="text-4xl font-black italic text-white tracking-tighter uppercase">Neural_Uplink</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Sub Header</div>
                        <div className="text-xl font-bold text-white uppercase tracking-widest">Tactical Node</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Body Protocol</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-loose">
                            Precise mechanical calibration through hardware-atomic logic.
                        </div>
                    </div>
                </div>
            </section>

            {/* Color Tokens */}
            <section className="flex flex-col gap-6">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.4em] px-4 italic">02_Neural_Colors</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { name: "Cyan_Core", color: "bg-cyan-500", hex: "#06b6d4" },
                        { name: "Indigo_Node", color: "bg-indigo-500", hex: "#6366f1" },
                        { name: "Red_Alert", color: "bg-red-500", hex: "#ef4444" },
                        { name: "Yellow_AXP", color: "bg-yellow-500", hex: "#eab308" }
                    ].map((token) => (
                        <div key={token.name} className="bg-gray-950/40 border border-white/5 p-4 rounded-[2rem] flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-2xl ${token.color} mb-3 shadow-lg`}></div>
                            <div className="text-[8px] font-black text-white uppercase tracking-tighter">{token.name}</div>
                            <div className="text-[7px] font-black text-gray-600 uppercase mt-1 font-mono">{token.hex}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* HUD Components */}
            <section className="flex flex-col gap-6">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.4em] px-4 italic">03_HUD_Nodes</h3>
                <div className="flex flex-col gap-6">
                    {/* Depth Card Example */}
                    <div
                        ref={depthRef}
                        className="hud-depth bg-gradient-to-br from-indigo-950/40 to-black border border-indigo-500/20 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 blur-[60px] rounded-full"></div>
                        <div className="relative z-10">
                            <h4 className="text-lg font-black italic text-white tracking-tighter uppercase mb-2">Neural_Depth_Protocol</h4>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">Interactive parallax layers driven by device orientation telemetry.</p>
                            <button className="mt-6 bg-white text-gray-950 px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-widest">Execute_Depth</button>
                        </div>
                    </div>

                    {/* Glassmorphic Node */}
                    <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] flex items-center justify-between">
                        <div>
                            <div className="text-[8px] font-black text-cyan-500 uppercase tracking-[0.4em] mb-1">Status_Stable</div>
                            <h4 className="text-sm font-black text-white uppercase italic tracking-widest">Glass_Bypass_HUD</h4>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                            🌐
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default StylePreview;
