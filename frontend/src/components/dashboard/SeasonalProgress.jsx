import React from 'react';
import { Card } from '../ui/Card';
import { Trophy, Star, ShieldCheck, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export function SeasonalProgress({ currentAXP = 0, level = 1 }) {
    const seasonName = "PROTOCOL_GENESIS";
    const daysLeft = 14;
    const progress = (currentAXP % 1000) / 10; // Simplified for demo
    
    const rewards = [
        { lv: 5, label: "NEON_AVATAR", unlocked: level >= 5 },
        { lv: 10, label: "ELITE_BADGE", unlocked: level >= 10 },
        { lv: 15, label: "ARENA_SKIN", unlocked: level >= 15 },
        { lv: 20, label: "DALL-E_FORGE", unlocked: level >= 20 },
    ];

    return (
        <Card className="flex flex-col gap-6 lg:col-span-2 group border-accent-cyan/10 bg-accent-cyan/[0.02]">
            <div className="flex justify-between items-start">
                <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-2xl bg-accent-cyan/10 flex items-center justify-center border border-accent-cyan/20 group-hover:scale-110 transition-transform">
                        <Trophy className="w-6 h-6 text-accent-cyan" />
                    </div>
                    <div>
                        <h4 className="font-display font-black text-white uppercase tracking-widest text-sm leading-none mb-1">{seasonName}</h4>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">{daysLeft} DAYS REMAINING</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-display font-black text-white italic tracking-tighter">LVL {level}</span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-display font-bold text-gray-400 uppercase tracking-widest">
                    <span>NEXT_REWARD: {rewards.find(r => !r.unlocked)?.label || "MAXED"}</span>
                    <span className="text-accent-cyan">{Math.round(progress)}%</span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div 
                        className="h-full bg-gradient-to-r from-accent-cyan via-accent-violet to-accent-cyan rounded-full transition-all duration-1000 relative"
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
                                ? "bg-accent-cyan/20 border-accent-cyan/40 text-accent-cyan" 
                                : "bg-white/5 border-white/5 text-gray-700"
                        )}>
                            {r.unlocked ? <ShieldCheck className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                        </div>
                        <span className={cn(
                            "text-[8px] font-black uppercase tracking-tighter",
                            r.unlocked ? "text-accent-cyan" : "text-gray-700"
                        )}>LV.{r.lv}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
}
