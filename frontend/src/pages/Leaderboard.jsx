import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Trophy, Zap, Medal, RefreshCw, ChevronRight, Activity, Globe, Users } from 'lucide-react';
import api from '../services/api';
import { cn } from '../utils/cn';

const FALLBACK_ARENI = [
    { rank: 1, username: 'NovaKing', axp: 4500, level: 18 },
    { rank: 2, username: 'FlashX', axp: 3800, level: 16 },
    { rank: 3, username: 'ZeroPing', axp: 2950, level: 14 },
    { rank: 4, username: 'GhostRider', axp: 2100, level: 12 },
    { rank: 5, username: 'SnipeGod', axp: 1850, level: 11 },
];

const FALLBACK_SQUADS = [
    { rank: 1, name: 'Vanguard Elite', axp: 125400, members: 42, tag: 'VNG' },
    { rank: 2, name: 'Apex Shadows', axp: 98200, members: 38, tag: 'APX' },
    { rank: 3, name: 'Neural Hunters', axp: 75600, members: 25, tag: 'NH' },
    { rank: 4, name: 'Zero Lag Syndicate', axp: 62000, members: 30, tag: 'ZLS' },
    { rank: 5, name: 'Omega Squad', axp: 45000, members: 15, tag: 'OMG' },
];

