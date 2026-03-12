import React from 'react';
import { useHUDDepth } from '../hooks/useHUDDepth';
import { useNeuralHaptics } from '../hooks/useNeuralHaptics';
import { Shield, Users, Trophy, Zap, Activity, Plus, ChevronRight, MessageSquare, Target } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

const MemberCard = ({ name, rank, axp, status = "OFFLINE", triggerHaptic }) => (
    <div 
        onMouseEnter={triggerHaptic}
        className="glass-panel p-6 flex flex-col items-center text-center transition-all duration-500 border-white/5 group hover:border-accent-cyan/20 hover:bg-white/[0.02]"
    >
        <div className="relative mb-4">
            <div className="absolute -inset-2 bg-accent-cyan/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <Avatar size="md" className="ring-1 ring-white/10 group-hover:ring-accent-cyan transition-all relative z-10" />
            <div className={cn(
                "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-background z-20",
                status === "ONLINE" ? 'bg-accent-green' : 'bg-gray-700'
            )} />
        </div>

        <div className="mb-4">
            <p className="font-display font-black text-white text-[10px] uppercase italic tracking-widest mb-1 group-hover:text-accent-cyan transition-colors">{name}</p>
            <p className="text-[8px] font-display font-black text-gray-500 uppercase tracking-[0.2em]">{rank}</p>
        </div>

        <div className="w-full pt-4 border-t border-white/5 flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-axp-gold opacity-50" />
                <span className="font-display font-black text-white text-[10px] italic">{axp.toLocaleString()}</span>
            </div>
            <span className="text-[7px] font-display font-black text-gray-700 uppercase tracking-widest">RANK_CONTRIB</span>
        </div>
    </div>
);

