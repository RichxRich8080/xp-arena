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
            title: 'Platform',
            items: [
                { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
                { icon: User, label: 'Profile', path: '/profile' },
                { icon: Zap, label: 'Calibration', path: '/tool' },
            ]
        },
        {
            title: 'Competition',
            items: [
                { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
                { icon: Swords, label: 'Tournaments', path: '/tournaments' },
                { icon: Users, label: 'Guilds', path: '/clans' },
                { icon: Gift, label: 'Rewards', path: '/mystery' },
            ]
        },
        {
            title: 'System',
            items: [
                { icon: Crown, label: 'Premium', path: '/premium' },
                { icon: Globe, label: 'Ecosystem', path: '/ecosystem' },
                { icon: Settings, label: 'Settings', path: '/settings' },
            ]
        },
        {
            title: 'Support',
            items: [
                { icon: Info, label: 'About', path: '/about' },
                { icon: MessageSquare, label: 'Support', path: '/support' },
                { icon: HeartHandshake, label: 'Contact', path: '/contact' },
            ]
        }
    ];

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-[160] p-4 bg-primary text-white rounded-full shadow-lg md:hidden"
                aria-label="Open menu"
            >
                <Menu className="w-5 h-5" />
            </button>

            {isOpen && <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[170] md:hidden" onClick={() => setIsOpen(false)} />}

            <aside className={cn(
                'fixed md:static top-0 left-0 bottom-0 w-72 md:w-full bg-slate-900 md:bg-transparent border-r border-white/5 z-[180] transform transition-transform duration-300 ease-in-out flex flex-col',
                isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            )}>
                {/* Mobile Drawer Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between md:hidden">
                    <span className="font-bold text-white">Arena Menu</span>
                    <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white p-2">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation Sections */}
                <div className="flex-1 p-4 space-y-8 overflow-y-auto">
                    {sections.map((section) => (
                        <div key={section.title} className="space-y-1">
                            <h3 className="px-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">{section.title}</h3>
                            <div className="space-y-0.5">
                                {section.items.map((item) => (
                                    <NavLink
                                        key={item.label}
                                        to={item.path}
                                        onClick={() => setIsOpen(false)}
                                        className={({ isActive }) => cn(
                                            'flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-colors duration-200 group',
                                            isActive 
                                                ? 'bg-primary/10 text-primary font-medium' 
                                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        )}
                                    >
                                        <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-slate-500 group-hover:text-slate-300")} />
                                        <span>{item.label}</span>
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Session Control */}
                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={() => { logout(); setIsOpen(false); navigate('/login'); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                        <LogOut className="w-4 h-4" /> 
                        Logout
                    </button>
                    <div className="mt-4 px-4">
                        <span className="text-[10px] text-slate-600 font-medium">v8.5.0 Stable Build</span>
                    </div>
                </div>
            </aside>
        </>
    );
}
