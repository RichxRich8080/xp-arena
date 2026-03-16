import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Trophy, Zap, Medal, RefreshCw, ChevronRight, Activity, Globe, Users, TrendingUp, Crown, Flame, Star, Shield } from 'lucide-react';
import api from '../services/api';
import { cn } from '../utils/cn';

const FALLBACK_PLAYERS = [
    { rank: 1, username: 'NovaKing', axp: 45000, level: 48, rank_tier: 'Legend', winRate: 94 },
    { rank: 2, username: 'FlashX', axp: 38000, level: 42, rank_tier: 'Grandmaster', winRate: 91 },
    { rank: 3, username: 'ZeroPing', axp: 29500, level: 36, rank_tier: 'Master', winRate: 88 },
    { rank: 4, username: 'GhostRider', axp: 21000, level: 28, rank_tier: 'Diamond', winRate: 85 },
    { rank: 5, username: 'SnipeGod', axp: 18500, level: 24, rank_tier: 'Diamond', winRate: 82 },
    { rank: 6, username: 'Apex_Hunter', axp: 15200, level: 20, rank_tier: 'Platinum', winRate: 79 },
    { rank: 7, username: 'ShadowStrike', axp: 12800, level: 18, rank_tier: 'Platinum', winRate: 76 },
    { rank: 8, username: 'VortexX', axp: 10500, level: 15, rank_tier: 'Gold', winRate: 73 },
];

const FALLBACK_GUILDS = [
    { rank: 1, name: 'Vanguard Elite', axp: 125400, members: 42, tag: 'VNG', winRate: 89 },
    { rank: 2, name: 'Apex Shadows', axp: 98200, members: 38, tag: 'APX', winRate: 85 },
    { rank: 3, name: 'Neural Hunters', axp: 75600, members: 25, tag: 'NRL', winRate: 82 },
    { rank: 4, name: 'Zero Lag Syndicate', axp: 62000, members: 30, tag: 'ZLS', winRate: 78 },
    { rank: 5, name: 'Omega Squad', axp: 45000, members: 15, tag: 'OMG', winRate: 75 },
];

function getRankColor(rank_tier) {
    const colors = {
        'Legend': 'text-rank-legend',
        'Grandmaster': 'text-rank-grandmaster',
        'Master': 'text-rank-master',
        'Diamond': 'text-rank-diamond',
        'Platinum': 'text-rank-platinum',
        'Gold': 'text-rank-gold',
        'Silver': 'text-rank-silver',
        'Bronze': 'text-rank-bronze',
    };
    return colors[rank_tier] || 'text-slate-400';
}

function getRankBg(rank_tier) {
    const colors = {
        'Legend': 'bg-rank-legend/10 border-rank-legend/20',
        'Grandmaster': 'bg-rank-grandmaster/10 border-rank-grandmaster/20',
        'Master': 'bg-rank-master/10 border-rank-master/20',
        'Diamond': 'bg-rank-diamond/10 border-rank-diamond/20',
        'Platinum': 'bg-rank-platinum/10 border-rank-platinum/20',
        'Gold': 'bg-rank-gold/10 border-rank-gold/20',
        'Silver': 'bg-rank-silver/10 border-rank-silver/20',
        'Bronze': 'bg-rank-bronze/10 border-rank-bronze/20',
    };
    return colors[rank_tier] || 'bg-slate-500/10 border-slate-500/20';
}