const Guilds = () => {
    const depthRef = useHUDDepth(8);
    const { triggerLightHaptic } = useNeuralHaptics();

    return (
        <div className="space-y-12 pb-20 animate-slide-in">
            {/* 1. Faction Hub Banner */}
            <div
                ref={depthRef}
                className="relative group transition-transform duration-500 ease-out"
            >
                <div className="absolute inset-0 bg-accent-cyan/5 blur-3xl opacity-30 pointer-events-none" />
                
                <div className="glass-panel p-10 md:p-12 border-white/5 relative overflow-hidden backdrop-blur-2xl">
                    {/* ID Watermark */}
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] font-display font-black text-8xl italic select-none pointer-events-none uppercase">
                        CLAN_NODE_04
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start gap-10 relative z-10">
                        <div className="flex gap-8 items-center">
                            <div className="w-24 h-24 bg-background rounded-3xl flex items-center justify-center border-2 border-accent-cyan/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] -rotate-3 group-hover:rotate-0 transition-all duration-700 overflow-hidden relative">
                                <Shield className="w-12 h-12 text-accent-cyan relative z-10" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-accent-cyan/10 to-transparent" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <h3 className="text-[10px] font-display font-black text-accent-cyan uppercase tracking-[0.4em]">Strategic_Alliance_HUB</h3>
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-ping" />
                                </div>
                                <h1 className="text-4xl md:text-6xl font-display font-black text-white italic tracking-tighter uppercase leading-none">OMEGA<span className="text-accent-cyan">SQUAD</span></h1>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 w-full md:w-auto">
                            <div className="flex-1 md:flex-none px-6 py-4 glass-panel border-white/5 text-center md:text-left">
                                <p className="text-[8px] font-display font-black text-gray-500 uppercase tracking-widest mb-1">GLOBAL_STANDING</p>
                                <p className="text-lg font-display font-black text-white uppercase italic tracking-widest">#04 <span className="text-gray-500 text-xs">ELITE</span></p>
                            </div>
                            <Button
                                variant="primary"
                                size="md"
                                className="w-full md:w-auto px-10"
                                onClick={() => triggerLightHaptic()}
                            >
                                <Zap className="w-4 h-4 mr-2" /> UPLINK_SYNC
                            </Button>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-wrap gap-10 border-t border-white/5 pt-8 relative z-10">
                        <div className="space-y-1">
                            <p className="text-[8px] font-display font-black text-gray-600 uppercase tracking-widest">SYNDICATE_ROSTER</p>
                            <p className="text-sm font-display font-black text-white italic tracking-widest">15 <span className="text-gray-500 text-xs">/ 50 UNIFIED</span></p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[8px] font-display font-black text-gray-600 uppercase tracking-widest">COLLECTIVE_XP</p>
                            <p className="text-sm font-display font-black text-accent-cyan italic tracking-[0.2em] uppercase">1.24,500 <span className="text-gray-500 text-xs">AXP</span></p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[8px] font-display font-black text-gray-600 uppercase tracking-widest">LAST_BREACH</p>
                            <p className="text-sm font-display font-black text-accent-rose italic tracking-widest uppercase">2H_AGO</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Active Roster Section */}
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-8 bg-accent-cyan rounded-full" />
                        <h3 className="font-display font-black text-white text-xs tracking-[0.4em] uppercase">ACTIVE_OPERATORS</h3>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-accent-green" />
                            <span className="text-[9px] font-display font-black text-gray-500 uppercase tracking-widest">Link_Stable</span>
                        </div>
                        <button className="text-[9px] font-display font-black text-accent-cyan uppercase tracking-widest flex items-center gap-2 hover:opacity-80 transition-opacity">
                            VIEW_ROSTER <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                    <MemberCard name="Sniper_King" rank="OFFICER" axp={15402} status="ONLINE" triggerHaptic={() => triggerLightHaptic()} />
                    <MemberCard name="Neural_V" rank="LEADER" axp={42900} status="ONLINE" triggerHaptic={() => triggerLightHaptic()} />
                    <MemberCard name="Ghost_Walker" rank="SCOUT" axp={8200} triggerHaptic={() => triggerLightHaptic()} />
                    <MemberCard name="Silent_Echo" rank="SCOUT" axp={4500} status="ONLINE" triggerHaptic={() => triggerLightHaptic()} />
                    <MemberCard name="Shadow_Rage" rank="KNIGHT" axp={12300} triggerHaptic={() => triggerLightHaptic()} />
                </div>
            </div>

            {/* 3. Social Tabs / Secondary Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-8 border-white/5 hover:border-accent-cyan/20 transition-all group">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <MessageSquare className="w-5 h-5 text-accent-cyan" />
                            <h4 className="font-display font-black text-white text-xs tracking-widest uppercase">COMM_CHANNELS</h4>
                        </div>
                        <span className="text-[8px] font-display font-black text-gray-600 uppercase">3_NEW_MESSAGES</span>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:border-white/10 flex items-center gap-4">
                                <Avatar size="sm" />
                                <div className="flex-1">
                                    <p className="text-[10px] text-white font-display font-black italic uppercase">Operator_0{i}</p>
                                    <p className="text-[9px] text-gray-500 font-display font-bold">Secure transmission received...</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="space-y-8">
                    <div className="glass-panel p-10 flex flex-col items-center justify-center text-center border-white/5 group cursor-pointer hover:border-accent-cyan/30 overflow-hidden relative h-full">
                        <div className="absolute inset-0 bg-accent-cyan/[0.02] translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                        <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-accent-cyan mb-8 transition-transform group-hover:scale-110 relative z-10">
                            <Plus className="w-8 h-8" />
                        </div>
                        <h4 className="text-xl font-display font-black text-white uppercase italic tracking-widest mb-3 relative z-10">EXPAND_FACTION</h4>
                        <p className="text-[10px] text-gray-500 uppercase font-display font-bold tracking-tight leading-relaxed max-w-[280px] relative z-10">
                            Generate a secure Neural Bridge invitation to recruit new elite operators into the OMEGA grid.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Guilds;
