import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Target, Trophy, User, Gift } from 'lucide-react';
import { cn } from '../../utils/cn';

export function BottomNav() {
    const items = [
        { icon: LayoutDashboard, label: 'Home', path: '/dashboard' },
        { icon: Target, label: 'Generate', path: '/generate-sensitivity' },
        { icon: Trophy, label: 'Ranks', path: '/leaderboard' },
        { icon: Gift, label: 'Rewards', path: '/mystery' },
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-surface-default/95 backdrop-blur-xl border-t border-white/[0.06] px-2 pb-safe pt-1 shadow-2xl">
            {/* Top glow */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            
            <div className="flex items-center justify-around">
                {items.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "relative flex flex-col items-center gap-1 py-2 px-4 transition-all duration-200",
                            isActive ? "text-primary" : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                <div className={cn(
                                    "relative p-2 rounded-xl transition-all duration-200",
                                    isActive && "bg-primary/10"
                                )}>
                                    <item.icon className={cn(
                                        "w-5 h-5 transition-transform duration-200",
                                        isActive && "scale-110"
                                    )} />
                                    {isActive && (
                                        <div className="absolute inset-0 rounded-xl bg-primary/20 blur-md -z-10" />
                                    )}
                                </div>
                                <span className={cn(
                                    "text-[10px] font-semibold transition-colors",
                                    isActive ? "text-primary" : "text-slate-500"
                                )}>
                                    {item.label}
                                </span>
                                {isActive && (
                                    <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
