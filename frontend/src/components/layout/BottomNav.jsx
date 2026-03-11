import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Trophy, Target, Users, User } from 'lucide-react';
import { cn } from '../../utils/cn';

export function BottomNav() {
    const navItems = [
        { icon: Home, label: 'Home', path: '/dashboard' },
        { icon: Trophy, label: 'Ranks', path: '/leaderboard' },
        { icon: Target, label: 'Generate', path: '/generate-sensitivity' },
        { icon: Users, label: 'Clans', path: '/clans' },
        { icon: User, label: 'Profile', path: '/profile' }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 z-40 pb-safe pb-4">
            <div className="flex justify-around items-center h-full max-w-md mx-auto px-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-300 relative group",
                            isActive ? "text-neon-cyan" : "text-gray-500 hover:text-gray-300"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                <div className={cn(
                                    "p-2 rounded-xl transition-all duration-300 z-10",
                                    isActive && "bg-primary-blue/20 shadow-[0_0_15px_rgba(6,182,212,0.3)] -translate-y-2"
                                )}>
                                    <item.icon className={cn("w-6 h-6", isActive && "drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]")} />
                                </div>
                                <span className={cn(
                                    "text-[10px] font-medium absolute bottom-1 transition-all duration-300",
                                    isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                                )}>
                                    {item.label}
                                </span>

                                {isActive && (
                                    <div className="absolute top-0 w-8 h-1 bg-neon-cyan rounded-b-full shadow-[0_2px_10px_rgba(6,182,212,0.8)]"></div>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
