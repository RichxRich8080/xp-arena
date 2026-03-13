import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Calendar, Zap, Box, Star, Award, ChevronRight, Activity, Lock, Gift, CheckCircle2 } from 'lucide-react';
import { cn } from '../utils/cn';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const DailyLogin = () => {
    const { triggerAreniPulse: triggerSystemPulse } = useAuth();
    const { addNotification } = useNotifications();
    const [claimed, setClaimed] = useState(false);

    const rewards = [
        { day: 1, val: "100 Points", icon: Zap, status: "Claimed", color: "text-slate-400" },
        { day: 2, val: "200 Points", icon: Zap, status: "Claimed", color: "text-slate-400" },
        { day: 3, val: "Resource Pack", icon: Box, status: "Current", color: "text-primary" },
        { day: 4, val: "500 Points", icon: Zap, status: "Upcoming", color: "text-slate-600" },
        { day: 5, val: "Points Boost", icon: Star, status: "Upcoming", color: "text-slate-600" },
        { day: 6, val: "1,000 Points", icon: Zap, status: "Upcoming", color: "text-slate-600" },
        { day: 7, val: "Exclusive Upgrade", icon: Award, status: "Upcoming", color: "text-amber-500" },
    ];

    const handleClaim = () => {
        if (claimed) return;
        setClaimed(true);
        triggerSystemPulse();
        addNotification('Reward Claimed', 'Your daily reward has been added to your account.', 'success');
    };

    return (
        <div className="space-y-8 pb-12 animate-fade-in font-sans">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-white/5 shadow-sm">
                <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none select-none">
                    <Gift className="w-64 h-64" />
                </div>
                
                <div className="relative p-8 md:p-12 text-center space-y-6 max-w-2xl mx-auto">
                    <div className="flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit mx-auto">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Active Streak</span>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-none uppercase">
                            Daily <span className="text-primary">Rewards</span>
                        </h1>
                        <p className="text-slate-400 text-sm md:text-base leading-relaxed font-medium">
                            Log in every day to collect exclusive rewards, performance boosts, and rare resource packs.
                        </p>
                    </div>
                </div>
            </div>

            {/* Reward Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {rewards.map((r) => (
                    <Card
                        key={r.day}
                        className={cn(
                            "relative group p-6 border transition-all duration-300 flex flex-col items-center text-center rounded-2xl",
                            r.status === 'Claimed' 
                                ? 'bg-slate-900/40 border-white/5 opacity-40' 
                                : r.status === 'Current'
                                    ? 'bg-primary/5 border-primary shadow-lg ring-1 ring-primary/20'
                                    : 'bg-slate-900/50 border-white/5 hover:border-white/10'
                        )}
                    >
                        {r.status === 'Current' && (
                            <div className="absolute top-0 inset-x-0 h-1 bg-primary rounded-t-2xl shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                        )}

                        <div className="mb-4 relative">
                            {r.status === 'Upcoming' && <Lock className="absolute -top-1 -right-1 w-3 h-3 text-slate-600" />}
                            <r.icon className={cn("w-8 h-8 transition-transform group-hover:scale-110", r.color)} />
                        </div>
                        
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-white uppercase tracking-tight">{r.val}</p>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Day {r.day}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Claim Section */}
            <div className="max-w-xl mx-auto">
                <Card 
                    className={cn(
                        "relative p-8 md:p-12 border-white/5 bg-slate-900/50 backdrop-blur-sm flex flex-col items-center rounded-3xl overflow-hidden",
                        !claimed && "hover:border-primary/30 transition-colors"
                    )}
                >
                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none select-none">
                        <CheckCircle2 className="w-48 h-48" />
                    </div>

                    <div className="relative z-10 flex flex-col items-center gap-8 w-full">
                        <div className="text-center space-y-2">
                             <div className="flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-white/5 w-fit mx-auto">
                                <Activity className="w-3.5 h-3.5 text-primary" />
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Ready to Collect</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight">Today's Selection</h2>
                        </div>

                        <Button
                            disabled={claimed}
                            onClick={handleClaim}
                            className={cn(
                                "w-full py-6 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all",
                                claimed
                                    ? "bg-slate-800 text-slate-500 border-white/5 cursor-not-allowed"
                                    : "bg-primary text-slate-950 font-bold shadow-lg"
                            )}
                        >
                            {claimed ? 'Already Collected' : 'Claim Daily Reward'}
                            {!claimed && <ChevronRight className="w-4 h-4" />}
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Stats */}
            <div className="flex justify-center flex-col sm:flex-row items-center gap-4">
                <div className="bg-slate-900 border border-white/5 px-8 py-5 rounded-2xl flex items-center gap-8 shadow-sm">
                    <div className="flex flex-col items-center">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Current Streak</span>
                        <span className="text-xl font-bold text-white tracking-tight uppercase">03 Days</span>
                    </div>
                    <div className="h-8 w-px bg-white/5" />
                    <div className="flex flex-col items-center">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Next Milestone</span>
                        <span className="text-xl font-bold text-primary tracking-tight uppercase">500 Points</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyLogin;
