import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Activity, Shield, ChevronRight, Sparkles, Target, Share2, BarChart3, Zap, Clock, TrendingUp, Crown, Trophy, Users, Gift, Star, Flame, Gamepad2, Crosshair } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getLastGenerationDate } from '../utils/storage';
import { SeasonalProgress } from '../components/dashboard/SeasonalProgress';
import { LiveArenaFeed } from '../components/dashboard/LiveArenaFeed';
import { cn } from '../utils/cn';

const Dashboard = () => {
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const navigate = useNavigate();
    const [remoteStatus, setRemoteStatus] = React.useState(null);

    React.useEffect(() => {
        const fetchStatus = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const res = await fetch('/api/user/status', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data && !data.error) {
                    setRemoteStatus(data);
                }
            } catch {
                console.error('Failed to sync dashboard status');
            }
        };
        fetchStatus();
    }, []);

    const lastGen = remoteStatus?.last_generation_date || getLastGenerationDate();
    const currentPoints = remoteStatus?.points || user?.points || 0;
    const currentLevel = user?.level || Math.floor(currentPoints / 1000) + 1;

    const handleDailyReward = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/user/daily-login', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                addNotification('Daily Reward', `You claimed ${data.axp} Points! Streak: ${data.streak}`, 'success');
                setRemoteStatus(prev => ({ ...prev, axp: (prev?.axp || 0) + data.axp }));
            } else {
                addNotification('Daily Reward', data.error || 'Already claimed today', 'error');
            }
        } catch {
            addNotification('Connection Error', 'Failed to reach the servers.', 'error');
        }
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center p-12 min-h-[60vh]">
                <div className="text-center space-y-4">
                    <Gamepad2 className="w-16 h-16 text-slate-600 mx-auto" />
                    <h2 className="text-2xl font-display font-bold text-white">Welcome to XP Arena</h2>
                    <p className="text-slate-400">Please log in to access your dashboard</p>
                    <Button onClick={() => navigate('/login')} className="btn-gaming">
                        Enter the Arena
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 animate-fade-in pb-12">
            {/* Hero Command Center */}
            <div className="relative overflow-hidden rounded-2xl card-gaming border-primary/10">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-cyan/5 rounded-full blur-[80px]" />
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                </div>
                
                <div className="relative p-8 md:p-10">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                        <div className="space-y-6">
                            {/* Status Badge */}
                            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                </span>
                                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Systems Online - All Services Operational</span>
                            </div>
                            
                            <div>
                                <p className="text-sm text-slate-500 font-medium mb-2">Welcome back, Commander</p>
                                <h1 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight leading-none">
                                    {user.username}
                                </h1>
                            </div>
                            
                            <p className="text-slate-400 text-sm md:text-base max-w-lg leading-relaxed">
                                Your performance metrics are synced. You have <span className="text-primary font-bold">{currentPoints.toLocaleString()} XP</span> available. Ready for your next calibration?
                            </p>
                            
                            <div className="flex flex-wrap gap-3">
                                <Button 
                                    size="md" 
                                    onClick={() => navigate('/generate-sensitivity')} 
                                    className="btn-gaming px-6"
                                >
                                    <Target className="w-4 h-4 mr-2" />
                                    New Calibration
                                </Button>
                                <Button 
                                    variant="secondary" 
                                    size="md" 
                                    onClick={handleDailyReward} 
                                    className="px-6 border-amber-500/20 hover:bg-amber-500/10 hover:border-amber-500/30"
                                >
                                    <Gift className="w-4 h-4 mr-2 text-amber-500" />
                                    Claim Daily Bonus
                                </Button>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 w-full lg:w-auto lg:min-w-[280px]">
                            <div className="stat-card !p-4 space-y-1">
                                <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-amber-500" />
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Level</p>
                                </div>
                                <p className="text-3xl font-display font-bold text-white tracking-tight">{currentLevel}</p>
                            </div>
                            <div className="stat-card !p-4 space-y-1">
                                <div className="flex items-center gap-2">
                                    <Crown className="w-4 h-4 text-primary" />
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Rank</p>
                                </div>
                                <p className={cn(
                                    "text-2xl font-display font-bold tracking-tight",
                                    user.rank === 'Legend' ? 'text-rank-legend' :
                                    user.rank === 'Grandmaster' ? 'text-rank-grandmaster' :
                                    user.rank === 'Master' ? 'text-rank-master' :
                                    user.rank === 'Diamond' ? 'text-rank-diamond' : 'text-white'
                                )}>
                                    {user.rank || 'Bronze'}
                                </p>
                            </div>
                            <div className="stat-card !p-4 col-span-2 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Last Calibration</p>
                                    <p className="text-sm font-bold text-white mt-1">
                                        {lastGen ? new Date(lastGen).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Never'}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-surface-low flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-slate-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { icon: Target, title: 'Generate Sens', desc: 'AI calibration', path: '/generate-sensitivity', color: 'from-cyan-500 to-blue-500', glow: 'shadow-glow-cyan' },
                    { icon: Trophy, title: 'Tournaments', desc: 'Compete now', path: '/tournaments', color: 'from-amber-500 to-orange-500', glow: 'shadow-glow-amber' },
                    { icon: Users, title: 'Guilds', desc: 'Join a team', path: '/guilds', color: 'from-purple-500 to-pink-500', glow: '' },
                    { icon: Gift, title: 'Mystery Box', desc: 'Open rewards', path: '/mystery', color: 'from-rose-500 to-red-500', glow: 'shadow-glow-rose' },
                ].map((action, i) => (
                    <div 
                        key={i}
                        onClick={() => navigate(action.path)}
                        className={cn(
                            "card-gaming p-5 cursor-pointer group",
                            "hover:scale-[1.02] transition-transform duration-200"
                        )}
                    >
                        <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br",
                            action.color,
                            action.glow
                        )}>
                            <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-bold text-white group-hover:text-primary transition-colors">{action.title}</h3>
                        <p className="text-xs text-slate-500 mt-1">{action.desc}</p>
                    </div>
                ))}
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="card-gaming p-6 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 flex items-center justify-center border border-emerald-500/20">
                            <TrendingUp className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Performance Rating</h3>
                            <p className="text-2xl font-display font-bold text-white tracking-tight">Optimal</p>
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-400">+12% this week</span>
                        <Shield className="w-4 h-4 text-slate-600" />
                    </div>
                </div>

                <SeasonalProgress currentAXP={currentPoints} level={currentLevel} />
                
                <div className="card-gaming p-6 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-500/10 flex items-center justify-center border border-rose-500/20">
                            <Flame className="w-6 h-6 text-rose-400" />
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Daily Streak</h3>
                            <p className="text-2xl font-display font-bold text-white tracking-tight">{user.streak || 0} Days</p>
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                        <span className="text-xs font-semibold text-rose-400">Keep it going!</span>
                        <Zap className="w-4 h-4 text-slate-600" />
                    </div>
                </div>
            </div>

            {/* Tools & Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-sm font-display font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Quick Access Tools
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div 
                            className="card-gaming p-8 cursor-pointer group"
                            onClick={() => navigate('/generate-sensitivity')}
                        >
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 flex items-center justify-center mb-6 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                                <Crosshair className="w-7 h-7 text-cyan-400" />
                            </div>
                            <h4 className="text-xl font-display font-bold text-white tracking-tight mb-2">AI Sensitivity Engine</h4>
                            <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                Calculate your perfect aim settings with our advanced AI calibration system.
                            </p>
                            <Button variant="outline" size="sm" className="w-full group-hover:border-primary/50 group-hover:text-primary">
                                Start Calibration
                                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                        
                        <div 
                            className="card-gaming p-8 cursor-pointer group"
                            onClick={() => navigate('/submit')}
                        >
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 flex items-center justify-center mb-6 border border-purple-500/20 group-hover:scale-110 transition-transform">
                                <Share2 className="w-7 h-7 text-purple-400" />
                            </div>
                            <h4 className="text-xl font-display font-bold text-white tracking-tight mb-2">Share Your Setup</h4>
                            <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                Submit your optimized settings to the community and earn XP rewards.
                            </p>
                            <Button variant="outline" size="sm" className="w-full group-hover:border-purple-500/50 group-hover:text-purple-400">
                                Submit Preset
                                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <h2 className="text-sm font-display font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" />
                        Live Arena Feed
                    </h2>
                    <LiveArenaFeed />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
