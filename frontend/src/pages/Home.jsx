import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Trophy, PlusSquare, Zap, ChevronRight, BarChart3, Globe, Sparkles, Target, Users, Crown, Gamepad2, Shield, Flame, Star, TrendingUp } from 'lucide-react';
import { cn } from '../utils/cn';

export default function Home() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const topSetups = [
        { id: 1, user: 'NovaKing', points: 4500, rank: 'Grandmaster', avatar: null },
        { id: 2, user: 'FlashX', axp: 3800, rank: 'Master', avatar: null },
        { id: 3, user: 'ZeroPing', axp: 2950, rank: 'Diamond', avatar: null }
    ];

    const features = [
        { icon: Target, title: 'AI Sensitivity Engine', desc: 'Calculate your perfect aim settings', color: 'from-cyan-500 to-blue-500' },
        { icon: Trophy, title: 'Global Tournaments', desc: 'Compete for prizes & glory', color: 'from-amber-500 to-orange-500' },
        { icon: Users, title: 'Guild System', desc: 'Team up with elite players', color: 'from-purple-500 to-pink-500' },
        { icon: Shield, title: 'Premium Presets', desc: 'Pro-tier configurations', color: 'from-emerald-500 to-teal-500' },
    ];

    if (!user) {
        return (
            <div className="relative min-h-[90vh] flex flex-col items-center justify-center py-20 px-6 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-cyan/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/[0.02] rounded-full" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/[0.03] rounded-full" />
                </div>

                <div className="relative max-w-5xl text-center space-y-10 animate-fade-in z-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                        </span>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">XP Arena v5.0 - Next-Gen Gaming Platform</span>
                    </div>
                    
                    {/* Hero Title */}
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black text-white tracking-tight leading-[0.9]">
                        Dominate the
                        <span className="block text-gradient mt-2">Gaming Arena</span>
                    </h1>
                    
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                        The ultimate platform for competitive mobile gamers. AI-powered sensitivity tools, global tournaments, guilds, and elite configurations.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button 
                            variant="primary" 
                            size="lg" 
                            className="px-10 py-4 text-base btn-gaming group" 
                            onClick={() => navigate('/signup')}
                        >
                            <Gamepad2 className="mr-2 w-5 h-5" />
                            Enter the Arena
                            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button 
                            variant="outline" 
                            size="lg" 
                            className="px-10 py-4 text-base border-white/10 hover:border-primary/50 hover:bg-primary/5" 
                            onClick={() => navigate('/login')}
                        >
                            Sign In
                        </Button>
                    </div>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 max-w-3xl mx-auto">
                        {[
                            { value: '50K+', label: 'Active Players', icon: Users },
                            { value: '12K', label: 'Presets Created', icon: Target },
                            { value: '500+', label: 'Tournaments', icon: Trophy },
                            { value: '99.9%', label: 'Uptime', icon: Zap },
                        ].map((stat, i) => (
                            <div key={i} className="stat-card group hover:border-primary/20 transition-all">
                                <stat.icon className="w-5 h-5 text-primary/60 mb-3 group-hover:text-primary transition-colors" />
                                <p className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">{stat.value}</p>
                                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-12">
                        {features.map((feature, i) => (
                            <div 
                                key={i} 
                                className="card-gaming p-6 text-left group cursor-pointer"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br",
                                    feature.color,
                                    "shadow-lg"
                                )}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-white mb-1">{feature.title}</h3>
                                <p className="text-sm text-slate-500">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Logged in user dashboard
    return (
        <div className="space-y-8 pb-12 animate-fade-in">
            {/* User Hero Section */}
            <div className="card-gaming p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
                
                <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Avatar size="xl" alt={user.username} className="w-20 h-20 ring-4 ring-primary/20" />
                            <div className="absolute -bottom-1 -right-1 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Lv.{Math.floor(user.axp / 100) || 1}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Welcome back, Commander</p>
                            <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
                                {user.username}
                            </h1>
                            <div className="flex items-center gap-3 mt-2">
                                <span className={cn(
                                    "rank-badge",
                                    user.rank === 'Legend' ? 'rank-legend' :
                                    user.rank === 'Grandmaster' ? 'rank-grandmaster' :
                                    user.rank === 'Master' ? 'rank-master' :
                                    user.rank === 'Diamond' ? 'rank-diamond' :
                                    user.rank === 'Platinum' ? 'rank-platinum' :
                                    user.rank === 'Gold' ? 'rank-gold' :
                                    user.rank === 'Silver' ? 'rank-silver' : 'rank-bronze'
                                )}>
                                    <Crown className="w-3 h-3" />
                                    {user.rank || 'Bronze'}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                        <div className="stat-card flex items-center gap-4 !p-4">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                <Zap className="w-6 h-6 text-amber-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Credits</p>
                                <p className="font-display font-bold text-white text-2xl tracking-tight">
                                    {user.axp?.toLocaleString() || 0}
                                </p>
                            </div>
                        </div>
                        
                        <div className="stat-card flex items-center gap-4 !p-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Win Rate</p>
                                <p className="font-display font-bold text-white text-2xl tracking-tight">
                                    {user.winRate || '68'}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* XP Progress Bar */}
                <div className="mt-8 relative">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-slate-400">Level Progress</span>
                        <span className="text-xs font-bold text-primary">{(user.axp % 100) || 0}/100 XP</span>
                    </div>
                    <div className="h-2 bg-surface-low rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-primary to-accent-cyan rounded-full transition-all duration-500 relative"
                            style={{ width: `${(user.axp % 100) || 45}%` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { icon: Target, title: 'Generate Sens', desc: 'AI-powered settings', path: '/generate-sensitivity', color: 'bg-cyan-500/10 text-cyan-400' },
                    { icon: PlusSquare, title: 'Submit Preset', desc: 'Share your config', path: '/submit', color: 'bg-purple-500/10 text-purple-400' },
                    { icon: Trophy, title: 'Tournaments', desc: 'Compete & win', path: '/tournaments', color: 'bg-amber-500/10 text-amber-400' },
                    { icon: Users, title: 'Guilds', desc: 'Join a team', path: '/guilds', color: 'bg-rose-500/10 text-rose-400' },
                ].map((action, i) => (
                    <div 
                        key={i}
                        onClick={() => navigate(action.path)}
                        className="card-gaming p-6 cursor-pointer group"
                    >
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", action.color)}>
                            <action.icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-white mb-1 group-hover:text-primary transition-colors">{action.title}</h3>
                        <p className="text-sm text-slate-500">{action.desc}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Featured Section */}
                    <div className="card-gaming p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-display font-bold text-white text-lg flex items-center gap-2">
                                <Flame className="w-5 h-5 text-orange-500" />
                                Hot Right Now
                            </h2>
                            <Button variant="ghost" size="sm" onClick={() => navigate('/browse')}>
                                View All
                            </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-primary/20 to-accent-cyan/10 border border-primary/20 rounded-xl p-6 relative overflow-hidden group cursor-pointer" onClick={() => navigate('/generate-sensitivity')}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px]" />
                                <Sparkles className="w-8 h-8 text-primary mb-4" />
                                <h3 className="font-bold text-white text-lg mb-2">AI Sensitivity Calculator</h3>
                                <p className="text-sm text-slate-400 mb-4">Get your perfect aim settings with our advanced AI engine</p>
                                <span className="text-primary text-sm font-semibold group-hover:underline">Try Now</span>
                            </div>
                            
                            <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 rounded-xl p-6 relative overflow-hidden group cursor-pointer" onClick={() => navigate('/premium')}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[40px]" />
                                <Crown className="w-8 h-8 text-amber-500 mb-4" />
                                <h3 className="font-bold text-white text-lg mb-2">Premium Access</h3>
                                <p className="text-sm text-slate-400 mb-4">Unlock exclusive presets, badges, and tournament entries</p>
                                <span className="text-amber-500 text-sm font-semibold group-hover:underline">Upgrade</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="card-gaming p-6">
                        <h2 className="font-display font-bold text-white text-lg mb-6 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-primary" />
                            Your Stats
                        </h2>
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { label: 'Total Matches', value: user.matches || 124 },
                                { label: 'Presets Saved', value: user.presets || 8 },
                                { label: 'Guild Rank', value: '#' + (user.guildRank || 15) },
                            ].map((stat, i) => (
                                <div key={i} className="text-center p-4 bg-surface-low/50 rounded-xl">
                                    <p className="font-display font-bold text-2xl text-white">{stat.value}</p>
                                    <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Leaderboard Preview */}
                    <div className="card-gaming p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-display font-bold text-white flex items-center gap-2">
                                <Globe className="w-5 h-5 text-primary" />
                                Top Players
                            </h3>
                        </div>

                        <div className="space-y-3">
                            {topSetups.map((setup, index) => (
                                <div
                                    key={setup.id}
                                    className="flex items-center justify-between p-3 rounded-xl bg-surface-low/50 hover:bg-surface-low transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-sm",
                                            index === 0 ? "bg-amber-500/20 text-amber-400" :
                                            index === 1 ? "bg-slate-400/20 text-slate-300" :
                                            "bg-orange-700/20 text-orange-400"
                                        )}>
                                            {index + 1}
                                        </div>
                                        <Avatar size="sm" alt={setup.user} />
                                        <div>
                                            <p className="font-semibold text-sm text-white">{setup.user}</p>
                                            <p className="text-[10px] text-slate-500">{setup.rank}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-display font-bold text-sm text-white">{(setup.points || setup.axp)?.toLocaleString()}</p>
                                        <p className="text-[10px] text-primary">XP</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full mt-4 text-slate-400 hover:text-white" 
                            onClick={() => navigate('/leaderboard')}
                        >
                            View Full Leaderboard
                            <ChevronRight className="ml-1 w-4 h-4" />
                        </Button>
                    </div>

                    {/* Daily Quests Teaser */}
                    <div className="card-gaming p-6 border-accent-amber/20">
                        <div className="flex items-center gap-2 mb-4">
                            <Star className="w-5 h-5 text-amber-500" />
                            <h3 className="font-display font-bold text-white">Daily Quests</h3>
                        </div>
                        <p className="text-sm text-slate-400 mb-4">Complete quests to earn bonus XP and exclusive rewards!</p>
                        <Button variant="secondary" size="sm" className="w-full" onClick={() => navigate('/quests')}>
                            View Quests
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
