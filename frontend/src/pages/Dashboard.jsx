import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Activity, Shield, ChevronRight, Sparkles, Target, Share2, BarChart3, Zap, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getLastGenerationDate } from '../utils/storage';
import { SeasonalProgress } from '../components/dashboard/SeasonalProgress';
import { LiveArenaFeed } from '../components/dashboard/LiveArenaFeed';

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
            <div className="flex flex-col items-center justify-center p-12">
                <Button onClick={() => navigate('/login')}>Please Log In</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 animate-fade-in pb-12">
            {/* Intel Header */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-white/5 shadow-sm">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                    <BarChart3 className="w-64 h-64" />
                </div>
                
                <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-6 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                            <Activity className="w-3.5 h-3.5 text-primary" />
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Platform Status: Optimized</span>
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-none">
                            Welcome back,<br />
                            <span className="text-primary">{user.username}</span>
                        </h1>
                        
                        <p className="text-slate-400 text-sm md:text-base max-w-lg leading-relaxed font-medium">
                            Your performance stats are up to date. You have <span className="text-white font-bold">{currentPoints.toLocaleString()} Points</span> available in your account.
                        </p>
                        
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            <Button size="md" onClick={() => navigate('/generate-sensitivity')} className="px-6">
                                New Calibration
                            </Button>
                            <Button variant="secondary" size="md" onClick={handleDailyReward} className="px-6">
                                Claim Daily Bonus
                            </Button>
                        </div>
                    </div>

                    <div className="hidden lg:grid grid-cols-2 gap-4 w-full max-w-xs">
                         <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 space-y-1">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Level</p>
                            <p className="text-2xl font-bold text-white tracking-tight">{currentLevel}</p>
                         </div>
                         <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 space-y-1">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Rank</p>
                            <p className="text-2xl font-bold text-white tracking-tight">{user.rank === 'Elite' ? 'Elite' : (user.rank || 'Beginner')}</p>
                         </div>
                         <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 col-span-2 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Last Sync</p>
                                <p className="text-sm font-bold text-white">{lastGen ? new Date(lastGen).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <Clock className="w-5 h-5 text-slate-600" />
                         </div>
                    </div>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6 flex flex-col justify-between hover:bg-slate-800/50 transition-colors border-white/5">
                    <div className="space-y-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                            <TrendingUp className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Consistency Rating</h3>
                            <p className="text-xl font-bold text-white tracking-tight">Optimal Efficiency</p>
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Historical High: Expert</span>
                        <Shield className="w-4 h-4 text-slate-600" />
                    </div>
                </Card>

                <SeasonalProgress currentAXP={currentPoints} level={currentLevel} />
            </div>

            {/* Utilities & Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Quick Access
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Card className="p-8 hover:bg-slate-800/50 transition-all cursor-pointer group border-white/5" onClick={() => navigate('/generate-sensitivity')}>
                            <Target className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
                            <h4 className="text-lg font-bold text-white tracking-tight mb-2">Recalibration</h4>
                            <p className="text-xs text-slate-500 leading-relaxed mb-6 font-medium">Update your sensitivity settings for your current hardware setup.</p>
                            <Button variant="outline" size="sm" className="w-full">Start Calibration</Button>
                        </Card>
                        
                        <Card className="p-8 hover:bg-slate-800/50 transition-all cursor-pointer group border-white/5" onClick={() => navigate('/submit')}>
                            <Share2 className="w-10 h-10 text-slate-400 mb-6 group-hover:scale-110 transition-transform" />
                            <h4 className="text-lg font-bold text-white tracking-tight mb-2">Public Feed</h4>
                            <p className="text-xs text-slate-500 leading-relaxed mb-6 font-medium">Share your optimized settings with the community leaderboard.</p>
                            <Button variant="outline" size="sm" className="w-full">Submit Setup</Button>
                        </Card>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Live Feed
                    </h2>
                    <LiveArenaFeed />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
