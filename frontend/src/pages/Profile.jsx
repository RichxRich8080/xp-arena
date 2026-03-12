import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Trophy, Zap, Clock, Activity, Target, Settings, Edit3, Trash2, Save, X } from 'lucide-react';
import { getSetups, deleteSetup } from '../utils/storage';
import api, { userService } from '../services/api';
import { useNotifications } from '../hooks/useNotifications';

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
                setActivityFeed(Array.isArray(activityRes.data) ? activityRes.data.slice(0, 6) : []);

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

    const recentActivity = activityFeed.length
        ? activityFeed.map((item, index) => ({
            id: `${item.id || index}`,
            message: item.text || 'Activity update',
            time: item.created_at || item.timestamp || 'just now'
        }))
        : [
            { id: 'fallback-1', message: 'Earned +50 AXP from setup submission', time: 'recently' },
            { id: 'fallback-2', message: 'Generated and saved a setup', time: 'recently' },
        ];

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
        <div className="space-y-6 pb-6 animate-slide-in max-w-3xl mx-auto">
            <div className="relative rounded-2xl border p-6 overflow-hidden theme-surface">
                <div className="absolute top-0 right-0 w-36 h-36 rounded-full blur-[40px] pointer-events-none" style={{ background: 'color-mix(in srgb, var(--app-accent) 22%, transparent)' }} />
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
                    <Avatar size="xl" ring className="ring-neon-cyan/50" />
                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-3xl font-black text-white tracking-wide">{user.username}</h1>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
                            <span className="flex items-center text-axp-gold font-bold text-sm bg-gray-900/50 px-3 py-1 rounded-full border border-gray-700">
                                <Zap className="w-4 h-4 mr-1" /> {Number(user.axp || 0)} AXP
                            </span>
                            <span className="flex items-center text-neon-cyan font-bold text-sm bg-gray-900/50 px-3 py-1 rounded-full border border-gray-700">
                                <Trophy className="w-4 h-4 mr-1" /> {user.rank || 'Rookie'}
                            </span>
                        </div>
                        <p className="flex items-center justify-center sm:justify-start text-xs text-gray-400 mt-4 font-medium">
                            <Clock className="w-3 h-3 mr-1" /> Joined {joinedLabel}
                        </p>
                    </div>

                    <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => setIsEditing(true)}>
                            <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
                        </Button>
                        <Button variant="secondary" size="sm" className="flex-1" onClick={() => navigate('/settings')}>
                            <Settings className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {isEditing && (
                <Card className="theme-surface p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-white uppercase tracking-wider">Edit Profile</h3>
                        <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm" placeholder="Username" value={profileForm.username} onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })} />
                        <input className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm" placeholder="Avatar URL" value={profileForm.avatar} onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })} />
                        <input type="number" min="0" className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm" placeholder="Likes" value={profileForm.likes} onChange={(e) => setProfileForm({ ...profileForm, likes: Number(e.target.value || 0) })} />
                        <input type="number" min="0" className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm" placeholder="Wins" value={profileForm.wins} onChange={(e) => setProfileForm({ ...profileForm, wins: Number(e.target.value || 0) })} />
                    </div>
                    <Button variant="neonCyan" size="sm" onClick={handleProfileSave}><Save className="w-4 h-4" /> Save Changes</Button>
                </Card>
            )}

            <div className="flex border-b border-gray-800">
                {[
                    { id: 'stats', label: 'Overview', icon: Target },
                    { id: 'setups', label: 'My Setups', icon: Edit3 },
                    { id: 'activity', label: 'Activity', icon: Activity }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold tracking-wide transition-all border-b-2 ${activeTab === tab.id ? 'text-neon-cyan border-neon-cyan bg-primary-blue/5' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="pt-2">
                {activeTab === 'stats' && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <Card className="p-4 text-center"><p className="text-gray-500 text-xs font-bold uppercase">Total AXP</p><p className="text-2xl font-black text-axp-gold mt-1">{Number(user.axp || 0)}</p></Card>
                        <Card className="p-4 text-center"><p className="text-gray-500 text-xs font-bold uppercase">Rank</p><p className="text-lg font-black text-neon-cyan mt-2">{user.rank || 'Rookie'}</p></Card>
                        <Card className="p-4 text-center"><p className="text-gray-500 text-xs font-bold uppercase">Saved Setups</p><p className="text-2xl font-black text-white mt-1">{mySetups.length}</p></Card>
                        <Card className="p-4 text-center"><p className="text-gray-500 text-xs font-bold uppercase">Level</p><p className="text-2xl font-black text-emerald-400 mt-1">{user.level || 1}</p></Card>
                    </div>
                )}

                {activeTab === 'setups' && (
                    <div className="space-y-4">
                        {isLoading ? (
                            <Card className="p-6 text-center text-gray-400">Loading setups...</Card>
                        ) : mySetups.length > 0 ? (
                            mySetups.map(setup => (
                                <Card key={setup.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-gray-800 bg-gray-900/40">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-200 uppercase tracking-tight">Preset Forge</h3>
                                        <p className="text-[11px] text-neon-cyan font-black uppercase tracking-widest mt-1">
                                            {setup.formData?.brand || 'Unknown'} {setup.formData?.model || 'Device'} • {setup.formData?.playStyle || 'Balanced'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <div className="bg-gray-800/80 px-4 py-1.5 rounded-lg border border-gray-700 flex-1 sm:flex-none text-center shadow-inner">
                                            <span className="text-xs text-neon-green font-mono font-bold tracking-[2px]">{setup.shareCode || setup.id}</span>
                                        </div>
                                        <Button variant="secondary" size="sm" className="bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-500 p-2" onClick={() => handleDelete(setup.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <Edit3 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>You haven't saved any setups yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'activity' && (
                    <Card className="p-0 overflow-hidden divide-y divide-gray-800/50">
                        {recentActivity.map(item => (
                            <div key={item.id} className="p-4 hover:bg-gray-800/30 transition-colors flex gap-4 items-start">
                                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500"><Activity className="w-4 h-4" /></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-300">{item.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </Card>
                )}
            </div>
        </div>
    );
}