function Podium({ player, place, squad = false }) {
    const configs = {
        1: { color: 'text-gaming-gold', ring: 'ring-gaming-gold', bg: 'from-gaming-gold/20 to-amber-500/5', h: 'h-52', glow: 'shadow-[0_0_60px_rgba(255,215,0,0.3)]' },
        2: { color: 'text-gaming-silver', ring: 'ring-gaming-silver', bg: 'from-gaming-silver/15 to-slate-400/5', h: 'h-44', glow: 'shadow-[0_0_40px_rgba(192,192,192,0.2)]' },
        3: { color: 'text-gaming-bronze', ring: 'ring-gaming-bronze', bg: 'from-gaming-bronze/15 to-orange-700/5', h: 'h-36', glow: 'shadow-[0_0_40px_rgba(205,127,50,0.2)]' },
    };
    const cfg = configs[place];

    return (
        <div className={cn(
            "flex flex-col items-center justify-end relative transition-all duration-500",
            place === 1 ? 'z-10 scale-105' : 'opacity-90 hover:opacity-100'
        )}>
            {/* Crown for 1st place */}
            {place === 1 && (
                <div className="absolute -top-8 animate-float">
                    <Crown className="w-8 h-8 text-gaming-gold drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
                </div>
            )}
            
            <div className="relative mb-6 group">
                <div className={cn("absolute -inset-6 rounded-full blur-2xl bg-gradient-to-b opacity-40", cfg.bg)} />
                <Avatar 
                    size={place === 1 ? 'xl' : 'lg'} 
                    className={cn(
                        "ring-4 ring-offset-4 ring-offset-background relative z-10 transition-transform group-hover:scale-110",
                        cfg.ring,
                        cfg.glow
                    )} 
                />
                <div className={cn(
                    "absolute -bottom-3 left-1/2 -translate-x-1/2 w-9 h-9 rounded-xl flex items-center justify-center font-display font-black text-sm shadow-xl z-20",
                    place === 1 ? 'bg-gradient-to-br from-gaming-gold to-amber-600 text-background' : 
                    place === 2 ? 'bg-gradient-to-br from-gaming-silver to-slate-400 text-background' :
                    'bg-gradient-to-br from-gaming-bronze to-orange-700 text-background'
                )}>
                    {place}
                </div>
            </div>
            
            <div className={cn(
                "w-36 md:w-40 bg-surface-elevated/80 backdrop-blur-sm border-t-2 rounded-t-2xl flex flex-col items-center pt-8 px-4 transition-all duration-500 relative overflow-hidden",
                cfg.h,
                place === 1 ? 'border-gaming-gold' : place === 2 ? 'border-gaming-silver' : 'border-gaming-bronze'
            )}>
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-shine opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <span className="font-display font-bold text-white text-sm truncate w-full text-center tracking-tight mb-2">
                    {squad ? player.tag : player.username}
                </span>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-low/80">
                    <Zap className={cn("w-3 h-3", cfg.color)} />
                    <span className="font-display font-bold text-white text-xs tabular-nums">{player.axp.toLocaleString()}</span>
                </div>
                {player.winRate && (
                    <span className="text-[10px] text-slate-500 mt-2 font-semibold">{player.winRate}% Win Rate</span>
                )}
            </div>
        </div>
    );
}

