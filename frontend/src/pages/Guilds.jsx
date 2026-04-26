import React, { useState, useEffect } from 'react';
import { Shield, Users, Trophy, Zap, Activity, Plus, ChevronRight, MessageSquare, Target, RefreshCw, UserPlus, Clock, Crown, Star, Flame, Globe, TrendingUp, Settings, Copy, Check, Search, LogOut } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';
import { guildService } from '../services/api';
import { useNotifications } from '../hooks/useNotifications';

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
    const { addNotification } = useNotifications();
    const [activeTab, setActiveTab] = useState('my-guild');
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [myGuild, setMyGuild] = useState(null);
    const [members, setMembers] = useState([]);
    const [browseGuilds, setBrowseGuilds] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newGuildName, setNewGuildName] = useState('');
    
    const inviteCode = myGuild ? `XPA-${myGuild.name.replace(/\s+/g, '-').toUpperCase()}-${myGuild.id}` : "XPA-NONE";
    
    const fetchData = async () => {
        setLoading(true);
        try {
            const myGuildRes = await guildService.getMyGuild();
            if (myGuildRes.data.success && myGuildRes.data.guild) {
                setMyGuild(myGuildRes.data.guild);
                const membersRes = await guildService.getMembers(myGuildRes.data.guild.id);
                setMembers(membersRes.data.map(m => ({
                    name: m.username,
                    rank: m.role.toUpperCase(),
                    axp: m.axp,
                    status: "OFFLINE" // We could add real-time status later
                })));
            } else {
                setMyGuild(null);
                setActiveTab('browse');
            }

            const browseRes = await guildService.getBrowseGuilds();
            setBrowseGuilds(browseRes.data.map((g, i) => ({
                id: g.id,
                name: g.name,
                tag: g.badge || "XPA",
                members: g.members,
                totalXP: g.axp,
                rank: i + 1,
                isOpen: true
            })));
        } catch (error) {
            console.error(error);
            addNotification('Error', 'Failed to load guild data', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCopy = () => {
        if (!myGuild) return;
        navigator.clipboard.writeText(inviteCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCreateGuild = async () => {
        if (!newGuildName || newGuildName.length < 3) {
            addNotification('Invalid Name', 'Guild name must be at least 3 characters', 'warning');
            return;
        }
        try {
            const res = await guildService.createGuild(newGuildName);
            if (res.data.success) {
                addNotification('Success', 'Guild created successfully!', 'success');
                fetchData();
                setActiveTab('my-guild');
            }
        } catch (error) {
            addNotification('Error', error.message, 'error');
        }
    };

    const handleJoinGuild = async (guildId) => {
        try {
            const res = await guildService.joinGuild(guildId);
            if (res.data.success) {
                addNotification('Success', 'Joined guild!', 'success');
                fetchData();
                setActiveTab('my-guild');
            }
        } catch (error) {
            addNotification('Error', error.message, 'error');
        }
    };

    const handleLeaveGuild = async () => {
        if (!window.confirm('Are you sure you want to leave your guild?')) return;
        try {
            const res = await guildService.leaveGuild();
            if (res.data.success) {
                addNotification('Success', 'Left guild', 'success');
                fetchData();
                setActiveTab('browse');
            }
        } catch (error) {
            addNotification('Error', error.message, 'error');
        }
    };

    const filteredBrowseGuilds = browseGuilds.filter(g => 
        g.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <RefreshCw className="w-10 h-10 text-primary animate-spin mx-auto" />
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Syncing Guild Nodes...</p>
                </div>
            </div>
        );
    }

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
                    {myGuild ? (
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
                                        {myGuild.name}
                                    </h1>
                                    <p className="text-slate-400 text-sm">Founded {new Date(myGuild.created_at).toLocaleDateString()} - {myGuild.owner_name}'s Guild</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Button variant="secondary" size="sm" onClick={handleCopy}>
                                    {copied ? <Check className="w-4 h-4 mr-2 text-emerald-400" /> : <Copy className="w-4 h-4 mr-2" />}
                                    {copied ? "Copied!" : inviteCode}
                                </Button>
                                <Button variant="secondary" size="sm" onClick={handleLeaveGuild} className="text-rose-400 hover:text-rose-300">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Leave
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-6 py-10">
                            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto border border-white/5">
                                <Shield className="w-10 h-10 text-slate-600" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-3xl font-display font-black text-white">Join the Community</h1>
                                <p className="text-slate-400 max-w-md mx-auto">You are not currently in a guild. Join one to participate in wars and earn massive rewards.</p>
                            </div>
                            <div className="flex items-center justify-center gap-4">
                                <Button onClick={() => setActiveTab('browse')}>Browse Guilds</Button>
                                <span className="text-slate-600 font-bold uppercase text-[10px]">OR</span>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="New Guild Name"
                                        value={newGuildName}
                                        onChange={(e) => setNewGuildName(e.target.value)}
                                        className="bg-surface-low border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary"
                                    />
                                    <Button variant="secondary" onClick={handleCreateGuild}>Create</Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {myGuild && (
                        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="stat-card !p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Globe className="w-4 h-4 text-primary" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Global Rank</span>
                                </div>
                                <p className="font-display font-bold text-2xl text-white">#{myGuild.rank}</p>
                            </div>
                            <div className="stat-card !p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className="w-4 h-4 text-primary" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Members</span>
                                </div>
                                <p className="font-display font-bold text-2xl text-white">{myGuild.member_count}<span className="text-slate-500 text-sm">/50</span></p>
                            </div>
                            <div className="stat-card !p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Zap className="w-4 h-4 text-amber-500" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total XP</span>
                                </div>
                                <p className="font-display font-bold text-2xl text-gradient">{(myGuild.total_axp / 1000).toFixed(1)}K</p>
                            </div>
                            <div className="stat-card !p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Flame className="w-4 h-4 text-rose-500" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</span>
                                </div>
                                <p className="font-display font-bold text-2xl text-white">{myGuild.premium_only ? 'PREMIUM' : 'OPEN'}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-surface-elevated/60 border border-white/[0.06] rounded-2xl w-fit">
                {[
                    { id: 'my-guild', label: 'My Guild', icon: Shield, hidden: !myGuild },
                    { id: 'browse', label: 'Browse Guilds', icon: Search },
                    { id: 'chat', label: 'Guild Chat', icon: MessageSquare, hidden: !myGuild },
                ].filter(t => !t.hidden).map((tab) => (
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
            {activeTab === 'my-guild' && myGuild && (
                <div className="space-y-8">
                    {/* Members Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="font-display font-bold text-white text-lg flex items-center gap-3">
                                <Users className="w-5 h-5 text-primary" />
                                Guild Members
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                            {members.map((member, i) => (
                                <MemberCard 
                                    key={i} 
                                    {...member} 
                                    isLeader={member.rank === 'OWNER'} 
                                />
                            ))}
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
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-elevated border border-white/[0.06] text-white placeholder:text-slate-500 focus:border-primary/50 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredBrowseGuilds.map((guild, i) => (
                            <div key={i} onClick={() => handleJoinGuild(guild.id)}>
                                <GuildCard {...guild} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Guilds;
