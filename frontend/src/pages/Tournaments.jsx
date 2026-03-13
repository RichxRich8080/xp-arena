import React, { useState, useEffect } from 'react';
import { Trophy, Swords, Tv, Users, Activity, Crown, Zap, ChevronRight, Play, Radio, Shield, Timer, Medal } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

const MatchCard = ({ p1, p2, time, status = "UPCOMING", score1 = "0", score2 = "0" }) => (
    <Card className={cn(
        "relative overflow-hidden border-white/5 bg-slate-900/50 hover:bg-slate-900 transition-all duration-300 group",
        status === "LIVE" ? "border-primary/30 shadow-lg" : "hover:border-white/10"
    )}>
        <div className={cn(
            "absolute top-0 right-0 px-4 py-1 text-[8px] font-bold uppercase tracking-widest",
            status === "LIVE" ? "bg-primary text-slate-950 animate-pulse" : "bg-slate-800 text-slate-500"
        )}>
            {status}
        </div>

        <div className="p-6 space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/5 flex items-center justify-center text-lg shadow-inner group-hover:scale-110 transition-transform">👤</div>
                    <div className="space-y-0.5">
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Player</span>
                        <span className="text-sm font-bold text-white uppercase tracking-tight">{p1}</span>
                    </div>
                </div>
                <span className="text-xl font-bold text-white tracking-tighter tabular-nums">{score1}</span>
            </div>

            <div className="relative h-px bg-white/5 flex items-center justify-center">
                <div className="bg-slate-900 px-3 text-[9px] font-bold text-slate-700 tracking-widest uppercase italic">VS</div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/5 flex items-center justify-center text-lg shadow-inner group-hover:scale-110 transition-transform">👤</div>
                    <div className="space-y-0.5">
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Player</span>
                        <span className="text-sm font-bold text-white uppercase tracking-tight">{p2}</span>
                    </div>
                </div>
                <span className="text-xl font-bold text-white tracking-tighter tabular-nums">{score2}</span>
            </div>
        </div>

        <div className="px-6 py-4 flex items-center justify-between border-t border-white/5 bg-slate-950/50 transition-colors cursor-pointer hover:bg-slate-950">
            <div className="flex items-center gap-3">
                <div className={cn("w-1.5 h-1.5 rounded-full", status === "LIVE" ? "bg-primary animate-ping" : "bg-slate-700")} />
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{time}</span>
            </div>
            <div className="flex items-center gap-2 group-hover:gap-3 transition-all">
                <span className="text-[9px] font-bold text-white uppercase tracking-widest group-hover:text-primary">Watch Match</span>
                <ChevronRight className="w-3.5 h-3.5 text-primary" />
            </div>
        </div>
    </Card>
);