function Podium({ player, place, squad = false }) {
    const configs = {
        1: { color: 'text-axp-gold', ring: 'ring-axp-gold', bg: 'from-axp-gold/20', h: 'h-48' },
        2: { color: 'text-gray-300', ring: 'ring-gray-300', bg: 'from-accent-cyan/10', h: 'h-40' },
        3: { color: 'text-accent-rose', ring: 'ring-accent-rose', bg: 'from-accent-rose/10', h: 'h-32' },
    };
    const cfg = configs[place];

    return (
        <div className={cn(
            "flex flex-col items-center justify-end relative",
            place === 1 ? 'z-10 -mb-4' : 'opacity-80'
        )}>
            <div className="relative mb-6 transform group">
                <div className={cn("absolute -inset-4 rounded-full blur-xl opacity-20", cfg.bg)} />
                <Avatar 
                    size={place === 1 ? 'xl' : 'lg'} 
                    className={cn("ring-4 ring-offset-8 ring-offset-background relative z-10", cfg.ring)} 
                />
                <div className={cn(
                    "absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-2xl flex items-center justify-center font-display font-black text-xs shadow-2xl z-20 border-4 border-background",
                    place === 1 ? 'bg-axp-gold text-background' : 'bg-white/10 text-white'
                )}>
                    {place}
                </div>
            </div>
            
            <div className={cn(
                "w-32 md:w-40 bg-gradient-to-t to-white/5 border-t-4 rounded-t-3xl flex flex-col items-center pt-8 px-4 transition-all duration-500",
                cfg.bg,
                cfg.ring,
                cfg.h
            )}>
                <span className="font-display font-black text-white text-[10px] md:text-xs truncate w-full text-center uppercase tracking-widest italic mb-2">
                    {squad ? player.tag : player.username}
                </span>
                <div className="flex items-center gap-2">
                    <Zap className={cn("w-3 h-3", cfg.color)} />
                    <span className="font-display font-black text-white text-xs tracking-widest">{player.axp.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}

export default function Leaderboard() {
    const [view, setView] = useState('areni');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [areni, setAreni] = useState(FALLBACK_ARENI);
    const [squads, setSquads] = useState(FALLBACK_SQUADS);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const [lbRes, guildRes] = await Promise.all([
                api.get('/leaderboard'),
                api.get('/guilds/leaderboard')
            ]);

            const normalizedAreni = (lbRes.data || []).slice(0, 20).map((item, idx) => ({
                rank: idx + 1,
                username: item.username || `Player ${idx + 1}`,
                axp: Number(item.axp || item.total_axp || 0),
                level: item.level || 1,
            }));

            const normalizedSquads = (guildRes.data || []).slice(0, 20).map((item, idx) => ({
                rank: idx + 1,
                name: item.guild_name || item.name || `Guild ${idx + 1}`,
                axp: Number(item.total_axp || item.axp || 0),
                members: Number(item.member_count || item.members || 0),
                tag: (item.guild_name || item.name || 'GLD').slice(0, 3).toUpperCase(),
            }));

            if (normalizedAreni.length) setAreni(normalizedAreni);
            if (normalizedSquads.length) setSquads(normalizedSquads);
        } catch {
            setError('LIVE_DATA_OFFLINE_SHOWING_CACHED_ESTIMATES');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const list = view === 'areni' ? areni : squads;
    const topThree = useMemo(() => list.slice(0, 3), [list]);
    const rest = useMemo(() => list.slice(3), [list]);

    return (
        <div className="space-y-10 pb-20 animate-slide-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                    <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                        <Activity className="w-5 h-5 text-accent-cyan" />
                        <h2 className="text-xs font-display font-black text-gray-500 uppercase tracking-[0.3em]">Sector_Standings</h2>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-black text-white italic tracking-tighter uppercase leading-none">
                        ELITE <span className="text-accent-cyan">RANKINGS</span>
                    </h1>
                </div>

                <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/5 rounded-2xl w-fit">
                    <button 
                        onClick={() => setView('areni')} 
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-display font-black text-[10px] tracking-widest uppercase",
                            view === 'areni' ? 'bg-accent-cyan text-background shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'text-gray-500 hover:text-white'
                        )}
                    >
                        <Globe className="w-4 h-4" /> ARENIS
                    </button>
                    <button 
                        onClick={() => setView('squads')} 
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-display font-black text-[10px] tracking-widest uppercase",
                            view === 'squads' ? 'bg-accent-cyan text-background shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'text-gray-500 hover:text-white'
                        )}
                    >
                        <Users className="w-4 h-4" /> SQUADS
                    </button>
                </div>
            </div>

            {error && (
                <div className="glass-panel py-3 px-6 border-axp-gold/20 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-axp-gold animate-pulse" />
                    <p className="text-[10px] font-display font-black text-axp-gold uppercase tracking-wider">{error}</p>
                </div>
            )}

            {/* Podium Section */}
            <div className="relative glass-panel p-12 border-white/5 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                <div className="flex justify-center items-end gap-0 md:gap-8 relative z-10 transition-all duration-700">
                    {topThree[1] && <Podium player={topThree[1]} place={2} squad={view === 'squads'} />}
                    {topThree[0] && <Podium player={topThree[0]} place={1} squad={view === 'squads'} />}
                    {topThree[2] && <Podium player={topThree[2]} place={3} squad={view === 'squads'} />}
                </div>
            </div>

            {/* List Section */}
            <Card className="p-0 border-white/5 overflow-hidden">
                <div className="grid grid-cols-12 px-8 py-4 bg-white/5 border-b border-white/5 text-[9px] font-display font-black uppercase tracking-[0.3em] text-gray-500">
                    <div className="col-span-2">ORD_RK</div>
                    <div className="col-span-6">ARENI_CODENAME</div>
                    <div className="col-span-4 text-right">ACCUMULATED_AXP</div>
                </div>
                
                <div className="divide-y divide-white/5">
                    {rest.map((entry) => (
                        <div 
                            key={`${view}-${entry.rank}-${entry.username || entry.name}`} 
                            className="grid grid-cols-12 px-8 py-6 text-sm items-center hover:bg-white/[0.02] transition-colors group"
                        >
                            <div className="col-span-2 font-display font-black text-gray-500 text-xs tracking-widest group-hover:text-accent-cyan transition-colors">
                                #{entry.rank.toString().padStart(2, '0')}
                            </div>
                            <div className="col-span-6 flex items-center gap-4">
                                <Avatar size="sm" className="ring-1 ring-white/10 group-hover:ring-accent-cyan transition-all" />
                                <span className="font-display font-black text-white uppercase italic tracking-wider truncate">
                                    {view === 'areni' ? entry.username : entry.name}
                                </span>
                            </div>
                            <div className="col-span-4 text-right flex items-center justify-end gap-3">
                                <span className="font-display font-black text-white tracking-[0.2em]">{entry.axp.toLocaleString()}</span>
                                <Zap className="w-3 h-3 text-axp-gold opacity-50" />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <div className="flex justify-center">
                <button 
                    onClick={fetchData} 
                    className="group flex items-center gap-3 px-8 py-4 glass-panel border-white/5 hover:border-accent-cyan/20 transition-all"
                >
                    <RefreshCw className={cn("w-4 h-4 text-accent-cyan", loading && "animate-spin")} />
                    <span className="font-display font-black text-[10px] text-gray-500 group-hover:text-white uppercase tracking-[0.3em]">RE-SYNC_RANKINGS</span>
                </button>
            </div>
        </div>
    );
}
