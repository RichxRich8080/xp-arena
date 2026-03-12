import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, Search } from 'lucide-react';
import { NotificationDropdown } from '../notifications/NotificationDropdown';

export function TopNav() {
    const navigate = useNavigate();

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 z-40 flex items-center justify-between px-4 border-b border-white/10 backdrop-blur-xl bg-[#070b14]/70">
            <Link to="/dashboard" className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.35)] theme-accent-gradient">
                    <span className="font-black text-white text-sm">XP</span>
                </div>
                <div>
                    <span className="font-black text-base tracking-[0.18em] text-white">ARENA</span>
                    <p className="text-[9px] text-gray-400 uppercase tracking-[0.3em]">control center</p>
                </div>
            </Link>

            <div className="flex items-center gap-2">
                <button onClick={() => navigate('/leaderboard')} className="p-2 rounded-xl hover:bg-white/10 text-gray-200" aria-label="Leaderboard search">
                    <Search className="w-4 h-4" />
                </button>
                <button onClick={() => navigate('/settings')} className="p-2 rounded-xl hover:bg-white/10 text-gray-200" aria-label="Settings">
                    <Settings className="w-4 h-4" />
                </button>
                <NotificationDropdown />
            </div>
        </nav>
    );
}
