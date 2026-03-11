import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Home, FolderOpen, Trophy, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../ui/Avatar';
import { cn } from '../../utils/cn';

export function SideNav() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();

    const menuItems = [
        { icon: Home, label: 'Dashboard', path: '/dashboard' },
        { icon: FolderOpen, label: 'My Setups', path: '/profile?tab=setups' },
        { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
        { icon: User, label: 'Profile', path: '/profile' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <>
            {/* Trigger Button (Floating on the left side) */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 left-4 z-40 p-3 bg-gray-900 border border-gray-700 rounded-full shadow-lg text-gray-300 hover:text-white hover:border-gray-500 transition-all hover:scale-105 md:hidden"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Slide-out Menu */}
            <div className={cn(
                "fixed top-0 left-0 bottom-0 w-72 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800 z-50 transform transition-transform duration-300 ease-out flex flex-col",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Header */}
                <div className="p-6 border-b border-gray-800 flex justify-between items-start">
                    <div className="flex gap-3 items-center">
                        <Avatar size="sm" ring />
                        <div>
                            <p className="font-bold text-gray-200">{user?.username || 'Guest'}</p>
                            <p className="text-xs text-axp-gold font-medium">{user?.axp || 0} AXP</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto py-4">
                    <div className="px-3 space-y-1">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.label}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) => cn(
                                    "flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all group",
                                    isActive
                                        ? "bg-primary-blue/20 text-neon-cyan border border-primary-blue/30"
                                        : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
                                )}
                            >
                                {({ isActive }) => (
                                    <>
                                        <item.icon className={cn(
                                            "w-5 h-5 transition-colors group-hover:text-neon-cyan",
                                            isActive && "text-neon-cyan"
                                        )} />
                                        {item.label}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={() => {
                            logout();
                            setIsOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
}
