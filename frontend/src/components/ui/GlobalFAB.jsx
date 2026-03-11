import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Search, Plus, X, Laptop, Target, User } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function GlobalFAB() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const actions = [
        { icon: Target, label: 'Quick Forge', path: '/generate-sensitivity', color: 'bg-neon-cyan' },
        { icon: Search, label: 'Search Clans', path: '/leaderboard', color: 'bg-primary-blue' },
        { icon: User, label: 'My Vault', path: '/profile', color: 'bg-neon-green' },
    ];

    return (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
            {/* Action Menu */}
            <div className={cn(
                "flex flex-col items-end gap-3 transition-all duration-300 origin-bottom",
                isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-0 opacity-0 translate-y-10"
            )}>
                {actions.map((action, i) => (
                    <button
                        key={i}
                        onClick={() => { navigate(action.path); setIsOpen(false); }}
                        className="pointer-events-auto flex items-center gap-3 group"
                    >
                        <span className="bg-gray-900 border border-gray-800 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">
                            {action.label}
                        </span>
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center text-gray-900 shadow-lg transform transition-transform hover:scale-110",
                            action.color
                        )}>
                            <action.icon className="w-5 h-5" />
                        </div>
                    </button>
                ))}
            </div>

            {/* Main Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "pointer-events-auto w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-2 group",
                    isOpen
                        ? "bg-gray-900 border-white text-white rotate-180"
                        : "bg-white border-transparent text-gray-900 hover:scale-110"
                )}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-7 h-7" />}
                {!isOpen && (
                    <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
                )}
            </button>
        </div>
    );
}