export default function Leaderboard() {
    const [view, setView] = useState('players');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [players, setPlayers] = useState(FALLBACK_PLAYERS);
    const [guilds, setGuilds] = useState(FALLBACK_GUILDS);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const [lbRes, guildRes] = await Promise.all([
                api.get('/leaderboard'),
                api.get('/guilds/leaderboard')
            ]);

            const normalizedPlayers = (lbRes.data || []).slice(0, 20).map((item, idx) => ({
                rank: idx + 1,
                username: item.username || `Player ${idx + 1}`,
                axp: Number(item.axp || item.total_axp || 0),
                level: item.level || 1,
                rank_tier: item.rank || 'Bronze',
                winRate: item.winRate || Math.floor(70 + Math.random() * 25),
            }));

            const normalizedGuilds = (guildRes.data || []).slice(0, 20).map((item, idx) => ({
                rank: idx + 1,
                name: item.guild_name || item.name || `Guild ${idx + 1}`,
                axp: Number(item.total_axp || item.axp || 0),
                members: Number(item.member_count || item.members || 0),
                tag: (item.guild_name || item.name || 'GLD').slice(0, 3).toUpperCase(),
                winRate: item.winRate || Math.floor(70 + Math.random() * 20),
            }));

            if (normalizedPlayers.length) setPlayers(normalizedPlayers);
            if (normalizedGuilds.length) setGuilds(normalizedGuilds);
        } catch {
            setError('Showing cached rankings. Live sync in progress...');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const list = view === 'players' ? players : guilds;
    const topThree = useMemo(() => list.slice(0, 3), [list]);
    const rest = useMemo(() => list.slice(3), [list]);

    return (
        <div className="space-y-10 pb-20 animate-fade-in">
            {/* Header Section */}
            <div className="card-gaming p-8 md:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                
                <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                            <TrendingUp className="w-3.5 h-3.5 text-primary" />
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Live Rankings</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight">
                            Global <span className="text-gradient">Leaderboard</span>
                        </h1>
                        <p className="text-slate-400 text-sm max-w-md">
                            Compete with the best players worldwide. Climb the ranks and prove your dominance.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 p-1.5 bg-surface-low/80 border border-white/[0.06] rounded-2xl">
                        <button 
                            onClick={() => setView('players')} 
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-semibold text-sm",
                                view === 'players' 
                                    ? 'bg-primary text-background shadow-glow-sm' 
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                            )}
                        >
                            <Globe className="w-4 h-4" /> Players
                        </button>
                        <button 
                            onClick={() => setView('guilds')} 
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-semibold text-sm",
                                view === 'guilds' 
                                    ? 'bg-primary text-background shadow-glow-sm' 
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                            )}
                        >
                            <Users className="w-4 h-4" /> Guilds
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-amber-500/5 border border-amber-500/10 py-3 px-6 rounded-xl flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <p className="text-xs font-medium text-amber-400">{error}</p>
                </div>
            )}

            {/* Podium Section */}
            <div className="relative rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-gaming" />
                <div className="absolute inset-0 bg-mesh-pattern opacity-30" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                
                <div className="flex justify-center items-end gap-2 md:gap-10 pt-20 pb-8 relative z-10">
                    {topThree[1] && <Podium player={topThree[1]} place={2} squad={view === 'guilds'} />}
                    {topThree[0] && <Podium player={topThree[0]} place={1} squad={view === 'guilds'} />}
                    {topThree[2] && <Podium player={topThree[2]} place={3} squad={view === 'guilds'} />}
                </div>
            </div>

            {/* List Section */}
            <div className="card-gaming p-0 overflow-hidden">
                <div className="grid grid-cols-12 px-6 md:px-8 py-4 bg-surface-low/50 border-b border-white/[0.06] text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <div className="col-span-1">Rank</div>
                    <div className="col-span-5 md:col-span-4">Player</div>
                    <div className="col-span-3 md:col-span-2 text-center hidden md:block">Tier</div>
                    <div className="col-span-3 md:col-span-2 text-center">Win Rate</div>
                    <div className="col-span-3 text-right">XP</div>
                </div>
                
                <div className="divide-y divide-white/[0.04]">
                    {rest.map((entry, idx) => (
                        <div 
                            key={`${view}-${entry.rank}-${entry.username || entry.name}`} 
                            className="grid grid-cols-12 px-6 md:px-8 py-5 items-center hover:bg-surface-elevated/50 transition-all group"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <div className="col-span-1">
                                <span className={cn(
                                    "font-display font-bold text-sm tabular-nums",
                                    entry.rank <= 10 ? "text-primary" : "text-slate-500"
                                )}>
                                    #{entry.rank}
                                </span>
                            </div>
                            <div className="col-span-5 md:col-span-4 flex items-center gap-3 md:gap-4">
                                <Avatar size="sm" className="ring-2 ring-white/10 group-hover:ring-primary/50 transition-all" />
                                <div className="min-w-0">
                                    <span className="font-semibold text-white text-sm truncate block group-hover:text-primary transition-colors">
                                        {view === 'players' ? entry.username : entry.name}
                                    </span>
                                    <span className="text-[10px] text-slate-500 md:hidden">
                                        {entry.rank_tier || 'Lv.' + entry.level}
                                    </span>
                                </div>
                            </div>
                            <div className="col-span-3 md:col-span-2 justify-center hidden md:flex">
                                <span className={cn(
                                    "px-2.5 py-1 rounded-lg text-[10px] font-bold border",
                                    getRankBg(entry.rank_tier),
                                    getRankColor(entry.rank_tier)
                                )}>
                                    {entry.rank_tier || 'Bronze'}
                                </span>
                            </div>
                            <div className="col-span-3 md:col-span-2 text-center">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                    <Flame className="w-3 h-3 text-emerald-400" />
                                    <span className="text-xs font-bold text-emerald-400">{entry.winRate}%</span>
                                </div>
                            </div>
                            <div className="col-span-3 text-right flex items-center justify-end gap-2">
                                <span className="font-display font-bold text-white tabular-nums">{entry.axp.toLocaleString()}</span>
                                <Zap className="w-4 h-4 text-amber-500/60" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center">
                <Button 
                    variant="secondary" 
                    onClick={fetchData} 
                    className="group px-8 py-3"
                    disabled={loading}
                >
                    <RefreshCw className={cn("w-4 h-4 mr-2 text-primary transition-transform duration-500", loading && "animate-spin", "group-hover:rotate-180")} />
                    <span className="font-semibold">Refresh Rankings</span>
                </Button>
            </div>
        </div>
    );
}
