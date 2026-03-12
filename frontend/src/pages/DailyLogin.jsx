import React, { useState } from 'react';
import { useHUDDepth } from '../hooks/useHUDDepth';
import { useNeuralHaptics } from '../hooks/useNeuralHaptics';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Calendar, Zap, Box, Star, Award, ChevronRight, Activity, Lock } from 'lucide-react';
import { cn } from '../utils/cn';

const DailyLogin = () => {
    const depthRef = useHUDDepth(12);
    const { triggerHeavyHaptic } = useNeuralHaptics();
    const { triggerAreniPulse } = useAuth();
    const { addNotification } = useNotifications();
    const [claimed, setClaimed] = useState(false);

    const rewards = [
        { day: 1, val: "100 AXP", icon: Zap, status: "Claimed", color: "text-accent-cyan" },
        { day: 2, val: "200 AXP", icon: Zap, status: "Claimed", color: "text-accent-cyan" },
        { day: 3, val: "Daily Crate", icon: Box, status: "Current", color: "text-accent-green" },
        { day: 4, val: "500 AXP", icon: Zap, status: "Upcoming", color: "text-gray-500" },
        { day: 5, val: "XP Boost", icon: Star, status: "Upcoming", color: "text-gray-500" },
        { day: 6, val: "1,000 AXP", icon: Zap, status: "Upcoming", color: "text-gray-500" },
        { day: 7, val: "Elite Skin", icon: Award, status: "Upcoming", color: "text-axp-gold" },
    ];

    const handleClaim = () => {
        if (claimed) return;
        setClaimed(true);
        triggerHeavyHaptic();
        triggerAreniPulse();
        addNotification('Persistence Verified', 'Daily allocation Decrypted.', 'success');
    };

    return (
        <div className="space-y-12 pb-20 animate-slide-in font-display">
            {/* Header */}
            <div className="text-center space-y-4 max-w-xl mx-auto">
                <div className="flex items-center justify-center gap-3">
                    <div className="h-1px w-10 bg-accent-green/50" />
                    <span className="text-[10px] font-black italic text-accent-green uppercase tracking-[0.4em]">Node_Persistence_Link</span>
                    <div className="h-1px w-10 bg-accent-green/50" />
                </div>
                <h1 className="text-4xl md:text-6xl font-black italic text-white tracking-tighter uppercase leading-none">
                    DAILY <span className="text-accent-green">REWARD</span>
                </h1>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] leading-relaxed">
                    Synchronize your neural link for consecutive cycles to access high-tier strategic resources.
                </p>
            </div>

            {/* Reward Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {rewards.map((r) => (
                    <div
                        key={r.day}
                        className={cn(
                            "relative group p-6 rounded-[2rem] border transition-all duration-700 flex flex-col items-center text-center overflow-hidden",
                            r.status === 'Claimed' 
                                ? 'bg-white/[0.02] border-white/5 opacity-30 grayscale' 
                                : r.status === 'Current'
                                    ? 'bg-accent-green/5 border-accent-green/30 shadow-[0_0_40px_rgba(34,197,94,0.1)] scale-105 z-10'
                                    : 'bg-white/[0.02] border-white/5 opacity-50 hover:border-white/10'
                        )}
                    >
                        {r.status === 'Current' && (
                            <div className="absolute top-0 inset-x-0 h-1 bg-accent-green animate-pulse" />
                        )}

                        <div className="mb-6 relative">
                            {r.status === 'Upcoming' && <Lock className="absolute -top-2 -right-2 w-3 h-3 text-gray-700" />}
                            <r.icon className={cn("w-10 h-10 transition-transform group-hover:scale-110", r.color)} />
                        </div>
                        
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-white uppercase italic tracking-tighter">{r.val}</p>
                            <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">DAY_{r.day.toString().padStart(2, '0')}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Claim Portal */}
            <div
                ref={depthRef}
                className="relative group cursor-pointer"
                onClick={handleClaim}
            >
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-green/50 to-transparent rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition" />
                <div className="relative glass-panel p-12 md:p-16 border-white/5 bg-white/[0.02] overflow-hidden flex flex-col items-center">
                    {/* Watermark */}
                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] font-black text-9xl italic select-none pointer-events-none uppercase">
                        READY
                    </div>

                    <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-sm">
                        <div className="text-center space-y-2">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <Activity className="w-5 h-5 text-accent-green animate-pulse" />
                                <span className="text-[10px] font-black text-accent-green tracking-[0.4em] uppercase">Cycle_Sync_Detected</span>
                            </div>
                            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">DECRYPTION_READY</h2>
                        </div>

                        <button
                            disabled={claimed}
                            className={cn(
                                "w-full py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[11px] italic transition-all relative overflow-hidden group/btn",
                                claimed
                                    ? "bg-white/5 text-gray-600 cursor-not-allowed border border-white/5"
                                    : "bg-white text-background hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                            )}
                        >
                            <span className="relative z-10">{claimed ? 'SYNC_LOCKED' : 'INITIALIZE_ALLOCATION'}</span>
                            {!claimed && (
                                <div className="absolute inset-0 bg-accent-green/10 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-700" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Streak Tracker */}
            <div className="flex justify-center">
                <div className="glass-panel border-white/5 bg-white/[0.02] px-10 py-6 rounded-3xl flex items-center gap-10">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest leading-none mb-2 text-center">Neural_Streak_Persistence</span>
                        <span className="text-2xl font-black text-white italic tracking-[0.3em] uppercase">03_CYCLES</span>
                    </div>
                    <div className="h-10 w-1px bg-white/5" />
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest leading-none mb-2 text-center">NEXT_REWARD_TIER</span>
                        <span className="text-2xl font-black text-accent-cyan italic tracking-[0.3em] uppercase">500_AXP</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyLogin;
