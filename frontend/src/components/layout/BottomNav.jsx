import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Zap, Trophy, User, MessageSquare } from 'lucide-react';
import { cn } from '../../utils/cn';

export function BottomNav() {
    const items = [
        { icon: LayoutDashboard, label: 'DASH', path: '/dashboard' },
        { icon: Zap, label: 'SENS', path: '/tool' },
        { icon: Trophy, label: 'TOP', path: '/leaderboard' },
        { icon: User, label: 'ME', path: '/profile' },
        { icon: MessageSquare, label: 'HELP', path: '/support' },
    ];

    return (
        <nav className="md:hidden fixed bottom-6 left-6 right-6 z-[100] glass-panel border-accent-cyan/20 bg-background/80 backdrop-blur-2xl p-4 rounded-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-2">
            <div className="flex items-center justify-around">
                {items.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex flex-col items-center gap-1.5 transition-all duration-500 px-3 sm:px-6 py-3 rounded-[2rem]",
                            isActive ? "bg-accent-cyan/10 text-accent-cyan scale-110" : "text-gray-500 hover:text-white"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={cn("w-5 h-5", isActive ? "text-accent-cyan" : "text-current")} />
                                <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
                                {isActive && <div className="w-1 h-1 rounded-full bg-accent-cyan shadow-[0_0_10px_rgba(6,182,212,1)]" />}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
