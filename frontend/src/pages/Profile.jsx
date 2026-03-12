import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Trophy, Zap, Clock, Activity, Target, Settings, Edit3, Trash2, Save, X, Share2, Shield, Fingerprint, ChevronRight } from 'lucide-react';
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
        <div className="space-y-10 pb-20 animate-slide-in">
            {/* DOSSIER HEADER */}
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/10 to-transparent blur-3xl opacity-30" />
                
                <div className="glass-panel p-8 md:p-12 relative overflow-hidden">
                    {/* Background ID Watermark */}
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] font-display font-black text-8xl italic select-none pointer-events-none uppercase">
                        DOSSIER_{user.id?.toString().slice(-4) || 'P_ID'}
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                        <div className="relative group/avatar">
                            <div className="absolute -inset-2 bg-gradient-to-tr from-primary via-accent-cyan to-accent-violet rounded-full opacity-20 group-hover/avatar:opacity-100 transition-opacity blur-lg" />
                            <Avatar size="xl" ring className="ring-white/10 ring-8 shadow-2xl relative" />
                            <div className="absolute -bottom-2 -right-2 bg-accent-cyan text-background w-10 h-10 rounded-2xl flex items-center justify-center font-display font-black text-xs shadow-[0_0_20px_rgba(6,182,212,0.5)] border-4 border-background">
                                <Shield className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-end gap-3 mb-6">
                                <h1 className="text-4xl md:text-5xl font-display font-black text-white italic tracking-tighter uppercase leading-none">
                                    {user.username}
                                </h1>
                                <span className="text-accent-cyan font-display font-bold text-xs tracking-[0.3em] uppercase mb-1">
                                    // ELITE_AUDITOR
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <div className="glass-panel px-4 py-2 border-white/5 flex items-center gap-3">
                                    <Zap className="w-4 h-4 text-axp-gold" />
                                    <span className="font-display font-black text-white text-sm tracking-widest">{user.axp || 0} <span className="text-gray-500">AXP</span></span>
                                </div>
                                <div className="glass-panel px-4 py-2 border-white/5 flex items-center gap-3">
                                    <Trophy className="w-4 h-4 text-accent-cyan" />
                                    <span className="font-display font-black text-white text-sm tracking-widest">{user.rank || 'PROTO'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-display font-bold text-gray-500 uppercase tracking-widest ml-2">
                                    <Clock className="w-3.5 h-3.5" /> Established {joinedLabel}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
                            <Button variant="secondary" size="md" className="flex-1 md:w-full" onClick={() => setIsEditing(true)}>
                                <Edit3 className="w-4 h-4 mr-2" /> EDIT_DOSSIER
                            </Button>
                            <Button variant="ghost" size="md" className="border border-white/5" onClick={() => navigate('/settings')}>
                                <Settings className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* EDITING MODE */}
            {isEditing && (
                <Card className="border-accent-cyan/20 animate-slide-in p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-display font-black text-lg text-white uppercase tracking-widest flex items-center gap-3">
                            <Fingerprint className="w-5 h-5 text-accent-cyan" />
                            Dossier Recalibration
                        </h3>
                        <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-display font-black text-gray-500 uppercase tracking-widest ml-4">Codename</label>
                            <input className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-sm text-white focus:border-accent-cyan outline-none transition-colors" value={profileForm.username} onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-display font-black text-gray-500 uppercase tracking-widest ml-4">Avatar Uplink</label>
                            <input className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-sm text-white focus:border-accent-cyan outline-none transition-colors" value={profileForm.avatar} onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })} />
                        </div>
                    </div>
                    
                    <Button variant="primary" size="lg" className="w-full" onClick={handleProfileSave}>
                        PUSH_CHANGES
                    </Button>
                </Card>
            )}

            {/* NAVIGATION TABS */}
            <div className="flex items-center justify-center gap-2 p-1 bg-white/5 rounded-2xl w-fit mx-auto border border-white/5">
                {[
                    { id: 'stats', label: 'ANALYTICS', icon: Activity },
                    { id: 'setups', label: 'VAULT', icon: Shield },
                    { id: 'activity', label: 'LOGS', icon: Clock }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-3 px-8 py-3 rounded-xl transition-all duration-300 font-display font-black text-[10px] tracking-widest uppercase",
                            activeTab === tab.id 
                                ? 'bg-accent-cyan text-background shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                        )}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* CONTENT AREA */}
            <div className="animate-slide-in">
                {activeTab === 'stats' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="p-8 text-center border-white/5 group hover:border-axp-gold/20">
                            <p className="text-gray-500 text-[10px] font-display font-black uppercase tracking-widest mb-4">Total AXP</p>
                            <p className="text-4xl font-display font-black text-axp-gold group-hover:glow-gold transition-all">{Number(user.axp || 0)}</p>
                            <div className="mt-6 flex items-center justify-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-axp-gold animate-pulse" />
                                <span className="text-[8px] font-display font-bold text-gray-600 uppercase tracking-widest">Global Currency</span>
                            </div>
                        </Card>
                        <Card className="p-8 text-center border-white/5 group hover:border-accent-cyan/20">
                            <p className="text-gray-500 text-[10px] font-display font-black uppercase tracking-widest mb-4">Dossier Rank</p>
                            <p className="text-2xl font-display font-black text-accent-cyan uppercase italic group-hover:glow-cyan transition-all">{user.rank || 'PROTO'}</p>
                            <div className="mt-6 flex items-center justify-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
                                <span className="text-[8px] font-display font-bold text-gray-600 uppercase tracking-widest">Verified Tier</span>
                            </div>
                        </Card>
                        <Card className="p-8 text-center border-white/5 group hover:border-white/20">
                            <p className="text-gray-500 text-[10px] font-display font-black uppercase tracking-widest mb-4">Vault Assets</p>
                            <p className="text-4xl font-display font-black text-white group-hover:scale-110 transition-transform">{mySetups.length}</p>
                            <div className="mt-6 flex items-center justify-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                <span className="text-[8px] font-display font-bold text-gray-600 uppercase tracking-widest">Saved Presets</span>
                            </div>
                        </Card>
                        <Card className="p-8 text-center border-white/5 group hover:border-accent-violet/20">
                            <p className="text-gray-500 text-[10px] font-display font-black uppercase tracking-widest mb-4">Clearance</p>
                            <p className="text-4xl font-display font-black text-accent-violet group-hover:glow-violet transition-all">{user.level || 1}</p>
                            <div className="mt-6 flex items-center justify-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent-violet animate-pulse" />
                                <span className="text-[8px] font-display font-bold text-gray-600 uppercase tracking-widest">Auth_Level</span>
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'setups' && (
                    <div className="space-y-6">
                        {isLoading ? (
                            <Card className="p-12 text-center border-white/5">
                                <Activity className="w-12 h-12 text-accent-cyan animate-spin mx-auto mb-4 opacity-20" />
                                <p className="font-display font-black text-gray-500 uppercase tracking-[0.2em]">Syncing Vault...</p>
                            </Card>
                        ) : mySetups.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {mySetups.map(setup => (
                                    <div key={setup.id} className="glass-panel p-6 flex items-center justify-between gap-6 border-white/5 group">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-1.5 h-6 bg-accent-cyan rounded-full" />
                                                <h3 className="font-display font-black text-white uppercase tracking-wider truncate">PRESET_ALPHA_{setup.id?.toString().slice(-4)}</h3>
                                            </div>
                                            <p className="text-[9px] text-accent-cyan font-display font-bold uppercase tracking-[0.2em] ml-5">
                                                {setup.formData?.brand || 'SYSTEM'} // {setup.formData?.model || 'DEFAULT'} // {setup.formData?.playStyle || 'HYBRID'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 group-hover:border-accent-cyan/30 transition-colors">
                                                <span className="text-[10px] text-accent-cyan font-display font-black tracking-[0.2em]">{setup.shareCode || 'NO_CODE'}</span>
                                            </div>
                                            <button 
                                                className="p-3 bg-accent-rose/10 hover:bg-accent-rose text-accent-rose hover:text-white rounded-xl transition-all border border-accent-rose/20"
                                                onClick={() => handleDelete(setup.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 glass-panel border-white/5">
                                <Shield className="w-16 h-16 mx-auto mb-6 opacity-10 text-white" />
                                <p className="font-display font-black text-gray-500 uppercase tracking-[0.3em]">Vault is Currently Empty</p>
                                <Button variant="secondary" size="sm" className="mt-8" onClick={() => navigate('/generate-sensitivity')}>INITIALIZE_FORGE</Button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'activity' && (
                    <div className="glass-panel border-white/5 divide-y divide-white/5 overflow-hidden">
                        {(activityFeed.length ? activityFeed : [
                            { id: '1', text: 'Neural Interface established for sector 7', created_at: '2m ago' },
                            { id: '2', text: 'Vault synchronization complete', created_at: '1h ago' },
                            { id: '3', text: 'Dossier entry updated via secure uplink', created_at: '4h ago' },
                        ]).map(item => (
                            <div key={item.id} className="p-6 hover:bg-white/[0.02] transition-colors flex gap-6 items-center group">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-accent-cyan/20 group-hover:bg-accent-cyan/10 transition-all">
                                    <Activity className="w-4 h-4 text-gray-500 group-hover:text-accent-cyan" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-display font-bold text-gray-300 uppercase tracking-widest">{item.text}</p>
                                    <p className="text-[8px] font-display font-bold text-gray-600 uppercase tracking-[0.2em] mt-1">{item.created_at || 'PROTO_TIME'}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-800 group-hover:text-accent-cyan transition-colors" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
