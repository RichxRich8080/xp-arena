import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard, FolderOpen, Trophy, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../ui/Avatar';
import { cn } from '../../utils/cn';

export function SideNav() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: FolderOpen, label: 'My Setups', path: '/profile' },
        { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
        { icon: User, label: 'Profile', path: '/profile' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-20 left-4 z-40 p-2.5 bg-black/50 border border-white/10 rounded-xl text-gray-200 hover:text-white md:hidden"
                aria-label="Open menu"
            >
                <Menu className="w-5 h-5" />
            </button>

            {isOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden" onClick={() => setIsOpen(false)} />}

            <aside className={cn(
                'fixed md:static top-0 left-0 bottom-0 w-72 md:w-64 bg-[#0b1120]/90 md:bg-transparent border-r border-white/10 z-50 transform transition-transform duration-300 flex flex-col',
                isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            )}>
                <div className="p-5 border-b border-white/10 flex items-center justify-between">
                    <div className="flex gap-3 items-center">
                        <Avatar size="sm" ring />
                        <div>
                            <p className="font-bold text-gray-100">{user?.username || 'Guest'}</p>
                            <p className="text-xs text-cyan-300">{user?.axp || 0} AXP</p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-400 hover:text-white" aria-label="Close menu">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all',
                                isActive ? 'bg-white/10 text-white border border-white/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            )}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </NavLink>
                    ))}
                </div>

                <div className="p-3 border-t border-white/10 space-y-2">
                    <button
                        onClick={() => { navigate('/settings'); setIsOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5"
                    >
                        <Settings className="w-4 h-4" /> Quick Settings
                    </button>
                    <button
                        onClick={() => { logout(); setIsOpen(false); navigate('/login'); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-300 hover:bg-red-500/10"
                    >
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </aside>
        </>
    );
}
