import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, Trophy, Sparkles, Users, User } from 'lucide-react';
import { cn } from '../../utils/cn';

export function BottomNav() {
    const navItems = [
        { icon: LayoutGrid, label: 'Hub', path: '/dashboard' },
        { icon: Trophy, label: 'Ranks', path: '/leaderboard' },
        { icon: Sparkles, label: 'Forge', path: '/generate-sensitivity' },
        { icon: Users, label: 'Clans', path: '/clans' },
        { icon: User, label: 'Profile', path: '/profile' }
    ];

    return (
        <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[min(920px,calc(100%-1rem))] rounded-2xl border border-white/10 bg-black/45 backdrop-blur-xl z-40 px-2 py-2">
            <div className="grid grid-cols-5 gap-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            'flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-all',
                            isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                        )}
                    >
                        <item.icon className="w-4 h-4" />
                        <span className="text-[10px] uppercase tracking-wider font-semibold">{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
