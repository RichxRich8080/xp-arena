import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Trophy, PlusSquare, Zap, ChevronRight, BarChart3, Globe } from 'lucide-react';
import { cn } from '../utils/cn';

export default function Home() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const topSetups = [
        { id: 1, user: 'NovaKing', points: 4500, rank: 'Elite' },
        { id: 2, user: 'FlashX', axp: 3800, rank: 'Legend' },
        { id: 3, user: 'ZeroPing', axp: 2950, rank: 'Champion' }
    ];

    if (!user) {
        return (
            <div className="relative min-h-[80vh] flex flex-col items-center justify-center py-20 px-6">
                <div className="max-w-4xl text-center space-y-8 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Version 4.5.0 Deployment</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
                        Elevate your <span className="text-primary">Performance</span> in the Arena
                    </h1>
                    
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Access elite configurations, track your progression, and join the global rankings in the most advanced gamer utility platform.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                        <Button variant="primary" size="lg" className="px-8 py-3 group" onClick={() => navigate('/signup')}>
                            Get Started
                            <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button variant="outline" size="lg" className="px-8 py-3" onClick={() => navigate('/login')}>
                            Sign In
                        </Button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-12 pt-16 border-t border-white/5 max-w-2xl mx-auto">
                        <div>
                            <p className="text-2xl font-bold text-white tracking-tight">50K+</p>
                            <p className="text-xs text-slate-500 font-medium">Active Players</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white tracking-tight">12K</p>
                            <p className="text-xs text-slate-500 font-medium">Presets Saved</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white tracking-tight">Low Latency</p>
                            <p className="text-xs text-slate-500 font-medium">Optimization</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-12 animate-fade-in">
            {/* User Hero Section */}
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Welcome back</p>
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        Hello, <span className="text-primary">{user.username}</span>
                    </h1>
                </div>
                
                <div className="bg-slate-800/50 border border-white/5 px-6 py-4 rounded-xl flex items-center gap-4 shadow-sm group">
                    <Zap className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Points Balance</p>
                        <p className="font-bold text-white text-xl tracking-tight leading-none">
                            {user.axp} <span className="text-amber-500 text-sm font-medium">Credits</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Action Hub */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="flex flex-col justify-between p-8 hover:bg-slate-800/50 transition-colors group border-white/5">
                        <div>
                            <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6 border border-blue-500/20">
                                <PlusSquare className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-white tracking-tight mb-2">Create Preset</h3>
                            <p className="text-sm text-slate-400 font-medium leading-relaxed">
                                Submit your configurations to the community and earn Points for every upload.
                            </p>
                        </div>
                        <Button
                            variant="primary"
                            size="md"
                            className="mt-8 group w-full"
                            onClick={() => navigate('/submit')}
                        >
                            Get Started
                            <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Card>

                    <Card className="flex flex-col justify-between p-8 hover:bg-slate-800/50 transition-colors group border-white/5">
                        <div>
                            <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6 border border-purple-500/20">
                                <BarChart3 className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white tracking-tight mb-2">Performance Center</h3>
                            <p className="text-sm text-slate-400 font-medium leading-relaxed">
                                Current Rank: <span className="text-purple-400 font-bold">{user.rank === 'Elite' ? 'Elite' : user.rank}</span>. Reach 5,000 Points for Elite status.
                            </p>
                        </div>
                        <Button
                            variant="secondary"
                            size="md"
                            className="mt-8 w-full"
                            onClick={() => navigate('/leaderboard')}
                        >
                            View Stats
                        </Button>
                    </Card>
                </div>

                {/* Sidebar Rankings */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            Featured Rankings
                        </h3>
                    </div>

                    <div className="space-y-2">
                        {topSetups.map((setup, index) => (
                            <div
                                key={setup.id}
                                className="bg-slate-800/30 border border-white/5 p-4 flex items-center justify-between rounded-lg hover:bg-slate-800/50 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded bg-slate-700/50 flex items-center justify-center text-[10px] font-bold text-slate-500 group-hover:text-primary transition-colors">
                                        {index + 1}
                                    </div>
                                    <Avatar size="sm" alt={setup.user} className="border-none" />
                                    <div>
                                    <p className="font-bold text-sm text-white">{setup.user}</p>
                                    <p className="text-[10px] text-slate-500 font-medium">{setup.rank === 'Elite' ? 'Elite' : setup.rank}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-sm text-white">{setup.axp}</p>
                                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">Points</p>
                            </div>
                        </div>
                        ))}
                    </div>
                    <Button variant="ghost" size="sm" className="w-full text-slate-500" onClick={() => navigate('/leaderboard')}>
                        View Global Leaderboard
                    </Button>
                </div>
            </div>
        </div>
    );
}
