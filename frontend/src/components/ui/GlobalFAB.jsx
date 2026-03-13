import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Search, Plus, X, Laptop, Target, User } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function GlobalFAB() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const actions = [
        { icon: Target, label: 'Calibration', path: '/generate-sensitivity', color: 'bg-primary' },
        { icon: Search, label: 'Leaderboard', path: '/leaderboard', color: 'bg-blue-500 text-white' },
        { icon: User, label: 'My Profile', path: '/profile', color: 'bg-emerald-500 text-white' },
    ];

    return (
        <div className="fixed bottom-24 right-4 z-40 flex flex-col items-end gap-3 pointer-events-none">
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
                        <span className="bg-slate-800 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                            {action.label}
                        </span>
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center text-slate-900 shadow-lg transform transition-transform hover:scale-110",
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
                    "pointer-events-auto w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl border-2 group",
                    isOpen
                        ? "bg-slate-800 border-white/20 text-white rotate-180"
                        : "bg-primary border-transparent text-slate-900 hover:scale-105"
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
