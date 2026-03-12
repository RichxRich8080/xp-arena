import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Activity, Shield, ChevronRight, Sparkles, Target, Share2 } from 'lucide-react';
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
    const todayStr = new Date().toISOString().split('T')[0];
    
    const currentAXP = remoteStatus?.axp || user?.axp || 0;
    const currentLevel = user?.level || Math.floor(currentAXP / 1000) + 1;

    const handleDailyReward = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/user/daily-login', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                addNotification('Daily Reward', `You claimed ${data.axp} AXP! Streak: ${data.streak}`, 'axp');
                setRemoteStatus(prev => ({ ...prev, axp: (prev?.axp || 0) + data.axp }));
            } else {
                addNotification('Daily Reward', data.error || 'Already claimed today', 'error');
            }
        } catch {
            addNotification('Connection Error', 'Failed to reach the Arena servers.', 'error');
        }
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center p-12">
                <Button onClick={() => navigate('/login')}>Please Log In</Button>
            </div>
        );
    }

    const mascotImg = '/mascot.png';

    return (
        <div className="flex flex-col gap-10 animate-slide-in p-2 md:p-0">
            {/* HERO / INTEL SECTION */}
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent-cyan/10 to-transparent blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                
                <div className="glass-panel overflow-hidden border-white/5 relative p-0">
                    <div className="flex flex-col lg:flex-row min-h-[440px]">
                        {/* Content Area */}
                        <div className="flex-1 p-8 md:p-12 relative z-10 flex flex-col justify-center">
                            <div className="inline-flex items-center gap-3 bg-accent-cyan/10 border border-accent-cyan/20 px-4 py-1.5 rounded-full mb-8 w-fit">
                                <Activity className="w-3.5 h-3.5 text-accent-cyan animate-pulse" />
                                <span className="text-[10px] font-display font-black text-accent-cyan uppercase tracking-[0.3em]">Neural Interface Active</span>
                            </div>
                            
                            <h1 className="text-5xl md:text-7xl font-display font-black italic tracking-tighter leading-[0.85] text-white uppercase mb-6 group-hover:glow-cyan transition-all">
                                Welcome Back, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-white to-indigo-400 drop-shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                                    {user.username}
                                </span>
                            </h1>
                            
                            <p className="text-gray-400 text-sm md:text-base font-medium max-w-lg mb-10 leading-relaxed">
                                Your current status is <span className="text-white font-bold">OPTIMIZED</span>. You have <span className="text-accent-cyan font-bold">{currentAXP} AXP</span> registered in the global vault.
                            </p>
                            
                            <div className="flex flex-wrap gap-4">
                                <Button size="lg" onClick={() => navigate('/generate-sensitivity')} className="min-w-[180px]">
                                    LAUNCH_ARENA
                                </Button>
                                <Button variant="secondary" size="lg" onClick={handleDailyReward} className="min-w-[180px]">
                                    CLAIM_REWARD
                                </Button>
                            </div>
                        </div>
                        
                        {/* Mascot Visual */}
                        <div className="lg:w-[45%] bg-gradient-to-l from-white/5 to-transparent relative min-h-[300px] lg:min-h-auto overflow-hidden">
                             <img 
                                src={mascotImg} 
                                alt="Pro Gamer Mascot" 
                                className="absolute bottom-[-15%] right-[-15%] w-[130%] lg:w-[160%] max-w-none object-contain animate-float drop-shadow-[0_0_80px_rgba(6,182,212,0.4)] transition-transform duration-1000 group-hover:scale-110 group-hover:-rotate-3"
                            />
                            <div className="absolute top-12 right-12 glass-panel p-4 py-2 border-white/10 animate-float" style={{ animationDelay: '1s' }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
                                    <span className="text-[9px] font-display font-black text-white/50 uppercase tracking-widest">Target_Sync</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* KEY METRICS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="flex flex-col justify-between group">
                    <div>
                        <div className="w-12 h-12 rounded-2xl bg-accent-rose/10 flex items-center justify-center mb-6 group-hover:bg-accent-rose transition-all duration-500">
                            <Activity className="w-6 h-6 text-accent-rose group-hover:text-white" />
                        </div>
                        <h3 className="font-display font-black text-white text-sm tracking-widest uppercase mb-1">Precision Rating</h3>
                        <p className="text-[10px] text-accent-rose font-bold uppercase tracking-widest group-hover:text-white transition-colors">Neural Convergence 99.2%</p>
                    </div>
                    <div className="mt-8 flex items-end justify-between">
                        <span className="text-2xl font-display font-black text-white italic tracking-tighter">S+ TIER</span>
                        <Shield className="w-5 h-5 text-accent-rose group-hover:text-white transition-colors" />
                    </div>
                </Card>

                <SeasonalProgress currentAXP={currentAXP} level={currentLevel} />
            </div>

            {/* FAST ACCESS HUBS & LIVE FEED */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                <div className="lg:col-span-2 space-y-8">
                    <h2 className="font-display font-black text-2xl text-white tracking-widest uppercase flex items-center gap-4">
                        <Sparkles className="w-6 h-6 text-accent-cyan" />
                        Available Forges
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Card className="p-8 border-accent-cyan/10 hover:border-accent-cyan/40 bg-gradient-to-br from-white/[0.03] to-transparent cursor-pointer group/forge" onClick={() => navigate('/generate-sensitivity')}>
                            <Target className="w-10 h-10 text-accent-cyan mb-6 group-hover/forge:scale-110 transition-transform" />
                            <h4 className="font-display font-black text-xl text-white uppercase mb-3 text-glow-cyan">Recalibration</h4>
                            <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6 italic uppercase tracking-tighter">Generate fresh coefficients for your current tactical setup.</p>
                            <Button variant="neon" size="sm" className="w-full">START_SYNC</Button>
                        </Card>
                        
                        <Card className="p-8 border-accent-rose/10 hover:border-accent-rose/40 bg-gradient-to-br from-white/[0.03] to-transparent cursor-pointer group/share" onClick={() => navigate('/submit')}>
                            <Share2 className="w-10 h-10 text-accent-rose mb-6 group-hover/share:scale-110 transition-transform" />
                            <h4 className="font-display font-black text-xl text-white uppercase mb-3 text-glow-rose">Public Dossier</h4>
                            <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6 italic uppercase tracking-tighter">Transmit your optimized settings to the global cloud leaderboard.</p>
                            <Button variant="secondary" size="sm" className="w-full">PUBLISH_DATA</Button>
                        </Card>
                    </div>
                </div>
                
                <LiveArenaFeed />
            </div>
        </div>
    );
};

export default Dashboard;