const Tournaments = () => {
    const [competitionMode, setCompetitionMode] = useState(false);
    const [timeLeft, setTimeLeft] = useState(180);

    useEffect(() => {
        if (!competitionMode) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
        return () => clearInterval(timer);
    }, [competitionMode]);

    const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    return (
        <div className="space-y-12 pb-20 animate-fade-in font-sans">
            {/* Header / Active Banner */}
            <div className={cn(
                "relative overflow-hidden rounded-[2.5rem] p-8 md:p-16 border border-white/5 transition-all duration-700",
                competitionMode 
                    ? "bg-primary/10 border-primary/20 shadow-xl" 
                    : "bg-slate-900 shadow-xl"
            )}>
                <div className={cn(
                    "absolute -top-32 -right-32 w-80 h-80 blur-[100px] rounded-full transition-all duration-1000",
                    competitionMode ? "bg-primary/20 scale-150" : "bg-primary/5"
                )} />

                <div className="relative z-10 space-y-10">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-white/5 w-fit">
                                <Radio className={cn("w-3.5 h-3.5", competitionMode ? "text-primary animate-pulse" : "text-slate-500")} />
                                <span className={cn("text-[10px] font-bold uppercase tracking-widest", competitionMode ? "text-primary" : "text-slate-500")}>Tournament Network</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight uppercase leading-tight">Professional <span className="text-primary">Series</span></h2>
                            <p className="text-slate-400 text-sm font-medium max-w-lg leading-relaxed">
                                Participate in high-fidelity competitive leagues. Performance-driven matches moderated by official administrators.
                            </p>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2 p-4 rounded-xl bg-slate-800 border border-white/5">
                            <div className="flex items-center gap-2">
                                <Tv className="w-3.5 h-3.5 text-red-500" />
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Active Spectators</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">14.2K Viewing</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-white/5">
                        <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                <Crown className="w-6 h-6 text-amber-500" />
                             </div>
                             <div className="space-y-0.5">
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Aggregate Prize Pool</span>
                                <div className="text-xl font-bold text-white tracking-tight uppercase">50,000 <span className="text-xs text-amber-500 font-bold uppercase tracking-widest">Points</span></div>
                             </div>
                        </div>

                        <div className="h-10 w-px bg-white/5 hidden lg:block" />

                        <div className="flex-1 flex justify-end">
                             <Button
                                onClick={() => setCompetitionMode(!competitionMode)}
                                className={cn(
                                    "px-10 py-6 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                                    competitionMode
                                        ? "bg-slate-800 hover:bg-slate-700 text-white border-white/5 shadow-sm"
                                        : "bg-primary text-slate-950 hover:scale-105 shadow-lg"
                                )}
                            >
                                <span className="flex items-center gap-2">
                                    {competitionMode ? 'Leave Session' : 'Register Now'}
                                    <Swords className="w-4 h-4" />
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Competition Sequence HUD Overlay */}
            {competitionMode && (
                <div className="bg-slate-900 border border-primary/20 p-8 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden animate-fade-in">
                    <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary text-2xl font-bold">!</div>
                        <div className="space-y-1">
                            <div className="text-[10px] font-bold text-primary uppercase tracking-widest">Match Synchronized - Initializing Pipeline</div>
                            <div className="text-xl font-bold text-white uppercase tracking-tight">Connecting to Simulation Server...</div>
                        </div>
                    </div>
                    <div className="text-5xl font-bold text-primary tabular-nums relative z-10">{formatTime(timeLeft)}</div>
                </div>
            )}

            {/* Bracket Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                             <Activity className="w-4 h-4 text-slate-500" />
                             <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Quarter-Finals</h3>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-bold text-primary uppercase tracking-widest animate-pulse">2 Active Matches</div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <MatchCard p1="God_Sniper" p2="Neural_Link" time="In Progress" status="LIVE" score1="3.2" score2="1.0" />
                        <MatchCard p1="Ghost_Operator" p2="Silent_Axis" time="Starts in 12m" status="UPCOMING" />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                         <Activity className="w-4 h-4 text-slate-500" />
                         <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Semi-Finals</h3>
                    </div>
                    <Card className="h-full border-2 border-dashed border-white/5 bg-slate-900/20 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center opacity-40 hover:opacity-100 transition-opacity min-h-[400px]">
                        <div className="w-20 h-20 rounded-full bg-slate-800 border border-white/5 mb-6 flex items-center justify-center text-4xl">⚔️</div>
                        <div className="space-y-2">
                           <h4 className="text-xl font-bold text-white tracking-tight uppercase">Open Bracket</h4>
                           <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest max-w-[200px] leading-relaxed">Awaiting completion of early rounds...</p>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Rules */}
            <Card className="p-8 border-white/5 bg-slate-900/50">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Shield className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Competition Rules</span>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {[
                                "Best of 5 Round System",
                                "Standard Sensitivity Protocol",
                                "Verified Account Required",
                                "Anti-Cheat Enforcement"
                            ].map((rule, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-white/5">
                                    <div className="w-1 h-1 rounded-full bg-primary" />
                                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{rule}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-6 opacity-30">
                         {[Users, Trophy, Zap].map((Icon, i) => (
                            <Icon key={i} className="w-5 h-5 text-white" />
                         ))}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Tournaments;
