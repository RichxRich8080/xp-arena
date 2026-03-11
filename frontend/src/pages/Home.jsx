import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Trophy, PlusSquare, Zap, ChevronRight } from 'lucide-react';

export default function Home() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Mock recent setups for dashboard
    const topSetups = [
        { id: 1, user: 'NovaKing', axp: 4500, rank: 'Arena Master' },
        { id: 2, user: 'FlashX', axp: 3800, rank: 'Legend' },
        { id: 3, user: 'ZeroPing', axp: 2950, rank: 'Champion' }
    ];

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-lg mx-auto p-4 space-y-8 animate-slide-in">
                <div className="space-y-4 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary-blue/30 blur-[40px] rounded-full z-0"></div>
                    <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-500 relative z-10 leading-tight">
                        THE ULTIMATE <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-cyan drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                            ESPORTS HUB
                        </span>
                    </h1>
                    <p className="text-gray-400 font-medium z-10 relative mt-2">
                        Share perfect sensitivity setups, earn AXP, and dominate the Arena leaderboards.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto relative z-10">
                    <Button variant="neonGreen" className="w-full sm:w-48 py-3" onClick={() => navigate('/signup')}>
                        Join Arena
                    </Button>
                    <Button variant="outline" className="w-full sm:w-48 py-3" onClick={() => navigate('/login')}>
                        Login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-6 animate-slide-in">
            {/* Welcome & Stats Row */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest">Welcome Back</h2>
                    <h1 className="text-2xl font-bold mt-1 text-gray-100">{user.username}</h1>
                </div>
                <div className="flex items-center gap-3 bg-gray-900/80 border border-gray-800 py-1.5 px-3 rounded-full">
                    <Zap className="w-4 h-4 text-axp-gold glow-gold" />
                    <span className="font-bold text-sm tracking-wide text-gray-200">{user.axp} AXP</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Quick Submit Card */}
                <Card className="flex flex-col justify-between border border-neon-cyan/20 bg-gradient-to-br from-gray-900 to-[#0b1b2f]">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-lg text-neon-cyan tracking-wide">Submit Setup</h3>
                            <PlusSquare className="w-5 h-5 text-neon-cyan opacity-80" />
                        </div>
                        <p className="text-xs text-gray-400 font-medium">Earn +50 AXP for sharing your elite settings.</p>
                    </div>
                    <Button
                        variant="neonCyan"
                        size="sm"
                        className="mt-6 w-full text-sm font-bold tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                        onClick={() => navigate('/submit')}
                    >
                        CREATE NEW
                    </Button>
                </Card>

                {/* Current Rank Card */}
                <Card className="flex flex-col justify-between border-gray-800 bg-gray-900">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Current Rank</p>
                            <h3 className="text-xl font-bold mt-1 bg-clip-text text-transparent bg-gradient-to-r from-axp-gold to-yellow-200 drop-shadow-[0_0_5px_rgba(251,191,36,0.3)]">
                                {user.rank}
                            </h3>
                        </div>
                        <Trophy className="w-8 h-8 text-axp-gold/50" />
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-800/50 flex justify-between items-center text-xs text-gray-400 font-medium">
                        <span>{user.setups || 0} Setups Shared</span>
                        <span className="text-neon-green">+20 AXP Daily Reward Available!</span>
                    </div>
                </Card>
            </div>

            {/* Leaderboard Preview */}
            <div className="mt-8 space-y-3">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-300 tracking-wider">Top Arenis</h3>
                    <button
                        onClick={() => navigate('/leaderboard')}
                        className="text-xs font-medium text-primary-blue hover:text-neon-cyan transition-colors flex items-center"
                    >
                        View All <ChevronRight className="w-3 h-3 ml-1" />
                    </button>
                </div>

                <div className="space-y-2">
                    {topSetups.map((setup, index) => (
                        <div
                            key={setup.id}
                            className="bg-gray-900 border border-gray-800/80 rounded-xl p-3 flex items-center justify-between hover:bg-gray-800/60 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-6 text-center font-bold text-gray-500 text-sm">#{index + 1}</div>
                                <Avatar size="sm" alt={setup.user} className="ring-1 ring-gray-700" />
                                <div>
                                    <p className="font-bold text-sm text-gray-200">{setup.user}</p>
                                    <p className="text-[10px] text-axp-gold font-medium uppercase tracking-wider">{setup.rank}</p>
                                </div>
                            </div>
                            <div className="font-bold text-sm text-gray-300">
                                {setup.axp} <span className="text-xs text-gray-600 font-medium ml-0.5">AXP</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
