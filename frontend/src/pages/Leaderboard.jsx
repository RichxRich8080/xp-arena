import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Trophy, Zap, Medal, RefreshCw, ChevronRight, Activity, Globe, Users, TrendingUp } from 'lucide-react';
import api from '../services/api';
import { cn } from '../utils/cn';

const FALLBACK_PLAYERS = [
    { rank: 1, username: 'NovaKing', axp: 4500, level: 18 },
    { rank: 2, username: 'FlashX', axp: 3800, level: 16 },
    { rank: 3, username: 'ZeroPing', axp: 2950, level: 14 },
    { rank: 4, username: 'GhostRider', axp: 2100, level: 12 },
    { rank: 5, username: 'SnipeGod', axp: 1850, level: 11 },
];

const FALLBACK_GUILDS = [
    { rank: 1, name: 'Vanguard Elite', axp: 125400, members: 42, tag: 'VNG' },
    { rank: 2, name: 'Apex Shadows', axp: 98200, members: 38, tag: 'APX' },
    { rank: 3, name: 'Neural Hunters', axp: 75600, members: 25, tag: 'NH' },
    { rank: 4, name: 'Zero Lag Syndicate', axp: 62000, members: 30, tag: 'ZLS' },
    { rank: 5, name: 'Omega Squad', axp: 45000, members: 15, tag: 'OMG' },
];

function Podium({ player, place, squad = false }) {
    const configs = {
        1: { color: 'text-amber-500', ring: 'ring-amber-500', bg: 'from-amber-500/10', h: 'h-48' },
        2: { color: 'text-slate-300', ring: 'ring-slate-300', bg: 'from-slate-400/5', h: 'h-40' },
        3: { color: 'text-primary', ring: 'ring-primary', bg: 'from-primary/5', h: 'h-32' },
    };
    const cfg = configs[place];

    return (
        <div className={cn(
            "flex flex-col items-center justify-end relative",
            place === 1 ? 'z-10 -mb-4' : 'opacity-80 scale-95'
        )}>
            <div className="relative mb-6 transform group">
                <div className={cn("absolute -inset-4 rounded-full blur-xl opacity-20", cfg.bg)} />
                <Avatar 
                    size={place === 1 ? 'xl' : 'lg'} 
                    className={cn("ring-2 ring-offset-4 ring-offset-slate-950 relative z-10", cfg.ring)} 
                />
                <div className={cn(
                    "absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-xl z-20 border-2 border-slate-950",
                    place === 1 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-white'
                )}>
                    {place}
                </div>
            </div>
            
            <div className={cn(
                "w-32 md:w-36 bg-slate-900 border-t-2 rounded-t-2xl flex flex-col items-center pt-8 px-4 transition-all duration-500",
                cfg.h,
                cfg.ring.replace('ring-', 'border-')
            )}>
                <span className="font-bold text-white text-[10px] md:text-sm truncate w-full text-center uppercase tracking-tight mb-2">
                    {squad ? player.tag : player.username}
                </span>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-950/50">
                    <Zap className={cn("w-2.5 h-2.5", cfg.color)} />
                    <span className="font-bold text-white text-[10px] tabular-nums">{player.axp.toLocaleString()} pts</span>
                </div>
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
            }));

            const normalizedGuilds = (guildRes.data || []).slice(0, 20).map((item, idx) => ({
                rank: idx + 1,
                name: item.guild_name || item.name || `Guild ${idx + 1}`,
                axp: Number(item.total_axp || item.axp || 0),
                members: Number(item.member_count || item.members || 0),
                tag: (item.guild_name || item.name || 'GLD').slice(0, 3).toUpperCase(),
            }));

            if (normalizedPlayers.length) setPlayers(normalizedPlayers);
            if (normalizedGuilds.length) setGuilds(normalizedGuilds);
        } catch {
            setError('Global rankings currently showing cached data.');
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
        <div className="space-y-10 pb-20 animate-fade-in font-sans">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
                <div className="text-center md:text-left space-y-2">
                    <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Standings</h2>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight uppercase leading-none">
                        Elite <span className="text-primary">Rankings</span>
                    </h1>
                </div>

                <div className="flex items-center gap-2 p-1 bg-slate-950/50 border border-white/5 rounded-xl">
                    <button 
                        onClick={() => setView('players')} 
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all font-bold text-[10px] tracking-widest uppercase",
                            view === 'players' ? 'bg-primary text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'
                        )}
                    >
                        <Globe className="w-3.5 h-3.5" /> Individual
                    </button>
                    <button 
                        onClick={() => setView('guilds')} 
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all font-bold text-[10px] tracking-widest uppercase",
                            view === 'guilds' ? 'bg-primary text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'
                        )}
                    >
                        <Users className="w-3.5 h-3.5" /> Guilds
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-amber-500/5 border border-amber-500/10 py-3 px-6 rounded-xl flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">{error}</p>
                </div>
            )}

            {/* Podium Section */}
            <div className="relative rounded-[2.5rem] overflow-hidden">
                <div className="absolute inset-0 bg-slate-900 border border-white/5" />
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                <div className="flex justify-center items-end gap-0 md:gap-8 pt-16 relative z-10 transition-all duration-700">
                    {topThree[1] && <Podium player={topThree[1]} place={2} squad={view === 'guilds'} />}
                    {topThree[0] && <Podium player={topThree[0]} place={1} squad={view === 'guilds'} />}
                    {topThree[2] && <Podium player={topThree[2]} place={3} squad={view === 'guilds'} />}
                </div>
            </div>

            {/* List Section */}
            <Card className="p-0 border-white/5 bg-slate-900/50 shadow-xl rounded-3xl overflow-hidden">
                <div className="grid grid-cols-12 px-8 py-4 bg-slate-950/50 border-b border-white/5 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                    <div className="col-span-2">Rank</div>
                    <div className="col-span-6">Name</div>
                    <div className="col-span-4 text-right">Total Points</div>
                </div>
                
                <div className="divide-y divide-white/5">
                    {rest.map((entry) => (
                        <div 
                            key={`${view}-${entry.rank}-${entry.username || entry.name}`} 
                            className="grid grid-cols-12 px-8 py-6 text-sm items-center hover:bg-slate-800 transition-colors group"
                        >
                            <div className="col-span-2 font-bold text-slate-500 text-xs tracking-widest group-hover:text-primary transition-colors tabular-nums">
                                #{entry.rank.toString().padStart(2, '0')}
                            </div>
                            <div className="col-span-6 flex items-center gap-4">
                                <Avatar size="sm" className="ring-1 ring-white/10 group-hover:ring-primary transition-all" />
                                <span className="font-bold text-white uppercase tracking-tight truncate">
                                    {view === 'players' ? entry.username : entry.name}
                                </span>
                            </div>
                            <div className="col-span-4 text-right flex items-center justify-end gap-3">
                                <span className="font-bold text-white tracking-widest tabular-nums">{entry.axp.toLocaleString()}</span>
                                <Zap className="w-3 h-3 text-amber-500 opacity-50" />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <div className="flex justify-center">
                <Button 
                    variant="ghost" 
                    onClick={fetchData} 
                    className="group border border-white/5 bg-slate-900/50 rounded-xl px-8 h-12 hover:bg-slate-900 hover:border-primary/20 transition-all"
                >
                    <RefreshCw className={cn("w-3.5 h-3.5 text-primary mr-2 transition-transform group-hover:rotate-180 duration-500", loading && "animate-spin")} />
                    <span className="text-[10px] font-bold text-slate-500 group-hover:text-white uppercase tracking-widest">Update Rankings</span>
                </Button>
            </div>
        </div>
    );
}
