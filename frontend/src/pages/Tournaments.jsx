import React, { useState, useEffect } from 'react';
import { Trophy, Swords, Tv, Users, Activity, Crown, Zap, ChevronRight, Play, Radio, Shield, Timer, Medal, Star, Target, Gift, Calendar, Clock, Flame } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { cn } from '../utils/cn';

const MatchCard = ({ p1, p2, time, status = "UPCOMING", score1 = "0", score2 = "0", prize = "500" }) => (
    <div className={cn(
        "card-gaming relative overflow-hidden group",
        status === "LIVE" && "border-primary/30 shadow-glow-sm"
    )}>
        {/* Status Badge */}
        <div className={cn(
            "absolute top-0 right-0 px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-bl-xl",
            status === "LIVE" ? "bg-gradient-to-r from-primary to-accent-cyan text-background" : 
            status === "FINISHED" ? "bg-emerald-500/20 text-emerald-400" : "bg-surface-elevated text-slate-500"
        )}>
            {status === "LIVE" && <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse mr-1.5" />}
            {status}
        </div>

        <div className="p-6 space-y-6">
            {/* Player 1 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Avatar size="md" className="ring-2 ring-white/10 group-hover:ring-primary/50 transition-all" />
                    <div className="space-y-0.5">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Player 1</span>
                        <span className="text-sm font-bold text-white tracking-tight">{p1}</span>
                    </div>
                </div>
                <span className={cn(
                    "text-2xl font-display font-black tabular-nums",
                    parseFloat(score1) > parseFloat(score2) ? "text-emerald-400" : "text-white"
                )}>
                    {score1}
                </span>
            </div>

            {/* VS Divider */}
            <div className="relative h-px bg-gradient-to-r from-transparent via-white/10 to-transparent flex items-center justify-center">
                <div className="absolute bg-surface-elevated px-4 text-[10px] font-display font-bold text-slate-600 tracking-widest">VS</div>
            </div>

            {/* Player 2 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Avatar size="md" className="ring-2 ring-white/10 group-hover:ring-primary/50 transition-all" />
                    <div className="space-y-0.5">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Player 2</span>
                        <span className="text-sm font-bold text-white tracking-tight">{p2}</span>
                    </div>
                </div>
                <span className={cn(
                    "text-2xl font-display font-black tabular-nums",
                    parseFloat(score2) > parseFloat(score1) ? "text-emerald-400" : "text-white"
                )}>
                    {score2}
                </span>
            </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-white/[0.06] bg-surface-low/30">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Clock className={cn("w-3.5 h-3.5", status === "LIVE" ? "text-primary animate-pulse" : "text-slate-600")} />
                    <span className="text-[10px] font-semibold text-slate-400">{time}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-500/10">
                    <Zap className="w-3 h-3 text-amber-500" />
                    <span className="text-[10px] font-bold text-amber-400">{prize} XP</span>
                </div>
            </div>
            <button className="flex items-center gap-1.5 text-primary hover:gap-2.5 transition-all">
                <span className="text-[10px] font-bold uppercase tracking-wider">{status === "LIVE" ? "Watch Live" : "Details"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
            </button>
        </div>
    </div>
);

const TournamentCard = ({ name, prize, participants, startDate, status }) => (
    <div className="card-gaming overflow-hidden group cursor-pointer">
        {/* Header Image */}
        <div className="relative h-32 bg-gradient-to-br from-primary/20 to-accent-cyan/10 overflow-hidden">
            <div className="absolute inset-0 bg-mesh-pattern opacity-30" />
            <div className="absolute top-3 left-3">
                <span className={cn(
                    "px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider",
                    status === "LIVE" ? "bg-rose-500 text-white animate-pulse" :
                    status === "UPCOMING" ? "bg-primary text-background" :
                    "bg-surface-elevated text-slate-400"
                )}>
                    {status}
                </span>
            </div>
            <Trophy className="absolute bottom-2 right-2 w-16 h-16 text-white/5" />
        </div>
        
        <div className="p-5 space-y-4">
            <div>
                <h3 className="font-display font-bold text-white text-lg group-hover:text-primary transition-colors">{name}</h3>
                <p className="text-xs text-slate-500 mt-1">{startDate}</p>
            </div>
            
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-400">{participants}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <Crown className="w-4 h-4 text-amber-500" />
                    <span className="font-display font-bold text-amber-400">{prize}</span>
                </div>
            </div>
        </div>
    </div>
);

const Tournaments = () => {
    const [competitionMode, setCompetitionMode] = useState(false);
    const [timeLeft, setTimeLeft] = useState(180);
    const [activeTab, setActiveTab] = useState('live');

    useEffect(() => {
        if (!competitionMode) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
        return () => clearInterval(timer);
    }, [competitionMode]);

    const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    const upcomingTournaments = [
        { name: "Weekly Championship", prize: "10,000 XP", participants: "128/256", startDate: "Starts in 2 days", status: "UPCOMING" },
        { name: "Guild Wars Season 5", prize: "50,000 XP", participants: "24/32 Guilds", startDate: "March 20, 2026", status: "UPCOMING" },
        { name: "Pro Series Qualifiers", prize: "25,000 XP", participants: "64/64", startDate: "Registration Closed", status: "FULL" },
    ];

    return (
        <div className="space-y-10 pb-20 animate-fade-in">
            {/* Hero Section */}
            <div className={cn(
                "card-gaming relative overflow-hidden p-8 md:p-12 transition-all duration-700",
                competitionMode && "border-primary/30 shadow-glow-md"
            )}>
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className={cn(
                        "absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[120px] transition-all duration-1000",
                        competitionMode ? "bg-primary/30 scale-150" : "bg-primary/10"
                    )} />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-cyan/5 rounded-full blur-[80px]" />
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                </div>

                <div className="relative z-10 space-y-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                        <div className="space-y-6 max-w-xl">
                            {/* Status Badge */}
                            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20">
                                <Radio className={cn("w-3.5 h-3.5 text-rose-500", competitionMode && "animate-pulse")} />
                                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                                    {competitionMode ? "Match in Progress" : "3 Live Matches"}
                                </span>
                            </div>
                            
                            <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tight leading-none">
                                Tournament
                                <span className="block text-gradient mt-2">Arena</span>
                            </h1>
                            
                            <p className="text-slate-400 text-base leading-relaxed">
                                Compete in high-stakes tournaments against the world's best players. 
                                Win XP, exclusive rewards, and climb the global rankings.
                            </p>
                            
                            <div className="flex flex-wrap gap-4">
                                <Button
                                    onClick={() => setCompetitionMode(!competitionMode)}
                                    className={cn(
                                        "px-8 py-4 text-sm font-bold transition-all",
                                        competitionMode ? "btn-secondary" : "btn-gaming"
                                    )}
                                >
                                    <Swords className="w-5 h-5 mr-2" />
                                    {competitionMode ? 'Leave Queue' : 'Quick Match'}
                                </Button>
                                <Button variant="secondary" className="px-8 py-4">
                                    <Calendar className="w-5 h-5 mr-2" />
                                    Browse Tournaments
                                </Button>
                            </div>
                        </div>
                        
                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 gap-4 w-full lg:w-auto lg:min-w-[280px]">
                            <div className="stat-card !p-5 text-center">
                                <Tv className="w-6 h-6 text-rose-500 mx-auto mb-2" />
                                <p className="text-2xl font-display font-bold text-white">14.2K</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Watching</p>
                            </div>
                            <div className="stat-card !p-5 text-center">
                                <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                                <p className="text-2xl font-display font-bold text-white">2,847</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider">In Queue</p>
                            </div>
                            <div className="stat-card !p-5 col-span-2 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Prize Pool</p>
                                    <p className="text-xl font-display font-bold text-gradient-gold">50,000 XP</p>
                                </div>
                                <Crown className="w-8 h-8 text-amber-500/30" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Competition Mode HUD */}
            {competitionMode && (
                <div className="card-gaming border-primary/30 p-6 md:p-8 relative overflow-hidden animate-scale-in">
                    <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-primary/10 border border-primary/30 rounded-2xl flex items-center justify-center animate-glow-pulse">
                                <Target className="w-8 h-8 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-primary uppercase tracking-widest">Finding Opponent</p>
                                <p className="text-xl font-display font-bold text-white">Matching you with players of similar skill...</p>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-5xl font-display font-black text-primary tabular-nums">{formatTime(timeLeft)}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Est. Wait Time</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-surface-elevated/60 border border-white/[0.06] rounded-2xl w-fit">
                {['live', 'upcoming', 'completed'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-sm font-semibold transition-all capitalize",
                            activeTab === tab 
                                ? "bg-primary text-background" 
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        {tab === 'live' && <span className="inline-block w-2 h-2 rounded-full bg-rose-500 mr-2 animate-pulse" />}
                        {tab}
                    </button>
                ))}
            </div>

            {/* Live Matches */}
            {activeTab === 'live' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="font-display font-bold text-white text-xl flex items-center gap-3">
                            <Activity className="w-5 h-5 text-primary" />
                            Live Matches
                        </h2>
                        <span className="text-xs text-slate-500">Updated 30s ago</span>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <MatchCard p1="God_Sniper" p2="Neural_Link" time="Round 3 - 2:45" status="LIVE" score1="3" score2="1" prize="1,000" />
                        <MatchCard p1="PhantomX" p2="BladeRunner" time="Round 2 - 4:12" status="LIVE" score1="1" score2="2" prize="1,000" />
                        <MatchCard p1="Ghost_Operator" p2="Silent_Axis" time="Starts in 12m" status="UPCOMING" prize="500" />
                        <MatchCard p1="VortexKing" p2="ShadowHunter" time="Starts in 28m" status="UPCOMING" prize="500" />
                    </div>
                </div>
            )}

            {/* Upcoming Tournaments */}
            {activeTab === 'upcoming' && (
                <div className="space-y-6">
                    <h2 className="font-display font-bold text-white text-xl flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-primary" />
                        Upcoming Tournaments
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcomingTournaments.map((tournament, i) => (
                            <TournamentCard key={i} {...tournament} />
                        ))}
                    </div>
                </div>
            )}

            {/* Completed */}
            {activeTab === 'completed' && (
                <div className="card-gaming p-12 text-center">
                    <Trophy className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="font-display font-bold text-white text-xl mb-2">No Recent Completions</h3>
                    <p className="text-slate-500 text-sm">Check back after live matches finish</p>
                </div>
            )}

            {/* Rules Section */}
            <div className="card-gaming p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-primary" />
                            <span className="font-display font-bold text-white">Competition Rules & Fair Play</span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {[
                                "Best of 5 Format",
                                "Anti-Cheat Required",
                                "Verified Accounts Only",
                                "No External Tools",
                                "Stream Delay: 2min"
                            ].map((rule, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-low border border-white/[0.06]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    <span className="text-xs font-medium text-slate-300">{rule}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button variant="ghost" size="sm">
                        Full Rulebook
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Tournaments;
