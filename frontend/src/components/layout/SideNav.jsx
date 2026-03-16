import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
    Menu, X, LayoutDashboard, User, Settings, LogOut, 
    Zap, Trophy, Globe, Crown, Shield, Activity, 
    Gift, Swords, Users, Info, MessageSquare, HeartHandshake, Eye, Target, Sparkles, Star
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../ui/Avatar';
import { cn } from '../../utils/cn';

export function SideNav() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const sections = [
        {
            title: 'Arena',
            items: [
                { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', badge: null },
                { icon: User, label: 'Profile', path: '/profile', badge: null },
                { icon: Target, label: 'Sens Generator', path: '/generate-sensitivity', badge: 'AI', badgeColor: 'bg-cyan-500' },
            ]
        },
        {
            title: 'Competition',
            items: [
                { icon: Trophy, label: 'Leaderboard', path: '/leaderboard', badge: null },
                { icon: Swords, label: 'Tournaments', path: '/tournaments', badge: 'Live', badgeColor: 'bg-rose-500' },
                { icon: Users, label: 'Guilds', path: '/guilds', badge: null },
                { icon: Star, label: 'Quests', path: '/quests', badge: '3', badgeColor: 'bg-amber-500' },
            ]
        },
        {
            title: 'Rewards',
            items: [
                { icon: Gift, label: 'Mystery Box', path: '/mystery', badge: null },
                { icon: Crown, label: 'Premium', path: '/premium', badge: 'PRO', badgeColor: 'bg-gradient-to-r from-amber-500 to-orange-500' },
            ]
        },
        {
            title: 'System',
            items: [
                { icon: Globe, label: 'Ecosystem', path: '/ecosystem', badge: null },
                { icon: Settings, label: 'Settings', path: '/settings', badge: null },
            ]
        },
        {
            title: 'Support',
            items: [
                { icon: Info, label: 'About', path: '/about', badge: null },
                { icon: MessageSquare, label: 'Support', path: '/support', badge: null },
                { icon: HeartHandshake, label: 'Contact', path: '/contact', badge: null },
            ]
        }
    ];

    return (
        <>
            {/* Mobile FAB */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-4 z-[160] p-4 bg-gradient-to-r from-primary to-accent-cyan text-white rounded-2xl shadow-glow-md md:hidden animate-pulse-ring"
                aria-label="Open menu"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[170] md:hidden" 
                    onClick={() => setIsOpen(false)} 
                />
            )}

            <aside className={cn(
                'fixed md:static top-0 left-0 bottom-0 w-80 md:w-full bg-surface-default/95 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border-r border-white/[0.06] z-[180] transform transition-transform duration-300 ease-out flex flex-col',
                isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            )}>
                {/* Mobile Drawer Header */}
                <div className="p-6 border-b border-white/[0.06] flex items-center justify-between md:hidden">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center">
                            <span className="font-display font-black text-white text-sm">XP</span>
                        </div>
                        <span className="font-display font-bold text-white">Arena Menu</span>
                    </div>
                    <button 
                        onClick={() => setIsOpen(false)} 
                        className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* User Card - Mobile Only */}
                {user && (
                    <div className="p-4 md:hidden">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-elevated/60 border border-white/[0.06]">
                            <Avatar size="md" src={user.avatar} className="ring-2 ring-primary/30" />
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-white truncate">{user.username}</p>
                                <p className="text-xs text-primary font-medium">{user.rank || 'Bronze'} - Lv.{user.level || 1}</p>
                            </div>
                            <div className="flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-lg">
                                <Zap className="w-4 h-4 text-amber-500" />
                                <span className="text-sm font-bold text-amber-400">{user.axp?.toLocaleString() || 0}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Sections */}
                <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                    {sections.map((section) => (
                        <div key={section.title} className="space-y-1">
                            <h3 className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{section.title}</h3>
                            <div className="space-y-0.5">
                                {section.items.map((item) => (
                                    <NavLink
                                        key={item.label}
                                        to={item.path}
                                        onClick={() => setIsOpen(false)}
                                        className={({ isActive }) => cn(
                                            'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 group relative',
                                            isActive 
                                                ? 'bg-primary/10 text-primary font-semibold' 
                                                : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                                        )}
                                    >
                                        {({ isActive }) => (
                                            <>
                                                {isActive && (
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                                                )}
                                                <item.icon className={cn(
                                                    "w-4 h-4 transition-colors",
                                                    isActive ? "text-primary" : "text-slate-500 group-hover:text-slate-300"
                                                )} />
                                                <span className="flex-1">{item.label}</span>
                                                {item.badge && (
                                                    <span className={cn(
                                                        "text-[9px] font-bold px-1.5 py-0.5 rounded text-white",
                                                        item.badgeColor || 'bg-slate-600'
                                                    )}>
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Session Control */}
                <div className="p-4 border-t border-white/[0.06]">
                    <button
                        onClick={() => { logout(); setIsOpen(false); navigate('/login'); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all"
                    >
                        <LogOut className="w-4 h-4" /> 
                        Logout
                    </button>
                    <div className="mt-4 px-4 flex items-center justify-between">
                        <span className="text-[10px] text-slate-600 font-mono">XP Arena v5.0</span>
                        <span className="flex items-center gap-1 text-[10px] text-emerald-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Online
                        </span>
                    </div>
                </div>
            </aside>
        </>
    );
}
