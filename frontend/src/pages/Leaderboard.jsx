import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Trophy, Zap, Medal, RefreshCw } from 'lucide-react';
import api from '../services/api';

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
    const styles = {
        1: { ring: 'ring-yellow-400', h: 'h-32', medal: Trophy },
        2: { ring: 'ring-gray-300', h: 'h-24', medal: Medal },
        3: { ring: 'ring-amber-600', h: 'h-20', medal: Medal },
    };
    const C = styles[place].medal;

    return (
        <div className={`flex flex-col items-center justify-end ${place === 1 ? 'mb-4 z-10' : ''}`}>
            <div className="relative mb-2">
                <C className="absolute -top-7 left-1/2 -translate-x-1/2 w-6 h-6 text-yellow-400" />
                <Avatar size={place === 1 ? 'lg' : 'md'} className={`ring-4 ${styles[place].ring} ring-offset-4 ring-offset-[#0b0f1a]`} />
                <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gray-900 border-2 ${styles[place].ring} flex items-center justify-center`}>
                    <span className="text-xs font-black">{place}</span>
                </div>
            </div>
            <div className={`w-24 bg-gradient-to-t from-gray-900 to-gray-800 border-t-2 ${styles[place].ring} rounded-t-xl flex flex-col items-center pt-4 ${styles[place].h}`}>
                <span className="font-bold text-gray-200 text-xs truncate w-full text-center px-1">{squad ? player.tag : player.username}</span>
                <span className="text-xs font-black text-axp-gold mt-1 flex items-center">{player.axp} <Zap className="w-3 h-3 ml-0.5" /></span>
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
            setError('Live leaderboard is temporarily unavailable. Showing cached arena standings.');
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
        <div className="max-w-4xl mx-auto space-y-6 pb-6 animate-slide-in">
            <div className="text-center pt-2">
                <h1 className="text-3xl font-black text-white uppercase tracking-widest">Arena Legends</h1>
                <p className="text-sm text-gray-400 mt-1">Competitive rankings with live fallback handling.</p>
            </div>

            <Card className="theme-surface p-4">
                <div className="flex flex-wrap gap-2 justify-between items-center">
                    <div className="bg-black/30 p-1 rounded-2xl border border-gray-800 flex gap-1">
                        <button onClick={() => setView('areni')} className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'areni' ? 'bg-axp-gold text-gray-900' : 'text-gray-400'}`}>Arenis</button>
                        <button onClick={() => setView('squads')} className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'squads' ? 'bg-axp-gold text-gray-900' : 'text-gray-400'}`}>Squads</button>
                    </div>
                    <button onClick={fetchData} className="inline-flex items-center gap-2 text-xs text-gray-300 hover:text-white">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </button>
                </div>
                {error && <p className="mt-3 text-xs text-yellow-300">{error}</p>}
            </Card>

            <Card className="p-6 theme-surface">
                <div className="flex justify-center items-end gap-4 sm:gap-8">
                    {topThree[1] && <Podium player={topThree[1]} place={2} squad={view === 'squads'} />}
                    {topThree[0] && <Podium player={topThree[0]} place={1} squad={view === 'squads'} />}
                    {topThree[2] && <Podium player={topThree[2]} place={3} squad={view === 'squads'} />}
                </div>
            </Card>

            <Card className="p-3 sm:p-4 theme-surface">
                <div className="grid grid-cols-12 px-3 py-2 text-[11px] uppercase tracking-widest text-gray-400 border-b border-gray-800/80">
                    <div className="col-span-2">Rank</div>
                    <div className="col-span-6">{view === 'areni' ? 'Areni' : 'Squad'}</div>
                    <div className="col-span-4 text-right">AXP</div>
                </div>
                <div className="divide-y divide-gray-800/60">
                    {rest.map((entry) => (
                        <div key={`${view}-${entry.rank}-${entry.username || entry.name}`} className="grid grid-cols-12 px-3 py-3 text-sm items-center">
                            <div className="col-span-2 text-gray-400 font-bold">#{entry.rank}</div>
                            <div className="col-span-6 text-gray-200 font-semibold truncate">{view === 'areni' ? entry.username : entry.name}</div>
                            <div className="col-span-4 text-right text-axp-gold font-bold">{entry.axp.toLocaleString()}</div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
