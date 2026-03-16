import React, { useState } from 'react';
import { Shield, Users, Trophy, Zap, Activity, Plus, ChevronRight, MessageSquare, Target, RefreshCw, UserPlus, Clock, Crown, Star, Flame, Globe, TrendingUp, Settings, Copy, Check, Search } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

const MemberCard = ({ name, rank, axp, status = "OFFLINE", isLeader = false }) => (
    <div className={cn(
        "card-gaming p-5 flex flex-col items-center text-center group relative overflow-hidden",
        isLeader && "border-amber-500/20"
    )}>
        {isLeader && (
            <div className="absolute top-2 right-2">
                <Crown className="w-4 h-4 text-amber-500" />
            </div>
        )}
        
        <div className="relative mb-4">
            <div className="absolute -inset-3 bg-primary/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Avatar size="lg" className="ring-2 ring-white/10 group-hover:ring-primary/50 transition-all relative z-10" />
            <div className={cn(
                "absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-background z-20 flex items-center justify-center",
                status === "ONLINE" ? 'bg-emerald-500' : status === "AWAY" ? 'bg-amber-500' : 'bg-slate-600'
            )}>
                {status === "ONLINE" && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
            </div>
        </div>

        <div className="mb-3">
            <p className="font-bold text-white text-sm group-hover:text-primary transition-colors">{name}</p>
            <p className={cn(
                "text-[10px] font-bold uppercase tracking-widest mt-0.5",
                rank === 'LEADER' ? 'text-amber-400' : 
                rank === 'OFFICER' ? 'text-primary' : 
                rank === 'KNIGHT' ? 'text-purple-400' : 'text-slate-500'
            )}>
                {rank === 'OFFICER' ? 'Officer' : rank === 'LEADER' ? 'Guild Master' : rank === 'SCOUT' ? 'Member' : rank === 'KNIGHT' ? 'Elite' : rank}
            </p>
        </div>

        <div className="w-full pt-3 border-t border-white/[0.06] flex items-center justify-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-display font-bold text-white text-sm tabular-nums">{axp.toLocaleString()}</span>
            <span className="text-[10px] text-slate-500">XP</span>
        </div>
    </div>
);

const GuildCard = ({ name, tag, members, totalXP, rank, isOpen = true }) => (
    <div className="card-gaming p-6 group cursor-pointer">
        <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent-cyan/10 border border-primary/20 flex items-center justify-center">
                <Shield className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white truncate group-hover:text-primary transition-colors">{name}</h3>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">[{tag}]</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Rank #{rank} Global</p>
            </div>
        </div>
        
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-400">{members}/50</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="text-sm text-slate-400">{(totalXP / 1000).toFixed(1)}K</span>
                </div>
            </div>
            <span className={cn(
                "text-[10px] font-bold px-2 py-1 rounded-lg",
                isOpen ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-500/10 text-slate-400"
            )}>
                {isOpen ? "OPEN" : "INVITE ONLY"}
            </span>
        </div>
    </div>
);

const Guilds = () => {
    const [activeTab, setActiveTab] = useState('my-guild');
    const [copied, setCopied] = useState(false);
    
    const inviteCode = "XPA-OMEGA-2026";
    
    const handleCopy = () => {
        navigator.clipboard.writeText(inviteCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const members = [
        { name: "Neural_V", rank: "LEADER", axp: 42900, status: "ONLINE" },
        { name: "Sniper_King", rank: "OFFICER", axp: 15402, status: "ONLINE" },
        { name: "Shadow_Rage", rank: "KNIGHT", axp: 12300, status: "AWAY" },
        { name: "Ghost_Walker", rank: "SCOUT", axp: 8200, status: "OFFLINE" },
        { name: "Silent_Echo", rank: "SCOUT", axp: 4500, status: "ONLINE" },
    ];

    const browseGuilds = [
        { name: "Vanguard Elite", tag: "VNG", members: 42, totalXP: 125400, rank: 1, isOpen: false },
        { name: "Apex Shadows", tag: "APX", members: 38, totalXP: 98200, rank: 2, isOpen: true },
        { name: "Neural Hunters", tag: "NRL", members: 25, totalXP: 75600, rank: 3, isOpen: true },
        { name: "Zero Lag Syndicate", tag: "ZLS", members: 30, totalXP: 62000, rank: 4, isOpen: false },
    ];

    return (
        <div className="space-y-10 pb-20 animate-fade-in">
            {/* Guild Header */}
            <div className="card-gaming p-8 md:p-10 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-cyan/5 rounded-full blur-[80px]" />
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                </div>
                
                <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                        <div className="flex gap-6 items-start">
                            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent-cyan/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-glow-sm relative">
                                <Shield className="w-10 h-10 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Your Guild</span>
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                </div>
                                <h1 className="text-3xl md:text-4xl font-display font-black text-white tracking-tight">
                                    Omega <span className="text-gradient">Strategy</span>
                                </h1>
                                <p className="text-slate-400 text-sm">Founded March 2025 - Competitive Gaming Guild</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button variant="secondary" size="sm" onClick={handleCopy}>
                                {copied ? <Check className="w-4 h-4 mr-2 text-emerald-400" /> : <Copy className="w-4 h-4 mr-2" />}
                                {copied ? "Copied!" : inviteCode}
                            </Button>
                            <Button variant="secondary" size="sm">
                                <Settings className="w-4 h-4 mr-2" />
                                Settings
                            </Button>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="stat-card !p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Globe className="w-4 h-4 text-primary" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Global Rank</span>
                            </div>
                            <p className="font-display font-bold text-2xl text-white">#4</p>
                        </div>
                        <div className="stat-card !p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="w-4 h-4 text-primary" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Members</span>
                            </div>
                            <p className="font-display font-bold text-2xl text-white">15<span className="text-slate-500 text-sm">/50</span></p>
                        </div>
                        <div className="stat-card !p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-4 h-4 text-amber-500" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total XP</span>
                            </div>
                            <p className="font-display font-bold text-2xl text-gradient">1.24M</p>
                        </div>
                        <div className="stat-card !p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Flame className="w-4 h-4 text-rose-500" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Win Streak</span>
                            </div>
                            <p className="font-display font-bold text-2xl text-white">12</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-surface-elevated/60 border border-white/[0.06] rounded-2xl w-fit">
                {[
                    { id: 'my-guild', label: 'My Guild', icon: Shield },
                    { id: 'browse', label: 'Browse Guilds', icon: Search },
                    { id: 'chat', label: 'Guild Chat', icon: MessageSquare },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all",
                            activeTab === tab.id 
                                ? "bg-primary text-background" 
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* My Guild Content */}
            {activeTab === 'my-guild' && (
                <div className="space-y-8">
                    {/* Members Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="font-display font-bold text-white text-lg flex items-center gap-3">
                                <Users className="w-5 h-5 text-primary" />
                                Guild Members
                            </h2>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-xs text-slate-500">3 Online</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                            {members.map((member, i) => (
                                <MemberCard 
                                    key={i} 
                                    {...member} 
                                    isLeader={member.rank === 'LEADER'} 
                                />
                            ))}
                        </div>
                    </div>

                    {/* Actions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Invite Card */}
                        <div 
                            className="card-gaming p-8 flex flex-col items-center justify-center text-center cursor-pointer group border-dashed border-white/10 hover:border-primary/30"
                            onClick={handleCopy}
                        >
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <UserPlus className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="font-display font-bold text-white text-xl mb-2">Invite Players</h3>
                            <p className="text-sm text-slate-500 mb-4">Share your invite code to grow the guild</p>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-low border border-white/[0.06]">
                                <code className="text-primary font-mono font-bold">{inviteCode}</code>
                                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-500" />}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="card-gaming p-6">
                            <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-primary" />
                                Recent Activity
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { user: "Neural_V", action: "won a tournament match", time: "2m ago" },
                                    { user: "Sniper_King", action: "earned 500 XP from quests", time: "15m ago" },
                                    { user: "Shadow_Rage", action: "joined the guild", time: "1h ago" },
                                ].map((activity, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface-low/50">
                                        <Avatar size="sm" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white truncate">
                                                <span className="font-semibold text-primary">{activity.user}</span> {activity.action}
                                            </p>
                                            <p className="text-[10px] text-slate-500">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Browse Guilds */}
            {activeTab === 'browse' && (
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input 
                                type="text"
                                placeholder="Search guilds..."
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-elevated border border-white/[0.06] text-white placeholder:text-slate-500 focus:border-primary/50 focus:outline-none transition-colors"
                            />
                        </div>
                        <Button variant="secondary">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Guild
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {browseGuilds.map((guild, i) => (
                            <GuildCard key={i} {...guild} />
                        ))}
                    </div>
                </div>
            )}

            {/* Guild Chat */}
            {activeTab === 'chat' && (
                <div className="card-gaming p-6 min-h-[400px] flex flex-col">
                    <div className="flex-1 space-y-4 mb-4">
                        {[
                            { user: "Neural_V", message: "Anyone up for ranked matches tonight?", time: "2:34 PM" },
                            { user: "Sniper_King", message: "I'm in! Let's get that win streak going", time: "2:35 PM" },
                            { user: "Shadow_Rage", message: "Count me in too", time: "2:36 PM" },
                        ].map((msg, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <Avatar size="sm" />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-white text-sm">{msg.user}</span>
                                        <span className="text-[10px] text-slate-500">{msg.time}</span>
                                    </div>
                                    <p className="text-sm text-slate-300 mt-0.5">{msg.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                        <input 
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-3 rounded-xl bg-surface-low border border-white/[0.06] text-white placeholder:text-slate-500 focus:border-primary/50 focus:outline-none transition-colors"
                        />
                        <Button className="btn-gaming px-6">Send</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Guilds;
