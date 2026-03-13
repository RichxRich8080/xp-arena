import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, Search, Bell, Shield, User } from 'lucide-react';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../ui/Avatar';

export function TopNav() {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 z-[100] flex items-center justify-between px-6 bg-slate-900/80 backdrop-blur-md border-b border-white/5 shadow-sm">
            <Link to="/dashboard" className="flex items-center gap-3 group transition-opacity hover:opacity-80">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <span className="font-bold text-white text-xs">XP</span>
                </div>
                <span className="font-bold text-lg tracking-tight text-white">Arena</span>
            </Link>

            <div className="flex items-center gap-4">
                {/* Search Bar (Simple) */}
                <div className="hidden sm:flex items-center bg-slate-800/50 border border-white/5 rounded-full px-4 py-1.5 gap-2 w-64">
                    <Search className="w-4 h-4 text-slate-500" />
                    <input 
                        type="text" 
                        placeholder="Search arena..." 
                        className="bg-transparent border-none outline-none text-xs text-slate-300 w-full placeholder:text-slate-600"
                    />
                </div>
                
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => navigate('/leaderboard')} 
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors sm:hidden"
                        aria-label="Search"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                    
                    <NotificationDropdown />
                    
                    <button 
                        onClick={() => navigate('/settings')} 
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                        aria-label="Settings"
                    >
                         <Settings className="w-5 h-5" />
                    </button>
                    
                    <div className="h-6 w-px bg-white/10 mx-2 hidden sm:block" />
                    
                    <button 
                        onClick={() => navigate('/profile')} 
                        className="flex items-center gap-3 p-1 rounded-full hover:bg-white/5 transition-colors group"
                    >
                         <Avatar size="sm" src={user?.avatar} />
                         <div className="hidden lg:flex flex-col items-start leading-none">
                            <span className="text-xs font-semibold text-white">{user?.username || 'GUEST'}</span>
                            <span className="text-[10px] text-slate-500">Level {user?.level || 1}</span>
                         </div>
                    </button>
                </div>
            </div>
        </nav>
    );
}
