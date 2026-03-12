import React, { useState, useEffect } from 'react';
import { Trophy, Swords, Tv, Users, Activity, Crown, Zap, ChevronRight, Play, Radio } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

const MatchCard = ({ p1, p2, time, status = "UPCOMING", score1 = "0.0", score2 = "0.0" }) => (
    <div className={cn(
        "relative overflow-hidden glass-panel p-8 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-500 group",
        status === "LIVE" ? "border-accent-rose/30 shadow-[0_0_30px_rgba(244,63,94,0.1)]" : "hover:border-white/20"
    )}>
        <div className={cn(
            "absolute top-0 right-0 px-6 py-1.5 text-[8px] font-black italic uppercase tracking-[0.3em]",
            status === "LIVE" ? "bg-accent-rose text-white animate-pulse" : "bg-white/10 text-gray-500"
        )}>
            {status}
        </div>

        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-[1.25rem] bg-white/5 border border-white/10 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">👤</div>
                    <div className="space-y-0.5">
                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest block">OPERATOR</span>
                        <span className="text-sm font-black text-white uppercase italic tracking-tighter">{p1}</span>
                    </div>
                </div>
                <span className="text-xl font-black text-white italic tracking-tighter opacity-80">{score1}</span>
            </div>

            <div className="relative h-1px bg-white/5 flex items-center justify-center">
                <div className="bg-background px-4 text-[9px] font-black text-gray-700 tracking-[0.4em] uppercase font-display italic">VS</div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-[1.25rem] bg-white/5 border border-white/10 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">👤</div>
                    <div className="space-y-0.5">
                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest block">OPERATOR</span>
                        <span className="text-sm font-black text-white uppercase italic tracking-tighter">{p2}</span>
                    </div>
                </div>
                <span className="text-xl font-black text-white italic tracking-tighter opacity-80">{score2}</span>
            </div>
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-white/5 pt-6 group/action cursor-pointer">
            <div className="flex items-center gap-3">
                <div className={cn("w-2 h-2 rounded-full", status === "LIVE" ? "bg-accent-rose animate-ping" : "bg-gray-700")} />
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{time}</span>
            </div>
            <div className="flex items-center gap-2 group-hover:gap-4 transition-all">
                <span className="text-[9px] font-black text-white uppercase italic tracking-[0.3em] group-hover:text-accent-cyan">ENTER_PORTAL</span>
                <ChevronRight className="w-3.5 h-3.5 text-accent-cyan group-hover:scale-110 transition-transform" />
            </div>
        </div>
    </div>
);

