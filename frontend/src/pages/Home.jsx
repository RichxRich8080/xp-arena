import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Trophy, PlusSquare, Zap, ChevronRight, Target, Shield, Flame, Terminal } from 'lucide-react';
import { cn } from '../utils/cn';

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
            <div className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden py-12 px-6">
                {/* Background Ambient Glows */}
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-cyan/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-violet/10 blur-[120px] rounded-full animate-pulse-slow" />
                
                {/* Hero Content */}
                <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 text-center lg:text-left space-y-8">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-panel border-white/5 animate-slide-in">
                            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-ping" />
                            <span className="text-[10px] font-display font-black text-accent-cyan uppercase tracking-[0.3em]">System Online // v4.0.2</span>
                        </div>
                        
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black text-white italic tracking-tighter uppercase leading-[0.8] animate-slide-in">
                            LEVEL UP <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-accent-violet to-accent-rose drop-shadow-[0_0_50px_rgba(6,182,212,0.6)]">
                                THE ARENA
                            </span>
                        </h1>
                        
                        <p className="text-gray-400 font-display font-bold text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-slide-in">
                            Forge perfect sensitivity profiles, archive elite setups, and climb the global AXP rankings in the most advanced gamer headquarters ever built.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 animate-slide-in">
                            <Button variant="primary" size="lg" className="px-12 py-5 text-lg group" onClick={() => navigate('/signup')}>
                                INITIALIZE_ACCOUNT
                                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </Button>
                            <Button variant="secondary" size="lg" className="px-12 py-5 text-lg" onClick={() => navigate('/login')}>
                                ACCESS_PORTAL
                            </Button>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-8 pt-12 border-t border-white/5 max-w-md mx-auto lg:mx-0 animate-slide-in">
                            <div>
                                <p className="text-2xl font-display font-black text-white tracking-widest">50K+</p>
                                <p className="text-[10px] text-gray-500 font-display font-bold uppercase tracking-wider">Arenis Active</p>
                            </div>
                            <div>
                                <p className="text-2xl font-display font-black text-white tracking-widest">12K</p>
                                <p className="text-[10px] text-gray-500 font-display font-bold uppercase tracking-wider">Presets Saved</p>
                            </div>
                            <div>
                                <p className="text-2xl font-display font-black text-white tracking-widest">2MS</p>
                                <p className="text-[10px] text-gray-500 font-display font-bold uppercase tracking-wider">Latency_Sync</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 relative animate-float">
                        <div className="absolute inset-0 bg-accent-cyan/20 blur-[100px] rounded-full animate-pulse" />
                        <img 
                            src="/mascot.png" 
                            alt="Pro Gamer Mascot" 
                            className="relative z-10 w-full max-w-lg mx-auto drop-shadow-[0_0_50px_rgba(6,182,212,0.4)]"
                        />
                        {/* Decorative HUD elements */}
                        <div className="absolute top-0 right-0 glass-panel p-4 border-white/10 rotate-12 hidden md:block">
                            <Target className="w-8 h-8 text-accent-cyan" />
                        </div>
                        <div className="absolute bottom-10 left-0 glass-panel p-4 border-white/10 -rotate-12 hidden md:block">
                            <Shield className="w-8 h-8 text-accent-violet" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20 animate-slide-in">
            {/* AUTH HOME / LAUNCHPAD */}
            <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
                        <h2 className="text-xs font-display font-black text-gray-500 uppercase tracking-[0.3em]">Operational_Home</h2>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-black text-white italic tracking-tighter uppercase leading-none">
                        Welcome, <span className="text-accent-cyan">{user.username}</span>
                    </h1>
                </div>
                
                <div className="glass-panel px-6 py-3 border-axp-gold/20 flex items-center gap-4 group">
                    <Zap className="w-5 h-5 text-axp-gold group-hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] transition-all" />
                    <div className="text-right">
                        <p className="text-[10px] font-display font-black text-gray-500 uppercase tracking-widest leading-none mb-1">AXP BALANCE</p>
                        <p className="font-display font-black text-white text-lg tracking-widest leading-none">{user.axp} <span className="text-axp-gold italic text-sm">CR</span></p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Action Hub */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="flex flex-col justify-between p-8 border-accent-cyan/20 bg-gradient-to-br from-accent-cyan/[0.05] to-transparent hover:border-accent-cyan/40 transition-all group overflow-hidden relative">
                        <Terminal className="absolute -bottom-4 -right-4 w-32 h-32 text-accent-cyan opacity-[0.03] group-hover:scale-110 transition-transform" />
                        <div className="relative z-10">
                            <div className="bg-accent-cyan/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border border-accent-cyan/20">
                                <PlusSquare className="w-6 h-6 text-accent-cyan" />
                            </div>
                            <h3 className="text-2xl font-display font-black text-white italic uppercase tracking-widest mb-2">Initialize Forge</h3>
                            <p className="text-sm text-gray-400 font-display font-bold leading-relaxed">Broadcast your elite configurations to the network. Gain +{user.level > 5 ? '100' : '50'} AXP per uplink.</p>
                        </div>
                        <Button
                            variant="primary"
                            size="lg"
                            className="mt-12 group/btn relative z-10"
                            onClick={() => navigate('/submit')}
                        >
                            CREATE_PRESET
                            <ChevronRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                    </Card>

                    <Card className="flex flex-col justify-between p-8 border-accent-violet/20 bg-gradient-to-br from-accent-violet/[0.05] to-transparent hover:border-accent-violet/40 transition-all group overflow-hidden relative">
                        <Flame className="absolute -bottom-4 -right-4 w-32 h-32 text-accent-violet opacity-[0.03] group-hover:scale-110 transition-transform" />
                        <div className="relative z-10">
                            <div className="bg-accent-violet/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border border-accent-violet/20">
                                <Trophy className="w-6 h-6 text-accent-violet" />
                            </div>
                            <h3 className="text-2xl font-display font-black text-white italic uppercase tracking-widest mb-2">Elite Ranking</h3>
                            <p className="text-sm text-gray-400 font-display font-bold leading-relaxed">Current Tier: <span className="text-accent-violet">{user.rank}</span>. Reach 5,000 AXP to unlock LEGEND clearance.</p>
                        </div>
                        <Button
                            variant="secondary"
                            size="lg"
                            className="mt-12 relative z-10 border-accent-violet/20"
                            onClick={() => navigate('/leaderboard')}
                        >
                            VIEW_ARENA
                        </Button>
                    </Card>
                </div>

                {/* Sidebar Quick-Feed */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-display font-black text-white text-xs tracking-[0.2em] uppercase flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-accent-cyan rounded-full" />
                            ARENA_TOP_TIER
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {topSetups.map((setup, index) => (
                            <div
                                key={setup.id}
                                className="glass-panel p-4 flex items-center justify-between hover:bg-white/[0.03] transition-all border-white/5 group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-display font-black text-xs text-gray-500 border border-white/5 group-hover:text-accent-cyan group-hover:border-accent-cyan/30 transition-all">
                                        0{index + 1}
                                    </div>
                                    <Avatar size="sm" alt={setup.user} className="ring-1 ring-white/10" />
                                    <div>
                                        <p className="font-display font-black text-sm text-white uppercase italic tracking-wider">{setup.user}</p>
                                        <p className="text-[8px] text-accent-cyan font-display font-bold uppercase tracking-[0.2em]">{setup.rank}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-display font-black text-xs text-white tracking-widest">{setup.axp}</p>
                                    <p className="text-[8px] text-gray-600 font-display font-bold uppercase tracking-widest">AXP</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
