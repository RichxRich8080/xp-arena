import React, { useState } from 'react';
import { useNeuralHaptics } from '../hooks/useNeuralHaptics';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Target, Zap, Shield, Trophy, Activity, ChevronRight, Lock, CheckCircle2, Star, Globe } from 'lucide-react';
import { cn } from '../utils/cn';

const QuestCard = ({ quest, onClaim }) => {
    const isCompleted = quest.status === 'Completed';
    
    return (
        <div 
            onClick={() => onClaim(quest)}
            className={cn(
                "group relative overflow-hidden glass-panel p-8 border-white/5 transition-all duration-500 cursor-pointer",
                isCompleted ? "bg-accent-green/[0.03] border-accent-green/20" : "bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10"
            )}
        >
            {/* Tier Badge */}
            <div className={cn(
                "absolute top-0 right-0 px-8 py-2 rounded-bl-3xl text-[8px] font-black tracking-[0.3em] font-display uppercase italic transition-all",
                isCompleted ? "bg-accent-green text-background" : "bg-white/5 text-gray-500 group-hover:bg-white/10 group-hover:text-white"
            )}>
                {isCompleted ? 'VERIFIED' : quest.tier}
            </div>

            <div className="flex items-start gap-8 mb-8 relative z-10">
                <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 border backdrop-blur-xl",
                    isCompleted ? "bg-accent-green/10 border-accent-green/20 text-accent-green" : "bg-white/5 border-white/5 text-gray-500 group-hover:text-white group-hover:border-white/20"
                )}>
                    {isCompleted ? <CheckCircle2 className="w-8 h-8" /> : <Target className="w-8 h-8" />}
                </div>
                <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter font-display">{quest.title}</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed max-w-[85%]">{quest.desc}</p>
                </div>
            </div>

            {/* Progress Display */}
            <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-end px-1">
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">OBJECTIVE_PROGRESS</span>
                    <span className={cn("text-[11px] font-black italic tracking-widest", isCompleted ? "text-accent-green" : "text-white")}>
                        {Math.floor(quest.progress * 100)}%
                    </span>
                </div>
                <div className="h-1.5 w-full bg-white/[0.02] rounded-full overflow-hidden">
                    <div 
                        className={cn(
                            "h-full transition-all duration-1000 ease-out",
                            isCompleted ? "bg-accent-green" : "bg-accent-cyan"
                        )}
                        style={{ width: `${quest.progress * 100}%` }}
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6 relative z-10">
                <div className="flex items-center gap-3">
                    <Trophy className="w-4 h-4 text-axp-gold opacity-50" />
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">MISSION_REWARD</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-black italic text-white tracking-widest uppercase">{quest.reward}</span>
                    <Zap className="w-3.5 h-3.5 text-axp-gold" />
                </div>
            </div>

            {/* Background Narrative */}
            <div className="absolute bottom-0 right-0 p-4 opacity-[0.02] font-black text-4xl italic select-none pointer-events-none uppercase">
                {quest.tier}
            </div>
        </div>
    );
};

const Quests = () => {
    const { triggerLightHaptic, triggerHeavyHaptic } = useNeuralHaptics();
    const { triggerAreniPulse } = useAuth();
    const { addNotification } = useNotifications();

    const [quests] = useState([
        { id: 1, title: "Neural Linkup", desc: "Sync 5 different device signatures in the forge.", reward: "500 AXP", status: "Active", progress: 0.8, tier: "ELITE" },
        { id: 2, title: "Combat Entry", desc: "Achieve top 3 placement in 5 consecutive simulations.", reward: "200 AXP", status: "Active", progress: 0.6, tier: "DAILY" },
        { id: 3, title: "Long Range Sync", desc: "Verify AWM coefficients with 10 extreme range hits.", reward: "500 AXP", status: "Active", progress: 0.33, tier: "ELITE" },
        { id: 4, title: "Squad Liaison", desc: "Allocate tactical presets to 3 squad members.", reward: "300 AXP", status: "Completed", progress: 1.0, tier: "SOCIAL" },
    ]);

    const handleClaim = (quest) => {
        if (quest.status === 'Completed') {
            triggerHeavyHaptic();
            triggerAreniPulse();
            addNotification('Objective Verified', `${quest.title} rewards secured.`, 'success');
        } else {
            triggerLightHaptic();
            addNotification('Link Pending', `Objective ${quest.title} remains active.`, 'info');
        }
    };

    return (
        <div className="space-y-12 pb-20 animate-slide-in font-display">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                        <Activity className="w-5 h-5 text-accent-cyan" />
                        <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Neural_Mission_Hub</h2>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none text-center md:text-left">
                        MISSION <span className="text-accent-cyan">HUB</span>
                    </h1>
                </div>
                <div className="flex items-center gap-6 p-4 glass-panel border-white/5 bg-white/[0.02]">
                    <div className="text-right">
                        <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest block">CURRENT_PHASE</span>
                        <span className="text-sm font-black text-white italic tracking-widest uppercase">SEASON_01_GENESIS</span>
                    </div>
                    <Globe className="w-6 h-6 text-accent-cyan animate-spin-slow" />
                </div>
            </div>

            {/* Quest Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {quests.map((q) => (
                    <QuestCard key={q.id} quest={q} onClaim={handleClaim} />
                ))}
            </div>

            {/* Analytics Summary */}
            <div className="glass-panel border-white/5 bg-white/[0.02] p-10 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex gap-10 items-center">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-gray-600 uppercase tracking-[0.3em] mb-2 leading-none">TOTAL_ALLOCATED_AXP</span>
                        <span className="text-3xl font-black text-white italic tracking-tighter font-mono uppercase">42,500 <span className="text-gray-600 text-xs tracking-widest">AXP</span></span>
                    </div>
                    <div className="h-12 w-1px bg-white/5 hidden md:block" />
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-gray-600 uppercase tracking-[0.3em] mb-2 leading-none">OBJECTIVE_YIELD_RATE</span>
                        <span className="text-3xl font-black text-accent-cyan italic tracking-tighter font-mono uppercase">14.2%</span>
                    </div>
                </div>
                
                <Button variant="ghost" className="w-full md:w-auto px-10 border-white/10 hover:bg-white/5 uppercase italic font-black text-[10px] tracking-widest py-6">
                    SYNCHRONIZE_ALL_REWARDS
                </Button>
            </div>
        </div>
    );
};

export default Quests;
