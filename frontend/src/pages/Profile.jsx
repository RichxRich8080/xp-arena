import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Trophy, Zap, Clock, Activity, Target, Settings, Edit3, Trash2, Save, X, Share2, Shield, Fingerprint, ChevronRight, User, BarChart3, History } from 'lucide-react';
import { getSetups, deleteSetup } from '../utils/storage';
import api, { userService } from '../services/api';
import { useNotifications } from '../hooks/useNotifications';
import { cn } from '../utils/cn';

export default function Profile() {
    const { user, updateUser } = useAuth();
    const { addNotification } = useNotifications();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('stats');
    const [mySetups, setMySetups] = useState([]);
    const [activityFeed, setActivityFeed] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [profileForm, setProfileForm] = useState({ username: '', avatar: '', likes: 0, wins: 0 });

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

    return (
        <div className="space-y-8 pb-12 animate-fade-in">
            {/* Profile Header */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-white/5 shadow-sm">
                <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none select-none">
                    <User className="w-64 h-64" />
                </div>
                
                <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
                    <div className="relative group/avatar">
                        <div className="absolute -inset-1.5 bg-primary/20 rounded-full blur-md opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
                        <Avatar size="xl" className="relative shadow-2xl border-4 border-slate-800" />
                        <div className="absolute -bottom-1 -right-1 bg-primary text-white w-8 h-8 rounded-lg flex items-center justify-center shadow-lg border-2 border-slate-900">
                            <Shield className="w-4 h-4" />
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div className="space-y-1">
                            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                                {user.username}
                            </h1>
                            <p className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Verified Member</p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <div className="bg-slate-800/50 px-4 py-2 rounded-lg border border-white/5 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-amber-500" />
                                <span className="text-sm font-bold text-white tracking-tight">{user.axp || 0} <span className="text-slate-500 font-medium">Points</span></span>
                            </div>
                            <div className="bg-slate-800/50 px-4 py-2 rounded-lg border border-white/5 flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-primary" />
                                <span className="text-sm font-bold text-white tracking-tight">{user.rank === 'Arena Master' ? 'Elite' : (user.rank || 'Beginner')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                <Clock className="w-3.5 h-3.5" /> Established {joinedLabel}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="secondary" size="md" className="flex-1 md:px-6" onClick={() => setIsEditing(true)}>
                            <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
                        </Button>
                        <Button variant="ghost" size="md" className="border border-white/5" onClick={() => navigate('/settings')}>
                            <Settings className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Profile Content */}
            <div className="space-y-8">
                {/* Editing Form */}
                {isEditing && (
                    <Card className="p-8 border-primary/20 animate-fade-in space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-3">
                                <Fingerprint className="w-5 h-5 text-primary" />
                                Profile Settings
                            </h3>
                            <button onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Display Name</label>
                                <input className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary outline-none transition-colors" value={profileForm.username} onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Avatar URL</label>
                                <input className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary outline-none transition-colors" value={profileForm.avatar} onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })} placeholder="https://..." />
                            </div>
                        </div>
                        
                        <Button variant="primary" size="md" className="w-full" onClick={handleProfileSave}>
                            Save Changes
                        </Button>
                    </Card>
                )}

                {/* Tabs */}
                <div className="flex items-center justify-center p-1 bg-slate-900/50 rounded-xl border border-white/5 w-fit mx-auto">
                    {[
                        { id: 'stats', label: 'Stats', icon: BarChart3 },
                        { id: 'setups', label: 'Presets', icon: Shield },
                        { id: 'activity', label: 'Log', icon: History }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2 rounded-lg transition-all duration-200 text-xs font-bold uppercase tracking-wider",
                                activeTab === tab.id 
                                    ? 'bg-primary text-white shadow-lg' 
                                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                            )}
                        >
                            <tab.icon className="w-3.5 h-3.5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Views */}
                <div className="animate-fade-in">
                    {activeTab === 'stats' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="p-8 text-center border-white/5 hover:bg-slate-800/50 transition-colors">
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4">Reward Points</p>
                                <p className="text-4xl font-bold text-amber-500 tracking-tight">{Number(user.axp || 0).toLocaleString()}</p>
                            </Card>
                            <Card className="p-8 text-center border-white/5 hover:bg-slate-800/50 transition-colors">
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4">Current Status</p>
                                <p className="text-2xl font-bold text-primary uppercase">{user.rank === 'Arena Master' ? 'Elite' : (user.rank || 'Standard')}</p>
                            </Card>
                            <Card className="p-8 text-center border-white/5 hover:bg-slate-800/50 transition-colors">
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4">Saved Presets</p>
                                <p className="text-4xl font-bold text-white tracking-tight">{mySetups.length}</p>
                            </Card>
                            <Card className="p-8 text-center border-white/5 hover:bg-slate-800/50 transition-colors">
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4">Platform Level</p>
                                <p className="text-4xl font-bold text-purple-400 tracking-tight">{user.level || 1}</p>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'setups' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {isLoading ? (
                                <div className="col-span-full py-12 text-center">
                                    <Activity className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading Vault...</p>
                                </div>
                            ) : mySetups.length > 0 ? (
                                mySetups.map(setup => (
                                    <Card key={setup.id} className="p-6 flex items-center justify-between border-white/5 hover:bg-slate-800/50 transition-colors group">
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-white tracking-tight">
                                                {setup.formData?.brand || 'Generic'} {setup.formData?.model || 'Device'}
                                            </h3>
                                            <p className="text-[10px] text-primary font-bold uppercase tracking-wider">
                                                {setup.formData?.playStyle || 'Configed'} Setup
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="bg-slate-900 border border-white/5 px-3 py-1.5 rounded-lg">
                                                <code className="text-xs font-mono text-slate-400">{setup.shareCode || 'NO_CODE'}</code>
                                            </div>
                                            <button 
                                                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                onClick={() => handleDelete(setup.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20 bg-slate-900/50 rounded-2xl border border-white/5">
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-4">No presets found</p>
                                    <Button variant="outline" size="sm" onClick={() => navigate('/generate-sensitivity')}>Create Your First</Button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'activity' && (
                        <Card className="divide-y divide-white/5 overflow-hidden border-white/5">
                            {(activityFeed.length ? activityFeed : [
                                { id: '1', text: 'Daily bonus claimed successfully', created_at: '2m ago' },
                                { id: '2', text: 'Cloud synchronization complete', created_at: '1h ago' },
                                { id: '3', text: 'Profile information updated', created_at: '4h ago' },
                            ]).map(item => (
                                <div key={item.id} className="p-6 hover:bg-slate-800/30 transition-colors flex gap-6 items-center group">
                                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-white/5 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                                        <History className="w-4 h-4 text-slate-500 group-hover:text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-300 tracking-tight">{item.text}</p>
                                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">{item.created_at}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-primary transition-colors" />
                                </div>
                            ))}
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
