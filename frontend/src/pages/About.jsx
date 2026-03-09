import React from 'react';
import { useHUDDepth } from '../hooks/useHUDDepth';

const About = () => {
    const depthRef = useHUDDepth(5);

    return (
        <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-right-5 duration-700">
            {/* Header */}
            <div className="flex flex-col items-center text-center px-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-[1px] bg-cyan-500"></div>
                    <span className="text-[10px] font-black italic text-cyan-400 uppercase tracking-[0.4em]">Project_Protocol_Alpha</span>
                    <div className="w-4 h-[1px] bg-cyan-500"></div>
                </div>
                <h2 className="text-4xl font-black italic text-white tracking-tighter uppercase leading-none mb-2">The_Areni_Mission</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest max-w-[300px]">Redefining the boundaries between mechanical precision and digital identity.</p>
            </div>

            {/* Vision HUD */}
            <div
                ref={depthRef}
                className="hud-depth bg-gray-950/40 border border-white/5 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group"
            >
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full"></div>
                <div className="flex flex-col gap-6 relative z-10 text-center">
                    <div className="text-sm font-black text-white uppercase italic tracking-widest leading-relaxed">
                        Areni is a high-fidelity ecosystem designed for the next generation of competitive operators.
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight leading-loose max-w-[280px] mx-auto opacity-70">
                        Our sensitivity engine utilizes hardware-level physics and deep learning algorithms to provide the most precise tactile calibration in the Arena.
                    </p>
                </div>
            </div>

            {/* Technical Specs */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-4">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Technical_Specifications</h3>
                </div>

                <div className="grid grid-cols-1 gap-3 px-2">
                    {[
                        { label: "Engine Version", val: "v8.4.2-STABLE", color: "cyan" },
                        { label: "Neural Latency", val: "0.002ms (Target)", color: "green" },
                        { label: "Calibration Logic", val: "Hardware_Atomic", color: "indigo" },
                        { label: "Network Protocol", val: "XPA_SYNC_PRO", color: "purple" }
                    ].map((spec) => (
                        <div key={spec.label} className="bg-white/5 border border-white/5 p-6 rounded-2xl flex items-center justify-between group hover:border-white/20 transition-all">
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">{spec.label}</span>
                            <span className={`text-[10px] font-black text-${spec.color}-400 uppercase italic tracking-tighter font-mono`}>{spec.val}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Notice */}
            <div className="bg-white/5 border border-white/5 p-6 rounded-3xl opacity-30 text-center">
                <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest leading-none">Established: 2026_Cycle_01</span>
                <p className="text-[7px] text-gray-700 font-bold uppercase tracking-widest mt-2 uppercase">Proprietary technology of the Areni Syndicate Group. All rights reserved.</p>
            </div>
        </div>
    );
};

export default About;
