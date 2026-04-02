import React, { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Target, Zap, Shield, Trophy, Activity, ChevronRight, Lock, CheckCircle2, Star, Globe, TrendingUp, LayoutGrid, Clock, Gift, Flame, Crown, Sparkles, Calendar } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

const QuestCard = ({ quest, onClaim }) => {
    const isCompleted = quest.progress >= 1;
    const isClaimable = isCompleted && quest.status !== 'Claimed';
    
    return (
        <div 
            onClick={() => onClaim(quest)}
            className={cn(
                "card-gaming relative overflow-hidden p-6 cursor-pointer group",
                isCompleted && quest.status !== 'Claimed' && "border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)]",
                quest.status === 'Claimed' && "opacity-60"
            )}
        >
            {/* Tier Badge */}
            <div className={cn(
                "absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl text-[9px] font-bold tracking-widest uppercase",
                quest.tier === 'LEGENDARY' ? "bg-gradient-to-r from-amber-500 to-orange-500 text-background" :
                quest.tier === 'ELITE' ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" :
                quest.tier === 'DAILY' ? "bg-primary text-background" :
                "bg-surface-elevated text-slate-400"
            )}>
                {quest.tier}
            </div>

            {/* Quest Icon & Info */}
            <div className="flex items-start gap-5 mb-6">
                <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110",
                    isCompleted 
                        ? "bg-emerald-500/10 border border-emerald-500/20" 
                        : "bg-surface-low border border-white/[0.06] group-hover:border-primary/30"
                )}>
                    {isCompleted ? (
                        <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                    ) : (
                        <quest.icon className={cn(
                            "w-7 h-7 transition-colors",
                            quest.tier === 'LEGENDARY' ? "text-amber-500" :
                            quest.tier === 'ELITE' ? "text-purple-400" : "text-slate-400 group-hover:text-primary"
                        )} />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-white text-lg group-hover:text-primary transition-colors">{quest.title}</h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{quest.desc}</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Progress</span>
                    <span className={cn(
                        "text-sm font-display font-bold tabular-nums",
                        isCompleted ? "text-emerald-400" : "text-white"
                    )}>
                        {quest.current}/{quest.target}
                    </span>
                </div>
                <div className="h-2 w-full bg-surface-low rounded-full overflow-hidden">
                    <div 
                        className={cn(
                            "h-full rounded-full transition-all duration-500 relative",
                            isCompleted ? "bg-emerald-500" : 
                            quest.tier === 'LEGENDARY' ? "bg-gradient-to-r from-amber-500 to-orange-500" :
                            quest.tier === 'ELITE' ? "bg-gradient-to-r from-purple-500 to-pink-500" :
                            "bg-gradient-to-r from-primary to-accent-cyan"
                        )}
                        style={{ width: `${Math.min(quest.progress * 100, 100)}%` }}
                    >
                        {!isCompleted && (
                            <div className="absolute inset-0 bg-gradient-shine animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-[10px] text-slate-500">{quest.timeLeft}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isClaimable ? (
                        <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 animate-pulse">
                            <Gift className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm font-bold text-emerald-400">Claim {quest.reward}</span>
                        </span>
                    ) : (
                        <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <Zap className="w-4 h-4 text-amber-500" />
                            <span className="text-sm font-bold text-amber-400">{quest.reward}</span>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

const Quests = () => {
    const { addNotification } = useNotifications();
    const [activeTab, setActiveTab] = useState('daily');

    const [quests, setQuests] = useState([
        { id: 1, title: "First Blood", desc: "Win your first match of the day", reward: "100 XP", status: "Active", progress: 1, current: 1, target: 1, tier: "DAILY", timeLeft: "23h left", icon: Target },
        { id: 2, title: "Headshot Master", desc: "Land 50 headshots in competitive matches", reward: "500 XP", status: "Active", progress: 0.64, current: 32, target: 50, tier: "DAILY", timeLeft: "23h left", icon: Target },
        { id: 3, title: "Team Player", desc: "Complete 5 guild activities with teammates", reward: "300 XP", status: "Active", progress: 0.4, current: 2, target: 5, tier: "DAILY", timeLeft: "23h left", icon: Shield },
        { id: 4, title: "Sensitivity Scientist", desc: "Generate and test 10 different sensitivity configs", reward: "1,000 XP", status: "Active", progress: 0.3, current: 3, target: 10, tier: "ELITE", timeLeft: "5d left", icon: Sparkles },
        { id: 5, title: "Tournament Champion", desc: "Win 3 tournament matches in a row", reward: "2,500 XP", status: "Active", progress: 0.66, current: 2, target: 3, tier: "ELITE", timeLeft: "5d left", icon: Trophy },
        { id: 6, title: "Legend's Journey", desc: "Reach Legend rank in global leaderboard", reward: "10,000 XP", status: "Active", progress: 0.15, current: 15000, target: 100000, tier: "LEGENDARY", timeLeft: "Season End", icon: Crown },
    ]);

    const handleClaim = (quest) => {
        if (quest.progress >= 1 && quest.status !== 'Claimed') {
            setQuests(prev => prev.map(q => 
                q.id === quest.id ? { ...q, status: 'Claimed' } : q
            ));
            addNotification('Quest Complete!', `You earned ${quest.reward} from "${quest.title}"`, 'success');
        } else if (quest.status === 'Claimed') {
            addNotification('Already Claimed', 'You have already claimed this reward.', 'info');
        } else {
            addNotification('Quest In Progress', `${quest.current}/${quest.target} - Keep going!`, 'info');
        }
    };

    const dailyQuests = quests.filter(q => q.tier === 'DAILY');
    const weeklyQuests = quests.filter(q => q.tier === 'ELITE');
    const seasonalQuests = quests.filter(q => q.tier === 'LEGENDARY');

    const totalEarned = 42500;
    const completedCount = quests.filter(q => q.progress >= 1).length;

    return (
        <div className="space-y-10 pb-20 animate-fade-in">
            {/* Header */}
            <div className="card-gaming p-8 md:p-10 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-[80px]" />
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
                </div>
                
                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                            <Star className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Quest System</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight">
                            Daily <span className="text-gradient-gold">Missions</span>
                        </h1>
                        <p className="text-slate-400 text-base max-w-md">
                            Complete quests to earn XP, unlock exclusive rewards, and climb the ranks faster.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
                        <div className="stat-card !p-5 text-center">
                            <Flame className="w-6 h-6 text-rose-500 mx-auto mb-2" />
                            <p className="font-display font-bold text-2xl text-white">{completedCount}/{quests.length}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Completed</p>
                        </div>
                        <div className="stat-card !p-5 text-center">
                            <Zap className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                            <p className="font-display font-bold text-2xl text-gradient-gold">{totalEarned.toLocaleString()}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">XP Earned</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-surface-elevated/60 border border-white/[0.06] rounded-2xl w-fit">
                {[
                    { id: 'daily', label: 'Daily', count: dailyQuests.length },
                    { id: 'weekly', label: 'Weekly', count: weeklyQuests.length },
                    { id: 'seasonal', label: 'Seasonal', count: seasonalQuests.length },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all",
                            activeTab === tab.id 
                                ? "bg-primary text-background" 
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        {tab.label}
                        <span className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded",
                            activeTab === tab.id ? "bg-background/20" : "bg-surface-low"
                        )}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Quest Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {(activeTab === 'daily' ? dailyQuests : 
                  activeTab === 'weekly' ? weeklyQuests : 
                  seasonalQuests).map((quest) => (
                    <QuestCard key={quest.id} quest={quest} onClaim={handleClaim} />
                ))}
            </div>

            {/* Rewards Summary */}
            <div className="card-gaming p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-wrap items-center gap-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Completion Rate</p>
                            <p className="font-display font-bold text-2xl text-white">{Math.round((completedCount / quests.length) * 100)}%</p>
                        </div>
                    </div>
                    <div className="h-10 w-px bg-white/[0.06] hidden md:block" />
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Daily Reset</p>
                            <p className="font-display font-bold text-2xl text-white">23:45:00</p>
                        </div>
                    </div>
                </div>
                
                <Button 
                    variant="secondary" 
                    className="w-full md:w-auto"
                    disabled={completedCount === 0}
                >
                    <Gift className="w-4 h-4 mr-2" />
                    Claim All Rewards
                </Button>
            </div>
        </div>
    );
};

export default Quests;
