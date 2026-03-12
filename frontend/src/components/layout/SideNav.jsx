import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
    Menu, X, LayoutDashboard, User, Settings, LogOut, 
    Zap, Trophy, Globe, Crown, Shield, Activity, 
    Gift, Swords, Users, Info, MessageSquare, HeartHandshake, Eye
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
            title: 'CORE_OPERATIONS',
            items: [
                { icon: LayoutDashboard, label: 'COMMAND_CENTER', path: '/dashboard' },
                { icon: User, label: 'PLAYER_DOSSIER', path: '/profile' },
                { icon: Zap, label: 'SENS_CALIBRATION', path: '/tool' },
            ]
        },
        {
            title: 'ARENA_PROGRESSION',
            items: [
                { icon: Trophy, label: 'HALL_OF_FAME', path: '/leaderboard' },
                { icon: Swords, label: 'SYNDICATE_CUP', path: '/tournaments' },
                { icon: Users, label: 'GUILD_HUBS', path: '/clans' },
                { icon: Gift, label: 'MYSTERY_VAULT', path: '/mystery' },
            ]
        },
        {
            title: 'INFRASTRUCTURE',
            items: [
                { icon: Crown, label: 'ELITE_ACCESS', path: '/premium' },
                { icon: Globe, label: 'ARENA_ECOSYSTEM', path: '/ecosystem' },
                { icon: Settings, label: 'SYSTEM_SETTINGS', path: '/settings' },
                { icon: Eye, label: 'STYLE_PREVIEW', path: '/style-preview' },
            ]
        },
        {
            title: 'NETWORK_LINK',
            items: [
                { icon: Info, label: 'ABOUT_MISSION', path: '/about' },
                { icon: MessageSquare, label: 'SUPPORT_NODE', path: '/support' },
                { icon: HeartHandshake, label: 'CONTACT_COMMAND', path: '/contact' },
            ]
        }
    ];

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-24 left-6 z-[60] p-4 glass-panel border-accent-cyan/20 text-accent-cyan hover:scale-105 transition-all md:hidden shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                aria-label="Open menu"
            >
                <Menu className="w-5 h-5" />
            </button>

            {isOpen && <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[70] md:hidden" onClick={() => setIsOpen(false)} />}

            <aside className={cn(
                'fixed md:static top-0 left-0 bottom-0 w-80 md:w-full bg-background/98 md:bg-transparent border-r border-white/5 z-[80] transform transition-transform duration-700 ease-in-out flex flex-col',
                isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            )}>
                {/* Profile Header */}
                <div className="p-8 border-b border-white/5 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="relative group cursor-pointer" onClick={() => navigate('/profile')}>
                            <div className="absolute -inset-2 bg-accent-cyan/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Avatar size="lg" ring className="relative z-10" />
                        </div>
                        <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-500 hover:text-white p-2" aria-label="Close menu">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    
                    <div className="space-y-1">
                        <p className="font-display font-black text-xl text-white tracking-widest uppercase truncate italic">{user?.username || 'GUEST_PROTO'}</p>
                        <div className="flex items-center gap-3">
                            <div className="px-2 py-0.5 bg-accent-cyan/10 border border-accent-cyan/20 rounded text-[8px] font-black text-accent-cyan uppercase tracking-widest">LVL_0{user?.level || 1}</div>
                            <div className="h-1 w-1 rounded-full bg-white/20" />
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] italic">{user?.axp || 0}_AXP</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Sections */}
                <div className="flex-1 p-6 space-y-10 overflow-y-auto custom-scrollbar">
                    {sections.map((section) => (
                        <div key={section.title} className="space-y-4">
                            <h3 className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em] ml-2 italic">{section.title}</h3>
                            <div className="space-y-2">
                                {section.items.map((item) => (
                                    <NavLink
                                        key={item.label}
                                        to={item.path}
                                        onClick={() => setIsOpen(false)}
                                        className={({ isActive }) => cn(
                                            'flex items-center gap-5 px-5 py-4 rounded-2xl text-[10px] font-display font-black uppercase tracking-[0.25em] transition-all duration-500 relative group overflow-hidden',
                                            isActive 
                                                ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 shadow-[0_10px_30px_rgba(6,182,212,0.1)]' 
                                                : 'text-gray-500 hover:text-white hover:bg-white/[0.03] border border-transparent'
                                        )}
                                    >
                                        <item.icon className={cn("w-4.5 h-4.5 transition-all group-hover:scale-110", isActive ? "text-accent-cyan" : "text-gray-600 group-hover:text-white")} />
                                        <span className="relative z-10">{item.label}</span>
                                        {isActive && <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Session Control */}
                <div className="p-6 border-t border-white/5">
                    <button
                        onClick={() => { logout(); setIsOpen(false); navigate('/login'); }}
                        className="w-full flex items-center justify-center gap-4 py-5 rounded-[1.5rem] text-[10px] font-display font-black uppercase tracking-[0.3em] text-accent-rose hover:bg-accent-rose/10 border border-transparent hover:border-accent-rose/20 transition-all group"
                    >
                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
                        TERMINATE_SESSION
                    </button>
                    
                    <div className="mt-6 flex justify-center">
                        <div className="flex items-center gap-2 opacity-10">
                            <Activity className="w-3 h-3 text-white" />
                            <span className="text-[7px] font-black text-white uppercase tracking-[0.2em]">ARENA_SECURE_LINK_v8.4.2</span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
