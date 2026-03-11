import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Trophy, Zap, Clock, Activity, Target, Settings, Edit3, Trash2 } from 'lucide-react';
import { getSetups, deleteSetup } from '../utils/storage';

export default function Profile() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('stats');

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Mock data for MVP
    const recentActivity = [
        { id: 1, type: 'axp', message: 'Earned +50 AXP from setup submission', time: '2 hours ago' },
        { id: 2, type: 'setup', message: 'Submitted "God Tier M500"', time: '2 hours ago' },
        { id: 3, type: 'reward', message: 'Claimed Daily Login Reward (+20 AXP)', time: '1 day ago' }
    ];

    const mySetups = getSetups();

    const handleDelete = (id) => {
        if (confirm('Delete this setup?')) {
            deleteSetup(id);
            // Force re-render if needed, but since we're in EXECUTION mode and this is a mock, 
            // a simple state update would be better. For now, we rely on the next render.
            window.location.reload();
        }
    };

    return (
        <div className="space-y-6 pb-6 animate-slide-in max-w-2xl mx-auto">
            {/* Profile Header */}
            <div className="relative rounded-2xl bg-gradient-to-b from-primary-blue/30 to-gray-900 border border-gray-800 p-6 overlow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/10 rounded-full blur-[40px] pointer-events-none"></div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
                    <Avatar size="xl" ring className="ring-neon-cyan/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]" />

                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-3xl font-black text-white tracking-wide">{user.username}</h1>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
                            <span className="flex items-center text-axp-gold font-bold text-sm bg-gray-900/50 px-3 py-1 rounded-full border border-gray-700">
                                <Zap className="w-4 h-4 mr-1 text-axp-gold glow-gold" /> {user.axp} AXP
                            </span>
                            <span className="flex items-center text-neon-cyan font-bold text-sm bg-gray-900/50 px-3 py-1 rounded-full border border-gray-700">
                                <Trophy className="w-4 h-4 mr-1 text-neon-cyan" /> {user.rank}
                            </span>
                        </div>
                        <p className="flex items-center justify-center sm:justify-start text-xs text-gray-400 mt-4 font-medium">
                            <Clock className="w-3 h-3 mr-1" /> Joined {user.joinDate}
                        </p>
                    </div>

                    <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                        <Button variant="outline" size="sm" className="flex-1">
                            <Edit3 className="w-4 h-4 mr-2" /> Edit
                        </Button>
                        <Button variant="secondary" size="sm" className="flex-1">
                            <Settings className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-800">
                {[
                    { id: 'stats', label: 'Overview', icon: Target },
                    { id: 'setups', label: 'My Setups', icon: Edit3 },
                    { id: 'activity', label: 'Activity', icon: Activity }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold tracking-wide transition-all border-b-2
              ${activeTab === tab.id
                                ? 'text-neon-cyan border-neon-cyan bg-primary-blue/5'
                                : 'text-gray-500 border-transparent hover:text-gray-300'}`}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="pt-2">
                {activeTab === 'stats' && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <Card className="p-4 text-center">
                            <p className="text-gray-500 text-xs font-bold uppercase">Total AXP</p>
                            <p className="text-2xl font-black text-axp-gold mt-1">{user.axp}</p>
                        </Card>
                        <Card className="p-4 text-center">
                            <p className="text-gray-500 text-xs font-bold uppercase">Setups</p>
                            <p className="text-2xl font-black text-white mt-1">{mySetups.length}</p>
                        </Card>
                        <Card className="p-4 text-center col-span-2 sm:col-span-2 bg-gradient-to-r from-gray-900 to-[#1e3a8a]/20 border-primary-blue/30">
                            <p className="text-gray-400 text-xs font-bold uppercase">Next Rank Progression</p>
                            <div className="mt-3 relative w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-blue to-neon-cyan w-[65%]"></div>
                            </div>
                            <div className="flex justify-between mt-2 text-[10px] text-gray-500 font-bold uppercase">
                                <span>{user.rank}</span>
                                <span>Champion ({2000 - user.axp} AXP left)</span>
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'setups' && (
                    <div className="space-y-4">
                        {mySetups.length > 0 ? (
                            mySetups.map(setup => (
                                <Card key={setup.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-gray-800 bg-gray-900/40">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-gray-200 uppercase tracking-tighter italic">Preset Forge</h3>
                                            <span className="text-[10px] text-gray-500 font-medium">#{setup.id.split('-')[1]}</span>
                                        </div>
                                        <p className="text-[10px] text-neon-cyan font-black uppercase tracking-widest mt-1">
                                            {setup.formData?.brand} {setup.formData?.model} • {setup.formData?.playStyle}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <div className="bg-gray-800/80 px-4 py-1.5 rounded-lg border border-gray-700 flex-1 sm:flex-none text-center shadow-inner">
                                            <span className="text-xs text-neon-green font-mono font-bold tracking-[2px]">{setup.shareCode}</span>
                                        </div>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="bg-red-500/10 border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 text-red-500 transition-all p-2"
                                            onClick={() => handleDelete(setup.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <Edit3 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>You haven't shared any setups yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'activity' && (
                    <Card className="p-0 overflow-hidden divide-y divide-gray-800/50">
                        {recentActivity.map(item => (
                            <div key={item.id} className="p-4 hover:bg-gray-800/30 transition-colors flex gap-4 items-start">
                                <div className={`p-2 rounded-lg 
                  ${item.type === 'axp' ? 'bg-yellow-500/10 text-yellow-500' :
                                        item.type === 'setup' ? 'bg-cyan-500/10 text-cyan-500' :
                                            'bg-green-500/10 text-green-500'}`}>
                                    {item.type === 'axp' ? <Zap className="w-4 h-4" /> :
                                        item.type === 'setup' ? <Edit3 className="w-4 h-4" /> :
                                            <Trophy className="w-4 h-4" />}
                                </div>
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
