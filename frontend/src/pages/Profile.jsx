import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Trophy, Zap, Clock, Activity, Target, Settings, Edit3, Trash2, Save, X, Share2, Shield, Fingerprint, ChevronRight, User, BarChart3, History, Crown, Star, Flame, TrendingUp, Award, Copy, Check, Globe } from 'lucide-react';
import { getSetups, deleteSetup } from '../utils/storage';
import api, { userService } from '../services/api';
import { useNotifications } from '../hooks/useNotifications';
import { cn } from '../utils/cn';

function getRankColor(rank) {
    const colors = {
        'Legend': 'text-rank-legend',
        'Grandmaster': 'text-rank-grandmaster',
        'Master': 'text-rank-master',
        'Diamond': 'text-rank-diamond',
        'Platinum': 'text-rank-platinum',
        'Gold': 'text-rank-gold',
        'Silver': 'text-rank-silver',
        'Bronze': 'text-rank-bronze',
    };
    return colors[rank] || 'text-slate-400';
}

export default function Profile() {
    const { user, updateUser } = useAuth();
    const { addNotification } = useNotifications();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('stats');
    const [mySetups, setMySetups] = useState([]);
    const [activityFeed, setActivityFeed] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [profileForm, setProfileForm] = useState({ username: '', avatar: '', likes: 0, wins: 0 });
    const avatarOptions = ['👤', '😎', '🎯', '🔥', '👑', '🛡️', '⚡', '🎮', '🤖', '🦅'];

    useEffect(() => {
        let mounted = true;
        const loadProfileData = async () => {
            setIsLoading(true);
            try {
                const [setups, activityRes, profileRes] = await Promise.all([
                    getSetups(),
                    api.get('/activity/live').catch(() => ({ data: [] })),
                    userService.getProfile().catch(() => ({ data: { user: user || {} } }))
                ]);

                if (!mounted) return;
                setMySetups(Array.isArray(setups) ? setups : []);
                setActivityFeed(Array.isArray(activityRes.data) ? activityRes.data.slice(0, 10) : []);

                const profileUser = profileRes?.data?.user || user || {};
                const socials = typeof profileUser.socials === 'string' ? JSON.parse(profileUser.socials || '{}') : (profileUser.socials || {});
                setProfileForm({
                    username: profileUser.username || user?.username || '',
                    avatar: profileUser.avatar || user?.avatar || '',
                    likes: Number(socials.likes || 0),
                    wins: Number(socials.wins || 0)
                });
            } catch {
                setProfileForm({
                    username: user?.username || '',
                    avatar: user?.avatar || '',
                    likes: 0,
                    wins: 0
                });
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        loadProfileData();
        return () => { mounted = false; };
    }, [user]);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const joinedLabel = user.created_at || user.joinDate || 'Recently';
    const profileId = user.id || 'XPA-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    const handleCopyId = () => {
        navigator.clipboard.writeText(profileId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDelete = (id) => {
        const shouldDelete = window.confirm('Delete this setup?');
        if (!shouldDelete) return;
        const success = deleteSetup(id);
        if (success) {
            setMySetups((prev) => prev.filter((setup) => setup.id !== id));
            addNotification('Setup Removed', 'Your setup was deleted.', 'success');
        }
    };

    const handleProfileSave = async () => {
        try {
            if (profileForm.username && profileForm.username !== user.username) {
                const { data } = await userService.updateNickname(profileForm.username);
                if (data?.token) localStorage.setItem('token', data.token);
            }

            await Promise.all([
                userService.updateAvatar(profileForm.avatar || null),
                userService.updateSocials({ likes: profileForm.likes, wins: profileForm.wins })
            ]);

            updateUser({ username: profileForm.username, avatar: profileForm.avatar, socials: { likes: profileForm.likes, wins: profileForm.wins } });
            addNotification('Profile Updated', 'Your profile changes were saved.', 'success');
            setIsEditing(false);
        } catch (error) {
            addNotification('Update Failed', error?.message || 'Failed to save profile changes.', 'error');
        }
    };

    const stats = [
        { label: 'Total XP', value: user.axp?.toLocaleString() || '0', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: 'Current Rank', value: user.rank || 'Bronze', icon: Crown, color: getRankColor(user.rank), bg: 'bg-primary/10' },
        { label: 'Win Rate', value: `${user.winRate || 68}%`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Level', value: user.level || 1, icon: Star, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { label: 'Matches', value: user.matches || 124, icon: Target, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
        { label: 'Streak', value: `${user.streak || 0} Days`, icon: Flame, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    ];

    return (
        <div className="space-y-8 pb-12 animate-fade-in">
            {/* Profile Header */}
            <div className="card-gaming p-8 md:p-10 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-cyan/5 rounded-full blur-[80px]" />
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                </div>
                
                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-8">
                    {/* Avatar Section */}
                    <div className="relative group">
                        <div className="absolute -inset-2 bg-gradient-to-br from-primary/30 to-accent-cyan/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Avatar size="xl" src={user.avatar} className="relative w-28 h-28 ring-4 ring-primary/20 shadow-glow-sm" />
                        <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-primary to-accent-cyan text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-glow-sm border-2 border-background">
                            <span className="font-display font-bold text-sm">{user.level || 1}</span>
                        </div>
                        {user.isPremium && (
                            <div className="absolute -top-2 -right-2 bg-amber-500 p-2 rounded-lg shadow-lg">
                                <Crown className="w-4 h-4 text-background" />
                            </div>
                        )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-3xl md:text-4xl font-display font-black text-white tracking-tight">
                                    {user.username}
                                </h1>
                                <span className={cn(
                                    "rank-badge",
                                    user.rank === 'Legend' ? 'rank-legend' :
                                    user.rank === 'Grandmaster' ? 'rank-grandmaster' :
                                    user.rank === 'Master' ? 'rank-master' :
                                    user.rank === 'Diamond' ? 'rank-diamond' : 'rank-bronze'
                                )}>
                                    <Trophy className="w-3 h-3" />
                                    {user.rank || 'Bronze'}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 flex-wrap">
                                <button 
                                    onClick={handleCopyId}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-low hover:bg-surface-elevated transition-colors group"
                                >
                                    <code className="text-xs font-mono text-slate-400 group-hover:text-primary">{profileId}</code>
                                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                                </button>
                                <span className="flex items-center gap-2 text-xs text-slate-500">
                                    <Clock className="w-3.5 h-3.5" /> Joined {joinedLabel}
                                </span>
                            </div>
                        </div>

                        {/* XP Progress */}
                        <div className="max-w-md">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-slate-400">Level {user.level || 1} Progress</span>
                                <span className="text-xs font-bold text-primary">{(user.axp % 1000) || 450}/1000 XP</span>
                            </div>
                            <div className="h-2 bg-surface-low rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-primary to-accent-cyan rounded-full relative"
                                    style={{ width: `${((user.axp % 1000) / 1000) * 100 || 45}%` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-shine animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 w-full lg:w-auto">
                        <Button variant="primary" size="md" className="flex-1 lg:flex-none" onClick={() => setIsEditing(true)}>
                            <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
                        </Button>
                        <Button variant="secondary" size="md" onClick={() => navigate('/settings')}>
                            <Settings className="w-4 h-4" />
                        </Button>
                        <Button variant="secondary" size="md">
                            <Share2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Editing Modal */}
            {isEditing && (
                <div className="card-gaming p-8 border-primary/30 animate-scale-in space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-display font-bold text-white flex items-center gap-3">
                            <Fingerprint className="w-5 h-5 text-primary" />
                            Edit Profile
                        </h3>
                        <button onClick={() => setIsEditing(false)} className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400">Display Name</label>
                            <input 
                                className="w-full bg-surface-low border border-white/[0.06] rounded-xl px-4 py-3 text-white focus:border-primary/50 outline-none transition-colors" 
                                value={profileForm.username} 
                                onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })} 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400">Avatar URL</label>
                            <input 
                                className="w-full bg-surface-low border border-white/[0.06] rounded-xl px-4 py-3 text-white focus:border-primary/50 outline-none transition-colors" 
                                value={profileForm.avatar} 
                                onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })} 
                                placeholder="https://..." 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400">Quick Avatar Icons</label>
                        <div className="flex flex-wrap gap-2">
                            {avatarOptions.map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => setProfileForm({ ...profileForm, avatar: option })}
                                    className={cn(
                                        "w-10 h-10 rounded-xl border border-white/[0.08] bg-surface-low hover:border-primary/40 transition-colors text-lg",
                                        profileForm.avatar === option && "border-primary bg-primary/10"
                                    )}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <Button variant="primary" className="flex-1" onClick={handleProfileSave}>
                            <Save className="w-4 h-4 mr-2" /> Save Changes
                        </Button>
                        <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="stat-card text-center group">
                        <div className={cn("w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center", stat.bg)}>
                            <stat.icon className={cn("w-5 h-5", stat.color)} />
                        </div>
                        <p className={cn("text-2xl font-display font-bold", stat.color)}>{stat.value}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-surface-elevated/60 border border-white/[0.06] rounded-2xl w-fit">
                {[
                    { id: 'stats', label: 'Overview', icon: BarChart3 },
                    { id: 'setups', label: 'My Presets', icon: Shield },
                    { id: 'activity', label: 'Activity Log', icon: History }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all",
                            activeTab === tab.id 
                                ? 'bg-primary text-background' 
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                        )}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in">
                {activeTab === 'stats' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Achievements */}
                        <div className="card-gaming p-6">
                            <h3 className="font-display font-bold text-white mb-6 flex items-center gap-2">
                                <Award className="w-5 h-5 text-amber-500" />
                                Recent Achievements
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { name: 'First Blood', desc: 'Won first match', icon: '1st', unlocked: true },
                                    { name: 'Sharpshooter', desc: '100 headshots', icon: 'HS', unlocked: true },
                                    { name: 'Guild Leader', desc: 'Lead a guild', icon: 'GL', unlocked: false },
                                ].map((achievement, i) => (
                                    <div key={i} className={cn(
                                        "flex items-center gap-4 p-4 rounded-xl border",
                                        achievement.unlocked 
                                            ? "bg-amber-500/5 border-amber-500/20" 
                                            : "bg-surface-low/50 border-white/[0.06] opacity-50"
                                    )}>
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-sm",
                                            achievement.unlocked ? "bg-amber-500/20 text-amber-400" : "bg-surface-elevated text-slate-500"
                                        )}>
                                            {achievement.icon}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white">{achievement.name}</p>
                                            <p className="text-xs text-slate-500">{achievement.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Performance */}
                        <div className="card-gaming p-6">
                            <h3 className="font-display font-bold text-white mb-6 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-primary" />
                                Global Standing
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-surface-low/50">
                                    <span className="text-slate-400">Global Rank</span>
                                    <span className="font-display font-bold text-white">#1,247</span>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-surface-low/50">
                                    <span className="text-slate-400">Regional Rank</span>
                                    <span className="font-display font-bold text-primary">#89</span>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-surface-low/50">
                                    <span className="text-slate-400">Guild Contribution</span>
                                    <span className="font-display font-bold text-amber-400">#4</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'setups' && (
                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="card-gaming p-12 text-center">
                                <Activity className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                                <p className="text-sm text-slate-500">Loading presets...</p>
                            </div>
                        ) : mySetups.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {mySetups.map(setup => (
                                    <div key={setup.id} className="card-gaming p-5 flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                                <Target className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-white">
                                                    {setup.formData?.brand || 'Generic'} {setup.formData?.model || 'Device'}
                                                </h4>
                                                <p className="text-xs text-primary">{setup.formData?.playStyle || 'Custom'} Setup</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <code className="text-xs font-mono text-slate-500 bg-surface-low px-2 py-1 rounded">
                                                {setup.shareCode || 'NO_CODE'}
                                            </code>
                                            <button 
                                                className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                                                onClick={() => handleDelete(setup.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="card-gaming p-12 text-center">
                                <Shield className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                <h3 className="font-display font-bold text-white mb-2">No Presets Yet</h3>
                                <p className="text-sm text-slate-500 mb-6">Generate your first sensitivity preset to get started</p>
                                <Button onClick={() => navigate('/generate-sensitivity')} className="btn-gaming">
                                    Create Preset
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'activity' && (
                    <div className="card-gaming divide-y divide-white/[0.06] overflow-hidden">
                        {(activityFeed.length ? activityFeed : [
                            { id: '1', text: 'Claimed daily login bonus', created_at: '2m ago' },
                            { id: '2', text: 'Completed quest: First Blood', created_at: '1h ago' },
                            { id: '3', text: 'Updated sensitivity settings', created_at: '4h ago' },
                            { id: '4', text: 'Joined guild: Omega Strategy', created_at: '1d ago' },
                        ]).map(item => (
                            <div key={item.id} className="p-5 hover:bg-surface-elevated/50 transition-colors flex gap-4 items-center group">
                                <div className="w-10 h-10 rounded-xl bg-surface-low flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                    <History className="w-4 h-4 text-slate-500 group-hover:text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-white">{item.text}</p>
                                    <p className="text-[10px] text-slate-500 mt-1">{item.created_at}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-primary transition-colors" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
