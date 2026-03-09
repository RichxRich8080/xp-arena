import React from 'react';
import { useHUDDepth } from '../hooks/useHUDDepth';

const Premium = () => {
    const depthRef = useHUDDepth(10);

    return (
        <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* 1. Elite Status Header */}
            <div className="flex flex-col items-center text-center px-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-[1px] bg-purple-500"></div>
                    <span className="text-[10px] font-black italic text-purple-400 uppercase tracking-[0.4em]">Elite_Syndicate_Node</span>
                    <div className="w-4 h-[1px] bg-purple-500"></div>
                </div>
                <h2 className="text-4xl font-black italic text-white tracking-tighter uppercase leading-none mb-2">Unlock_Elite_Areni</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest max-w-[250px]">Secure the ultimate advantage over the competition in the global network.</p>
            </div>

            {/* 2. Premium Membership Card */}
            <div
                ref={depthRef}
                className="hud-depth bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/30 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group mx-auto w-full max-w-sm"
            >
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30"></div>

                <div className="flex flex-col items-center text-center relative z-10 mb-8">
                    <div className="w-24 h-24 rounded-[2rem] bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-5xl shadow-[0_0_30px_rgba(168,85,247,0.2)] mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6 duration-500">
                        💎
                    </div>
                    <div className="text-5xl font-black italic text-white tracking-tighter mb-1">$9.99 <span className="text-xs not-italic text-gray-500 uppercase tracking-widest">/ Month</span></div>
                    <div className="text-[8px] font-black text-purple-400 uppercase tracking-[0.4em]">Elite_Tier_Subscription</div>
                </div>

                <div className="flex flex-col gap-4 relative z-10 mb-10">
                    {[
                        "Permanent 20% AXP Boost",
                        "Ad-Free Neural Calibration",
                        "Exclusive Diamond Profile Badge",
                        "Priority Guild Creation"
                    ].map(benefit => (
                        <div key={benefit} className="flex items-center gap-4 bg-white/5 border border-white/5 px-5 py-4 rounded-2xl group/item hover:border-purple-500/30 transition-all">
                            <div className="w-5 h-5 rounded-lg bg-purple-500/20 flex items-center justify-center text-[10px] text-purple-400">✓</div>
                            <span className="text-[10px] font-black text-white/80 uppercase tracking-tight group-hover/item:text-white transition-colors">{benefit}</span>
                        </div>
                    ))}
                </div>

                <button className="w-full bg-white text-purple-900 font-black px-10 py-5 rounded-[2rem] text-[11px] uppercase tracking-[0.4em] transition-all hover:scale-105 active:scale-95 shadow-[0_15px_40px_rgba(255,255,255,0.1)] group/btn">
                    <span className="relative z-10">Initiate_Upgrade</span>
                </button>
            </div>

            {/* 3. Secure Payment Status */}
            <div className="flex flex-col items-center gap-3 opacity-40 contrast-125">
                <div className="flex items-center gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Secure_Neural_Transaction</span>
                </div>
                <div className="flex gap-6 grayscale">
                    <div className="text-[14px] font-black text-white italic tracking-tighter opacity-20 uppercase">VISA</div>
                    <div className="text-[14px] font-black text-white italic tracking-tighter opacity-20 uppercase">MASTER_CARD</div>
                </div>
            </div>
        </div>
    );
};

export default Premium;
