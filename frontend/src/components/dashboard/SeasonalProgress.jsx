import React from 'react';
import { Card } from '../ui/Card';
import { Trophy, Star, ShieldCheck, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export function SeasonalProgress({ currentAXP = 0, level = 1 }) {
    const seasonName = "Quarterly Progression";
    const daysLeft = 14;
    const progress = (currentAXP % 1000) / 10; 
    
    const rewards = [
        { lv: 5, label: "PROFILE BADGE", unlocked: level >= 5 },
        { lv: 10, label: "ADVANCED TIER", unlocked: level >= 10 },
        { lv: 15, label: "PRO ACCESS", unlocked: level >= 15 },
        { lv: 20, label: "ELITE STATUS", unlocked: level >= 20 },
    ];

    return (
        <Card className="flex flex-col gap-6 lg:col-span-2 group border-primary/10 bg-primary/5">
            <div className="flex justify-between items-start">
                <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform">
                        <Trophy className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h4 className="font-bold text-white uppercase tracking-widest text-sm leading-none mb-1">{seasonName}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{daysLeft} Days Remaining</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-xl font-bold text-white tracking-tight">Level {level}</span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <span>Next Reward: {rewards.find(r => !r.unlocked)?.label || "MAXED"}</span>
                    <span className="text-primary">{Math.round(progress)}%</span>
                </div>
                <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div 
                        className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-1000 relative"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/5">
                {rewards.map((r) => (
                    <div key={r.lv} className="flex flex-col items-center gap-2 group/reward">
                        <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-500",
                            r.unlocked 
                                ? "bg-primary/20 border-primary/40 text-primary" 
                                : "bg-slate-800 border-white/5 text-slate-600"
                        )}>
                            {r.unlocked ? <ShieldCheck className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                        </div>
                        <span className={cn(
                            "text-[8px] font-bold uppercase tracking-widest",
                            r.unlocked ? "text-primary" : "text-slate-600"
                        )}>LV.{r.lv}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
}
