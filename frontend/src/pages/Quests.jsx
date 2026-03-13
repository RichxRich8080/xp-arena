import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Target, Zap, Shield, Trophy, Activity, ChevronRight, Lock, CheckCircle2, Star, Globe, TrendingUp, LayoutGrid } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

const QuestCard = ({ quest, onClaim }) => {
    const isCompleted = quest.status === 'Completed';
    
    return (
        <Card 
            onClick={() => onClaim(quest)}
            className={cn(
                "group relative overflow-hidden p-8 border-white/5 transition-all duration-300 cursor-pointer bg-slate-900 shadow-lg rounded-[2rem]",
                isCompleted ? "border-green-500/20 bg-green-500/[0.02]" : "hover:border-primary/20 hover:bg-slate-800"
            )}
        >
            {/* Tier Badge */}
            <div className={cn(
                "absolute top-0 right-0 px-6 py-2 rounded-bl-2xl text-[8px] font-bold tracking-widest uppercase transition-all",
                isCompleted ? "bg-green-500 text-slate-950" : "bg-white/5 text-slate-500 group-hover:bg-primary group-hover:text-slate-950"
            )}>
                {isCompleted ? 'Completed' : quest.tier === 'ELITE' ? 'Advanced' : quest.tier === 'DAILY' ? 'Standard' : quest.tier === 'SOCIAL' ? 'Engagement' : quest.tier}
            </div>

            <div className="flex items-start gap-6 mb-8 relative z-10">
                <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 border",
                    isCompleted ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-slate-800 border-white/5 text-slate-500 group-hover:text-primary group-hover:border-primary/20"
                )}>
                    {isCompleted ? <CheckCircle2 className="w-7 h-7" /> : <Target className="w-7 h-7" />}
                </div>
                <div className="flex-1 space-y-1.5">
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">{quest.title}</h3>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide leading-relaxed max-w-[90%]">{quest.desc}</p>
                </div>
            </div>

            {/* Progress Display */}
            <div className="space-y-3 relative z-10">
                <div className="flex justify-between items-end px-1">
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Progress</span>
                    <span className={cn("text-[11px] font-bold tabular-nums", isCompleted ? "text-green-500" : "text-white")}>
                        {Math.floor(quest.progress * 100)}%
                    </span>
                </div>
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div 
                        className={cn(
                            "h-full transition-all duration-1000 ease-out",
                            isCompleted ? "bg-green-500" : "bg-primary"
                        )}
                        style={{ width: `${quest.progress * 100}%` }}
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6 relative z-10">
                <div className="flex items-center gap-2">
                    <Trophy className="w-3.5 h-3.5 text-amber-500 opacity-50" />
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Reward</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-950/50 px-3 py-1.5 rounded-full border border-white/5">
                    <span className="text-xs font-bold text-white tabular-nums">{quest.reward.replace('XP', 'Points')}</span>
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                </div>
            </div>

            {/* Watermark */}
            <div className="absolute bottom-0 right-0 p-4 opacity-[0.02] font-bold text-4xl select-none pointer-events-none uppercase">
                {quest.tier}
            </div>
        </Card>
    );
};

const Quests = () => {
    const { addNotification } = useNotifications();

    const [quests] = useState([
        { id: 1, title: "Device Calibration", desc: "Sync 5 different device configurations in the lab.", reward: "500 Points", status: "Active", progress: 0.8, tier: "ELITE" },
        { id: 2, title: "Top Performance", desc: "Achieve top 3 placement in 5 consecutive matches.", reward: "200 Points", status: "Active", progress: 0.6, tier: "DAILY" },
        { id: 3, title: "Sniper Accuracy", desc: "Successfully verify AWM settings with 10 precision hits.", reward: "500 Points", status: "Active", progress: 0.33, tier: "ELITE" },
        { id: 4, title: "Community Help", desc: "Share your professional setups with 3 team members.", reward: "300 Points", status: "Completed", progress: 1.0, tier: "SOCIAL" },
    ]);

    const handleClaim = (quest) => {
        if (quest.status === 'Completed') {
            addNotification('Reward Claimed', `${quest.title} rewards added to account.`, 'success');
        } else {
            addNotification('Quest Active', `Complete the objectives for ${quest.title}.`, 'info');
        }
    };

    return (
        <div className="space-y-12 pb-20 animate-fade-in font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-900 border border-white/5 p-8 md:p-10 rounded-[2.5rem] shadow-xl">
                <div className="space-y-2 text-center md:text-left">
                    <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Performance Challenges</h2>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight uppercase leading-none">
                        Mission <span className="text-primary">Center</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4 py-3 px-6 bg-slate-950/50 border border-white/5 rounded-2xl">
                    <div className="text-right">
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Season Phase</span>
                        <span className="text-sm font-bold text-white tracking-wider uppercase">Season 01 Genesis</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <LayoutGrid className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Quest Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {quests.map((q) => (
                    <QuestCard key={q.id} quest={q} onClaim={handleClaim} />
                ))}
            </div>

            {/* Analytics Summary */}
            <div className="bg-slate-900 border border-white/5 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 rounded-[2.5rem] shadow-xl">
                <div className="flex flex-wrap md:flex-nowrap gap-8 md:gap-14 items-center justify-center md:justify-start">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-2 leading-none">Total Points Earned</span>
                        <span className="text-2xl md:text-3xl font-bold text-white tracking-tight uppercase">42,500 <span className="text-slate-500 text-xs">Points</span></span>
                    </div>
                    <div className="h-10 w-px bg-white/10 hidden md:block" />
                    <div className="flex flex-col">
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-2 leading-none">Completion Rate</span>
                        <span className="text-2xl md:text-3xl font-bold text-primary tracking-tight uppercase">14.2%</span>
                    </div>
                </div>
                
                <Button variant="ghost" className="w-full md:w-auto px-10 border border-white/5 bg-slate-950/50 hover:bg-slate-800 rounded-xl h-12 text-[10px] font-bold tracking-widest uppercase">
                    Sync All Rewards
                </Button>
            </div>
        </div>
    );
};

export default Quests;