const Tournaments = () => {
    const [combatMode, setCombatMode] = useState(false);
    const [timeLeft, setTimeLeft] = useState(180);

    useEffect(() => {
        if (!combatMode) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
        return () => clearInterval(timer);
    }, [combatMode]);

    const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    return (
        <div className="space-y-16 pb-20 animate-slide-in font-display">
            {/* Header / Active Banner */}
            <div className={cn(
                "relative overflow-hidden rounded-[4rem] p-12 md:p-20 border-2 transition-all duration-1000",
                combatMode 
                    ? "bg-accent-rose/[0.04] border-accent-rose/40 shadow-[0_0_80px_rgba(244,63,94,0.15)]" 
                    : "bg-white/[0.01] border-white/5 shadow-2xl backdrop-blur-3xl"
            )}>
                <div className={cn(
                    "absolute -top-32 -right-32 w-80 h-80 blur-[120px] rounded-full transition-all duration-1000",
                    combatMode ? "bg-accent-rose/20 scale-150" : "bg-accent-cyan/10"
                )} />
                <div className="absolute inset-x-0 bottom-0 h-1px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="relative z-10 space-y-12">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <span className={cn("text-[10px] font-black uppercase tracking-[0.5em] italic", combatMode ? "text-accent-rose" : "text-accent-cyan")}>ARENI_GLOBAL_LINK</span>
                                <Radio className={cn("w-4 h-4", combatMode ? "text-accent-rose animate-pulse" : "text-gray-700")} />
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black italic text-white tracking-tighter uppercase leading-none">SYNDICATE <span className={combatMode ? "text-accent-rose" : "text-accent-cyan"}>CUP</span></h2>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-lg italic">
                                SEASONAL_ELITE_CHURN. HIGH-STAKES TACTICAL ENGAGEMENT DELEGATED BY THE ARENA ADVISORY NODE.
                            </p>
                        </div>
                        
                        <div className="flex flex-col items-end gap-3 px-8 py-4 glass-panel border-white/10 bg-white/5">
                            <div className="flex items-center gap-3">
                                <Tv className="w-3.5 h-3.5 text-accent-rose" />
                                <span className="text-[10px] font-black text-white uppercase italic tracking-[0.3em]">LIVE_SPECTATE_HUB</span>
                            </div>
                            <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">14.2K_WATCHING</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-10 pt-12 border-t border-white/5">
                        <div className="flex items-center gap-6">
                             <div className="w-14 h-14 rounded-2xl bg-axp-gold/10 border border-axp-gold/20 flex items-center justify-center shadow-xl">
                                <Crown className="w-8 h-8 text-axp-gold" />
                             </div>
                             <div className="space-y-1">
                                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest leading-none">PRIZE_POOL_ALLOCATION</span>
                                <div className="text-2xl font-black text-white italic tracking-widest leading-none uppercase">50,000 <span className="text-xs text-axp-gold">AXP</span></div>
                             </div>
                        </div>

                        <div className="h-12 w-1px bg-white/5 hidden lg:block" />

                        <div className="flex-1 flex justify-end gap-6">
                             <Button
                                onClick={() => setCombatMode(!combatMode)}
                                className={cn(
                                    "px-12 py-7 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.4em] transition-all relative overflow-hidden group/btn h-18",
                                    combatMode
                                        ? "bg-accent-rose text-white shadow-[0_20px_40px_rgba(244,63,94,0.3)]"
                                        : "bg-white text-background hover:scale-105 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                                )}
                            >
                                <span className="relative z-10 flex items-center gap-4">
                                    {combatMode ? 'ABORT_SEQUENCE' : 'ENGAGE_COMBAT'}
                                    <Swords className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                                </span>
                                <div className={cn("absolute inset-0 bg-white/20 transition-transform duration-500", combatMode ? "translate-x-0" : "-translate-x-full")} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Combat Sequence HUD Overlay */}
            {combatMode && (
                <div className="bg-background border-2 border-accent-rose p-10 rounded-[3rem] shadow-[0_0_50px_rgba(244,63,94,0.1)] flex items-center justify-between relative overflow-hidden animate-in slide-in-from-top-4 duration-500">
                    <div className="absolute inset-0 bg-accent-rose/5 animate-pulse" />
                    <div className="flex items-center gap-10 relative z-10">
                        <div className="w-20 h-20 bg-accent-rose/20 border border-accent-rose/40 rounded-3xl flex items-center justify-center text-accent-rose text-3xl font-black italic">!</div>
                        <div className="space-y-2">
                            <div className="text-xs font-black text-accent-rose uppercase tracking-[0.5em] mb-1 leading-none">COMBAT_DETECTED_SYNCING_NODE</div>
                            <div className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">MATCH_SEQUENCE_INITIALIZING...</div>
                        </div>
                    </div>
                    <div className="text-6xl font-black text-accent-rose font-mono italic relative z-10 tracking-tighter">{formatTime(timeLeft)}</div>
                </div>
            )}

            {/* Bracket Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-10">
                    <div className="flex items-center justify-between px-6">
                        <div className="flex items-center gap-4">
                             <Activity className="w-4 h-4 text-gray-500" />
                             <h3 className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic">Quarter_Finals</h3>
                        </div>
                        <div className="px-4 py-1.5 glass-panel border-accent-cyan/20 bg-accent-cyan/5 text-[9px] font-black text-accent-cyan uppercase tracking-widest animate-pulse">2_ACTIVE_NODES</div>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        <MatchCard p1="SNIPER_GOD" p2="NEURAL_LINK" time="IN_PLAY" status="LIVE" score1="03.2" score2="01.0" />
                        <MatchCard p1="GHOST_OPERATOR" p2="SILENT_AXIS" time="T-MINUS 12M" status="UPCOMING" />
                    </div>
                </div>

                <div className="space-y-10">
                    <div className="flex items-center gap-4 px-6 h-9">
                         <Activity className="w-4 h-4 text-gray-500" />
                         <h3 className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic">Semi_Finals</h3>
                    </div>
                    <Card className="h-full border-2 border-dashed border-white/5 bg-white/[0.01] rounded-[3.5rem] p-16 flex flex-col items-center justify-center text-center opacity-30 group hover:opacity-100 transition-opacity min-h-[400px]">
                        <div className="w-24 h-24 rounded-full bg-white/5 mb-8 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform">⚔️</div>
                        <div className="space-y-4">
                           <h4 className="text-xl font-black text-white italic tracking-tighter uppercase">VOID_BRACKET</h4>
                           <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest max-w-[200px] leading-relaxed italic">AWAITING_QUARTER_FINAL_PROGRESSION_CYCLES...</p>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Engagement Rules Footer */}
            <div className="glass-panel border-white/5 bg-white/[0.01] p-10 opacity-50 hover:opacity-100 transition-all group">
                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-5 h-1px bg-indigo-500" />
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] italic">Rules_of_Engagement</span>
                        </div>
                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest leading-relaxed max-w-2xl italic">
                            BEST_OF_5_CYCLES • STANDARD_ARENA_SENS_PROTOCOL_ENFORCED • GLOBAL_NEURAL_SYNC_REQUIRED • HARDWARE_LATENCY_CHECK_ACTIVE.
                        </p>
                    </div>
                    <div className="flex items-center gap-6 shrink-0">
                         {[Users, Trophy, Zap].map((Icon, i) => (
                            <Icon key={i} className="w-6 h-6 text-gray-700" />
                         ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tournaments;
