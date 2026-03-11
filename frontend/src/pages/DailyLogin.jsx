import React, { useState } from 'react';
import { useHUDDepth } from '../hooks/useHUDDepth';
import { useNeuralHaptics } from '../hooks/useNeuralHaptics';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { useAudioUI } from '../hooks/useAudioUI';

const DailyLogin = () => {
    const depthRef = useHUDDepth(10);
    const { triggerHeavyHaptic } = useNeuralHaptics();
    const { showAreniAlert, triggerAreniPulse } = useAuth();
    const { playSuccess } = useAudioUI();
    const [claimed, setClaimed] = useState(false);

    const rewards = [
        { day: 1, val: "100 AXP", icon: "💎", status: "Claimed" },
        { day: 2, val: "200 AXP", icon: "💎", status: "Claimed" },
        { day: 3, val: "Daily Crate", icon: "📦", status: "Current" },
        { day: 4, val: "500 AXP", icon: "💎", status: "Upcoming" },
        { day: 5, val: "XP Boost", icon: "⚡", status: "Upcoming" },
        { day: 6, val: "1,000 AXP", icon: "💎", status: "Upcoming" },
        { day: 7, val: "Elite Skin", icon: "🎭", status: "Upcoming" },
    ];

    const handleClaim = () => {
        if (claimed) return;
        setClaimed(true);
        triggerHeavyHaptic();
        playSuccess();
        triggerAreniPulse();
        showAreniAlert('Daily Reward Decrypted!', 'success');
    };

    return (
        <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Header */}
            <div className="flex flex-col items-center text-center px-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-[1px] bg-green-500"></div>
                    <span className="text-[10px] font-black italic text-green-500 uppercase tracking-[0.4em]">Node_Persistence_Link</span>
                    <div className="w-4 h-[1px] bg-green-500"></div>
                </div>
                <h2 className="text-4xl font-black italic text-white tracking-tighter uppercase leading-none mb-2">Daily_Reward</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest max-w-[250px]">Maintain your neural link for consecutive cycles to earn high-tier rewards.</p>
            </div>

            {/* Reward Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {rewards.map((r) => (
                    <div
                        key={r.day}
                        className={`relative overflow-hidden border p-6 rounded-[2.5rem] flex flex-col items-center text-center transition-all duration-500 ${r.status === 'Claimed'
                                ? 'bg-gray-950/20 border-white/5 opacity-30 grayscale'
                                : r.status === 'Current'
                                    ? 'bg-gray-950/60 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.1)] scale-105 z-10'
                                    : 'bg-gray-950/40 border-white/5 opacity-50'
                            }`}
                    >
                        {r.status === 'Current' && (
                            <div className="absolute top-0 right-0 px-4 py-1 bg-green-500 text-gray-950 text-[8px] font-black uppercase tracking-widest italic animate-pulse">
                                Active
                            </div>
                        )}

                        <div className="text-3xl mb-4 transition-transform duration-500 hover:scale-110">{r.icon}</div>
                        <div className="text-[10px] font-black text-white uppercase italic tracking-tighter mb-1">{r.val}</div>
                        <div className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Day_{r.day}</div>
                    </div>
                ))}
            </div>

            {/* Claim Portal */}
            <div
                ref={depthRef}
                className="hud-depth bg-gradient-to-br from-gray-900 to-black border border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group flex flex-col items-center"
            >
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-green-500/10 blur-[100px] rounded-full"></div>

                <div className="relative z-10 text-center mb-10">
                    <div className="text-[10px] font-black text-green-400 uppercase tracking-[0.4em] mb-2 leading-none">Cycle_Sync_Detected</div>
                    <div className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Ready for Decryption</div>
                </div>

                <button
                    onClick={handleClaim}
                    disabled={claimed}
                    className={`w-full max-w-xs py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] transition-all relative overflow-hidden ${claimed
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5'
                            : 'bg-white text-gray-950 hover:scale-105 active:scale-95 shadow-xl'
                        }`}
                >
                    <span className="relative z-10">{claimed ? 'Next_Cycle_Pending' : 'Claim_Link_Bonus'}</span>
                    <div className={`absolute inset-0 bg-green-500/10 transition-transform duration-700 ${claimed ? 'translate-x-0' : 'translate-x-[-101%]'}`}></div>
                </button>
            </div>

            {/* Streak Counter */}
            <div className="bg-white/5 border border-white/5 p-6 rounded-3xl opacity-50 text-center">
                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Neural_Streak_Persistence</span>
                <div className="text-xl font-black text-white italic tracking-widest mt-2 uppercase font-mono">03 Cycles_Held</div>
            </div>
        </div>
    );
};

export default DailyLogin;
