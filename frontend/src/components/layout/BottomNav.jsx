import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Zap, Trophy, User, MessageSquare } from 'lucide-react';
import { cn } from '../../utils/cn';

export function BottomNav() {
    const items = [
        { icon: LayoutDashboard, label: 'Home', path: '/dashboard' },
        { icon: Zap, label: 'Tool', path: '/tool' },
        { icon: Trophy, label: 'Ranks', path: '/leaderboard' },
        { icon: User, label: 'Profile', path: '/profile' },
        { icon: MessageSquare, label: 'Help', path: '/support' },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-slate-900 border-t border-white/5 px-6 pb-safe pt-2 shadow-lg">
            <div className="flex items-center justify-between">
                {items.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex flex-col items-center gap-1 py-1 transition-colors duration-200",
                            isActive ? "text-primary" : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
