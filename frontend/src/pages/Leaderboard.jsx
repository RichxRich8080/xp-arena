import React from 'react';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Trophy, Zap, Medal } from 'lucide-react';

const PodiumAvatar = ({ player, place }) => {
    const isFirst = place === 1;
    const styles = {
        1: { color: 'text-yellow-400', glow: 'shadow-[0_0_30px_rgba(250,204,21,0.5)]', ring: 'ring-yellow-400', height: 'h-32' },
        2: { color: 'text-gray-300', glow: 'shadow-[0_0_20px_rgba(209,213,219,0.3)]', ring: 'ring-gray-300', height: 'h-24' },
        3: { color: 'text-amber-600', glow: 'shadow-[0_0_20px_rgba(217,119,6,0.3)]', ring: 'ring-amber-600', height: 'h-20' },
    };

    const s = styles[place];

    return (
        <div className={`flex flex-col items-center justify-end ${isFirst ? 'mb-4 z-10' : 'mb-0'}`}>
            <div className="relative mb-2">
                {isFirst && <Trophy className={`absolute -top-8 left-1/2 -translate-x-1/2 w-8 h-8 ${s.color} drop-shadow-lg`} />}
                {!isFirst && <Medal className={`absolute -top-6 left-1/2 -translate-x-1/2 w-6 h-6 ${s.color} drop-shadow-md`} />}

                <Avatar
                    size={isFirst ? 'lg' : 'md'}
                    className={`ring-4 ${s.ring} ring-offset-4 ring-offset-[#0b0f1a] ${s.glow} transition-transform hover:scale-110`}
                />
                <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gray-900 border-2 ${s.ring} flex items-center justify-center`}>
                    <span className={`text-xs font-black ${s.color}`}>{place}</span>
                </div>
            </div>

            <div className={`w-24 bg-gradient-to-t from-gray-900 to-gray-800 border-t-2 ${s.ring} rounded-t-xl flex flex-col items-center pt-4 ${s.height}`}>
                <span className="font-bold text-gray-200 text-sm truncate w-full text-center px-1">{player.username}</span>
                <span className="text-xs font-black text-axp-gold mt-1 flex items-center">
                    {player.axp} <Zap className="w-3 h-3 ml-0.5" />
                </span>
            </div>
        </div>
    );
};

export default function Leaderboard() {
    const [view, setView] = React.useState('areni'); // 'areni' or 'squads'

    // Mock Leaderboard Data
    const leaderboardData = [
        { rank: 1, username: 'NovaKing', axp: 4500, tier: 'Arena Master', setups: 12 },
        { rank: 2, username: 'FlashX', axp: 3800, tier: 'Legend', setups: 9 },
        { rank: 3, username: 'ZeroPing', axp: 2950, tier: 'Champion', setups: 15 },
        { rank: 4, username: 'GhostRider', axp: 2100, tier: 'Champion', setups: 4 },
        { rank: 5, username: 'SnipeGod', axp: 1850, tier: 'Elite', setups: 6 },
        { rank: 6, username: 'Areni101', axp: 1200, tier: 'Elite', setups: 2 },
        { rank: 7, username: 'BotSlayer', axp: 850, tier: 'Grinder', setups: 1 },
        { rank: 8, username: 'NoobMaster', axp: 400, tier: 'Grinder', setups: 0 },
        { rank: 9, username: 'RushB', axp: 150, tier: 'Rookie', setups: 1 },
        { rank: 10, username: 'CamperPro', axp: 50, tier: 'Rookie', setups: 0 },
    ];

    const clanData = [
        { rank: 1, name: 'Vanguard Elite', axp: 125400, members: 42, setups: 450, tag: 'VNG' },
        { rank: 2, name: 'Apex Shadows', axp: 98200, members: 38, setups: 310, tag: 'APX' },
        { rank: 3, name: 'Neural Hunters', axp: 75600, members: 25, setups: 220, tag: 'NH' },
        { rank: 4, name: 'Zero Lag Syndicate', axp: 62000, members: 30, setups: 180, tag: 'ZLS' },
        { rank: 5, name: 'Omega Squad', axp: 45000, members: 15, setups: 120, tag: 'OMG' },
    ];

    const topThree = view === 'areni' ? leaderboardData.slice(0, 3) : clanData.slice(0, 3);
    const restOfList = view === 'areni' ? leaderboardData.slice(3) : clanData.slice(3);

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-6 animate-slide-in">
            <div className="text-center mb-10 pt-4">
                <h1 className="text-3xl font-black text-white uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-axp-gold to-yellow-600 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                    Arena Legends
                </h1>
                <p className="text-sm text-gray-400 mt-2">The most prestigious {view === 'areni' ? 'setup creators' : 'squad collectives'}</p>
            </div>

            {/* View Toggle */}
            <div className="flex justify-center mb-8">
                <div className="bg-gray-900/50 p-1 rounded-2xl border border-gray-800 flex gap-1">
                    <button
                        onClick={() => setView('areni')}
                        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'areni' ? 'bg-axp-gold text-gray-900 shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Arenis
                    </button>
                    <button
                        onClick={() => setView('squads')}
                        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'squads' ? 'bg-axp-gold text-gray-900 shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Squads
                    </button>
                </div>
            </div>

            {/* Podium Section */}
            <div className="flex justify-center items-end gap-2 sm:gap-6 mb-12 px-2">
                <PodiumAvatar player={view === 'areni' ? topThree[1] : { username: topThree[1].name, axp: topThree[1].axp }} place={2} />
                <PodiumAvatar player={view === 'areni' ? topThree[0] : { username: topThree[0].name, axp: topThree[0].axp }} place={1} />
                <PodiumAvatar player={view === 'areni' ? topThree[2] : { username: topThree[2].name, axp: topThree[2].axp }} place={3} />
            </div>

            {/* List Section */}
            <Card className="p-0 overflow-hidden bg-gray-900/50 backdrop-blur-xl border border-gray-800">
                <div className="bg-gray-800/50 p-4 border-b border-gray-800 grid grid-cols-12 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-2 sm:col-span-1 text-center">#</div>
                    <div className="col-span-6 sm:col-span-5 text-left">{view === 'areni' ? 'Areni' : 'Squad Name'}</div>
                    <div className="hidden sm:block col-span-3 text-center">{view === 'areni' ? 'Rankings' : 'Members'}</div>
                    <div className="col-span-4 sm:col-span-3 text-right pr-4">Score</div>
                </div>

                <div className="divide-y divide-gray-800/30">
                    {restOfList.map((item) => (
                        <div
                            key={item.rank}
                            className="grid grid-cols-12 p-4 items-center hover:bg-gray-800/40 transition-colors group"
                        >
                            <div className="col-span-2 sm:col-span-1 text-center font-bold text-gray-500 text-sm">
                                {item.rank}
                            </div>

                            <div className="col-span-6 sm:col-span-5 flex items-center gap-3">
                                {view === 'areni' ? (
                                    <>
                                        <Avatar size="sm" className="hidden sm:flex ring-1 ring-gray-700" />
                                        <div>
                                            <h3 className="font-bold text-gray-200 group-hover:text-white transition-colors">
                                                {item.username}
                                            </h3>
                                            <p className="text-[10px] text-gray-500 hidden sm:block">
                                                {item.setups} Setups
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-gray-800 border border-gray-700 flex items-center justify-center text-[10px] font-black text-neon-cyan">
                                            {item.tag}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-200 group-hover:text-white transition-colors">
                                                {item.name}
                                            </h3>
                                            <p className="text-[10px] text-gray-500 hidden sm:block">
                                                {item.setups} Collective Force
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="hidden sm:flex col-span-3 justify-center">
                                <span className="px-2 py-1 rounded bg-gray-800 border border-gray-700 text-[10px] font-medium text-neon-cyan/80 uppercase tracking-widest">
                                    {view === 'areni' ? item.tier : `${item.members} Operators`}
                                </span>
                            </div>

                            <div className="col-span-4 sm:col-span-3 text-right pr-2 flex flex-col items-end">
                                <span className="font-bold text-gray-300 group-hover:text-axp-gold transition-colors flex items-center justify-end uppercase text-xs">
                                    {item.axp.toLocaleString()} <span className="text-[8px] text-gray-600 ml-1">AXP</span>
                                </span>
                                <span className="text-[8px] text-neon-cyan sm:hidden mt-0.5 uppercase font-black">
                                    {view === 'areni' ? item.tier : `${item.members} OP`}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <div className="text-center mt-6">
                <p className="text-xs text-gray-500">Only the top {view === 'areni' ? '100 Arenis' : '20 Squads'} are shown on the global leaderboard.</p>
            </div>
        </div>
    );
}
