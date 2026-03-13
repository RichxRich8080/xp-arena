import React from 'react';
import { Shield, Users, Trophy, Zap, Activity, Plus, ChevronRight, MessageSquare, Target, RefreshCw, UserPlus, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

const MemberCard = ({ name, rank, axp, status = "OFFLINE" }) => (
    <Card className="p-6 flex flex-col items-center text-center transition-all duration-300 border-white/5 group hover:border-primary/20 bg-slate-900/50 rounded-2xl">
        <div className="relative mb-4">
            <div className="absolute -inset-2 bg-primary/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <Avatar size="md" className="ring-1 ring-white/10 group-hover:ring-primary transition-all relative z-10" />
            <div className={cn(
                "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-950 z-20",
                status === "ONLINE" ? 'bg-green-500' : 'bg-slate-700'
            )} />
        </div>

        <div className="mb-4">
            <p className="font-bold text-white text-[10px] uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">{name}</p>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{rank === 'OFFICER' ? 'Manager' : rank === 'LEADER' ? 'Administrator' : rank === 'SCOUT' ? 'Associate' : rank === 'KNIGHT' ? 'Senior' : rank}</p>
        </div>

        <div className="w-full pt-4 border-t border-white/5 flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-amber-500 opacity-50" />
                <span className="font-bold text-white text-[10px] tabular-nums">{axp.toLocaleString()}</span>
            </div>
            <span className="text-[7px] font-bold text-slate-600 uppercase tracking-widest">Points Contributed</span>
        </div>
    </Card>
);

const Guilds = () => {
    return (
        <div className="space-y-12 pb-20 animate-fade-in font-sans">
            {/* Guild Header */}
            <div className="relative">
                <div className="absolute inset-0 bg-primary/5 blur-3xl opacity-30 pointer-events-none" />
                
                <div className="bg-slate-900 p-8 md:p-12 border border-white/5 rounded-[2.5rem] relative overflow-hidden shadow-xl">
                    {/* Watermark */}
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] font-bold text-8xl select-none pointer-events-none uppercase">
                        TEAM
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start gap-10 relative z-10">
                        <div className="flex gap-6 items-center flex-wrap sm:flex-nowrap">
                            <div className="w-20 h-20 bg-slate-950 rounded-2xl flex items-center justify-center border border-primary/20 shadow-lg relative shrink-0">
                                <Shield className="w-10 h-10 text-primary relative z-10" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest">Team Performance Hub</h3>
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                </div>
                                <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight uppercase leading-none">Omega <span className="text-primary">Strategy</span></h1>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 w-full md:w-auto">
                            <div className="flex-1 md:flex-none px-6 py-3 bg-slate-800 border border-white/5 rounded-2xl text-center md:text-left">
                                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Global Rank</p>
                                <p className="text-lg font-bold text-white uppercase tracking-tight">#04 <span className="text-slate-500 text-xs">SENIOR</span></p>
                            </div>
                            <Button
                                className="w-full md:w-auto px-8 h-12 rounded-xl"
                                onClick={() => {}}
                            >
                                <RefreshCw className="w-4 h-4 mr-2" /> Refresh Data
                            </Button>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-wrap gap-10 border-t border-white/5 pt-8 relative z-10">
                        <div className="space-y-1">
                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Member Roster</p>
                            <p className="text-sm font-bold text-white tracking-widest uppercase">15 <span className="text-slate-500 text-xs">/ 50 Members</span></p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Total Points Earned</p>
                            <p className="text-sm font-bold text-primary tracking-tight uppercase">1,245,300 <span className="text-slate-500 text-xs">Points</span></p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Recent Activity</p>
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-300 tracking-widest uppercase">
                                <Clock className="w-3.5 h-3.5" /> 2 Hours Ago
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Members Section */}
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                    <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-primary" />
                        <h3 className="font-bold text-white text-xs tracking-widest uppercase">Member Roster</h3>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Online Players</span>
                        </div>
                        <button className="text-[9px] font-bold text-primary uppercase tracking-widest flex items-center gap-2 hover:opacity-80 transition-opacity">
                            View All Members <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                    <MemberCard name="Sniper_King" rank="OFFICER" axp={15402} status="ONLINE" />
                    <MemberCard name="Neural_V" rank="LEADER" axp={42900} status="ONLINE" />
                    <MemberCard name="Ghost_Walker" rank="SCOUT" axp={8200} />
                    <MemberCard name="Silent_Echo" rank="SCOUT" axp={4500} status="ONLINE" />
                    <MemberCard name="Shadow_Rage" rank="KNIGHT" axp={12300} />
                </div>
            </div>

            {/* Social & Recruitment */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-8 bg-slate-900 border-white/5 hover:border-primary/20 transition-all group rounded-3xl">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            <h4 className="font-bold text-white text-xs tracking-widest uppercase">Communication Hub</h4>
                        </div>
                        <span className="text-[8px] font-bold text-slate-500 uppercase">3 New Notifications</span>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="p-4 bg-slate-950/50 rounded-xl border border-white/5 flex items-center gap-4 hover:bg-slate-800 transition-colors">
                                <Avatar size="sm" />
                                <div className="flex-1">
                                    <p className="text-[10px] text-white font-bold uppercase">Member_0{i}</p>
                                    <p className="text-[9px] text-slate-500 font-medium">New performance update shared...</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="space-y-8">
                    <button className="w-full h-full bg-slate-900/50 p-10 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-3xl group hover:border-primary/30 hover:bg-slate-900 transition-all duration-300">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 transition-transform group-hover:scale-110">
                            <UserPlus className="w-8 h-8" />
                        </div>
                        <h4 className="text-xl font-bold text-white uppercase tracking-tight mb-2">Invite Member</h4>
                        <p className="text-[10px] text-slate-500 uppercase font-medium tracking-wide leading-relaxed max-w-[280px]">
                            Generate a secure invite link to recruit new players into the team.
                        </p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Guilds;
