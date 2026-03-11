import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Trophy, Zap, Target, TrendingUp, Sparkles, AlertCircle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getLastGenerationDate } from '../utils/storage';

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
            } catch (e) {
                console.error('Failed to sync dashboard status');
            }
        };
        fetchStatus();
    }, []);

    const lastGen = remoteStatus?.last_generation_date || getLastGenerationDate();
    const todayStr = new Date().toISOString().split('T')[0];
    const hasGeneratedToday = lastGen === todayStr || (lastGen === new Date().toDateString());

    // Progress logic based on real AXP if available
    const currentAXP = remoteStatus?.axp || user?.axp || 0;
    const progress = Math.min(Math.floor((currentAXP % 1000) / 10), 100);

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
        } catch (e) {
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

    return (
        <div className="flex flex-col gap-6 animate-slide-in">
            {/* 1. Profile Header Hero */}
            <div className="relative">
                <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden text-white group">
                    <div className="scanline"></div>
                    <div className="absolute top-0 right-0 p-8 opacity-5 font-black italic text-6xl select-none group-hover:opacity-10 transition-opacity">ARENI</div>

                    <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                        <div className="relative">
                            <Avatar size="lg" ring className="ring-neon-cyan shadow-[0_0_20px_rgba(6,182,212,0.3)]" />
                            <div className="absolute -bottom-1 -right-1 bg-neon-green w-5 h-5 rounded-full border-2 border-gray-900 flex items-center justify-center text-[8px] shadow-lg">⚡</div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                                <h1 className="text-2xl font-black text-white uppercase tracking-tight">{user.username}</h1>
                                <span className="inline-flex px-2 py-0.5 rounded bg-gray-800 border border-gray-700 text-[10px] font-bold text-neon-cyan uppercase self-center md:self-auto">
                                    {user.rank}
                                </span>
                            </div>

                            <div className="flex items-center justify-center md:justify-start gap-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                                <span className="text-axp-gold flex items-center gap-1">
                                    {user.axp} <Zap className="w-3 h-3" />
                                </span>
                                <span>•</span>
                                <span>LVL {Math.floor(user.axp / 1000) + 1}</span>
                            </div>

                            {/* XP Progress Bar */}
                            <div className="mt-4 max-w-xs mx-auto md:mx-0">
                                <div className="flex justify-between text-[10px] font-black uppercase text-gray-500 mb-1 tracking-tighter">
                                    <span>Progress to next Rank</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary-blue to-neon-cyan shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Button variant="outline" size="sm" onClick={handleDailyReward} className="font-black text-[10px] tracking-[2px] uppercase">
                                Daily Reward
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Next Big Thing Section */}
            {!hasGeneratedToday && (
                <div className="relative group cursor-pointer overflow-hidden rounded-[2.5rem] border border-neon-cyan/30 bg-[#0b0f1a]/50 p-6 md:p-10 transition-all hover:border-neon-cyan shadow-2xl mb-2" onClick={() => navigate('/generate-sensitivity')}>
                    <div className="scanline opacity-[0.05]"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-4 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 bg-neon-cyan/20 border border-neon-cyan/30 px-3 py-1 rounded-full">
                                <Zap className="w-3 h-3 text-neon-cyan animate-pulse" />
                                <span className="text-[10px] font-black text-neon-cyan uppercase tracking-[2px]">Optimization Required</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white uppercase leading-[0.9]">
                                Your Next <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-primary-blue glow-cyan">Big Thing</span>
                            </h2>
                            <p className="text-gray-400 text-sm font-medium italic max-w-sm">
                                You haven't recalibrated your setup today. Hardware drift and network variance require a fresh forge.
                            </p>
                        </div>
                        <div className="shrink-0 flex items-center justify-center w-32 h-32 rounded-full border-4 border-neon-cyan/20 bg-neon-cyan/5 relative group-hover:scale-110 transition-transform duration-500">
                            <div className="absolute inset-0 bg-neon-cyan/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <Target className="w-16 h-16 text-neon-cyan" />
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Grid Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* NEW FEATURE: PERFECT SENSITIVITY */}
                <Card
                    glass
                    className="flex flex-col justify-between border-neon-cyan/20 group overflow-hidden"
                    onClick={() => navigate('/generate-sensitivity')}
                >
                    <div className="mb-4 relative z-10">
                        <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 flex items-center justify-center mb-3 group-hover:bg-neon-cyan transition-all duration-500 shadow-inner group-hover:shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                            <Sparkles className="w-5 h-5 text-neon-cyan group-hover:text-gray-900 transition-colors" />
                        </div>
                        <h3 className="text-lg font-bold text-white uppercase italic tracking-tighter group-hover:text-glow-cyan transition-all">Find Perfect Sens</h3>
                        <p className="text-sm text-gray-500 mt-1">Get optimized Pro settings tailored for your device.</p>
                    </div>
                    <Button variant="neonCyan" size="sm" className="w-full relative z-10 shadow-[0_0_15px_rgba(6,182,212,0.3)] font-black">Launch Forge</Button>
                    <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity group-hover:scale-110 duration-700">
                        <Target className="w-32 h-32" />
                    </div>
                </Card>

                <Card className="flex flex-col justify-between" onClick={() => navigate('/submit')}>
                    <div className="mb-4">
                        <div className="w-10 h-10 rounded-lg bg-neon-green/10 flex items-center justify-center mb-3">
                            <Target className="w-5 h-5 text-neon-green" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-100">Submit New Setup</h3>
                        <p className="text-sm text-gray-500 mt-1">Share your latest sensitivity settings and earn AXP rewards.</p>
                    </div>
                    <Button variant="neonGreen" size="sm" className="w-full">Get Started</Button>
                </Card>

                <Card className="flex flex-col justify-between" onClick={() => navigate('/leaderboard')}>
                    <div className="mb-4">
                        <div className="w-10 h-10 rounded-lg bg-axp-gold/10 flex items-center justify-center mb-3">
                            <Trophy className="w-5 h-5 text-axp-gold" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-100 uppercase tracking-tighter italic">Legends Hub</h3>
                        <p className="text-sm text-gray-500 mt-1">See how you rank against the best Arenis in the world.</p>
                    </div>
                    <Button variant="primary" size="sm" className="w-full">View Rankings</Button>
                </Card>

                {/* SQUAD RECRUITMENT CTA */}
                <Card
                    glass
                    className="flex flex-col justify-between border-neon-green/20 group relative overflow-hidden"
                    onClick={() => navigate('/guilds')}
                >
                    <div className="mb-4 relative z-10">
                        <div className="w-10 h-10 rounded-lg bg-neon-green/10 flex items-center justify-center mb-3 group-hover:bg-neon-green transition-all duration-500 shadow-inner group-hover:shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                            <Users className="w-5 h-5 text-neon-green group-hover:text-gray-900 transition-colors" />
                        </div>
                        <h3 className="text-lg font-bold text-white uppercase italic tracking-tighter group-hover:text-neon-green transition-all">Squad Recruitment</h3>
                        <p className="text-sm text-gray-500 mt-1">Join a faction, earn collective AXP, and dominate the Squad leaderboards.</p>
                    </div>
                    <Button variant="neonGreen" size="sm" className="w-full relative z-10 shadow-[0_0_15px_rgba(34,197,94,0.3)] font-black">Find a Squad</Button>
                    <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity group-hover:scale-110 duration-700">
                        <Users className="w-32 h-32" />
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
