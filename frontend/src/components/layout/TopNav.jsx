import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, Search, Bell, Shield, User, Zap, Crown } from 'lucide-react';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../ui/Avatar';
import { cn } from '../../utils/cn';

export function TopNav() {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 z-[100] flex items-center justify-between px-4 md:px-6 bg-surface-default/80 backdrop-blur-xl border-b border-white/[0.06] shadow-lg">
            {/* Bottom glow line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            
            <Link to="/dashboard" className="flex items-center gap-3 group transition-all hover:opacity-90">
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-md transition-shadow">
                    <span className="font-display font-black text-white text-sm tracking-tight">XP</span>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="hidden sm:block">
                    <span className="font-display font-bold text-lg tracking-tight text-white">Arena</span>
                    <span className="text-[10px] text-primary font-semibold ml-1.5 bg-primary/10 px-1.5 py-0.5 rounded">PRO</span>
                </div>
            </Link>

            <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="hidden md:flex items-center bg-surface-elevated/60 border border-white/[0.06] rounded-xl px-4 py-2 gap-2.5 w-72 group focus-within:border-primary/30 focus-within:bg-surface-elevated transition-all">
                    <Search className="w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search players, presets, guilds..." 
                        className="bg-transparent border-none outline-none text-sm text-slate-300 w-full placeholder:text-slate-600"
                    />
                    <kbd className="hidden lg:inline-flex items-center gap-1 text-[10px] text-slate-600 bg-surface-low px-1.5 py-0.5 rounded font-mono">/</kbd>
                </div>
                
                <div className="flex items-center gap-1.5">
                    {/* Mobile Search */}
                    <button 
                        onClick={() => navigate('/leaderboard')} 
                        className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all md:hidden"
                        aria-label="Search"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                    
                    {/* Credits Display */}
                    {user && (
                        <div className="hidden sm:flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-1.5 mr-1">
                            <Zap className="w-4 h-4 text-amber-500" />
                            <span className="text-sm font-bold text-amber-400">{user.axp?.toLocaleString() || 0}</span>
                        </div>
                    )}
                    
                    <NotificationDropdown />
                    
                    <button 
                        onClick={() => navigate('/settings')} 
                        className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                        aria-label="Settings"
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                    
                    <div className="h-8 w-px bg-white/[0.06] mx-1 hidden sm:block" />
                    
                    {/* User Profile Button */}
                    <button 
                        onClick={() => navigate('/profile')} 
                        className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/[0.06]"
                    >
                        <div className="relative">
                            <Avatar size="sm" src={user?.avatar} className="ring-2 ring-primary/20" />
                            {user?.isPremium && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                                    <Crown className="w-2.5 h-2.5 text-white" />
                                </div>
                            )}
                        </div>
                        <div className="hidden lg:flex flex-col items-start leading-tight">
                            <span className="text-sm font-semibold text-white group-hover:text-primary transition-colors">{user?.username || 'Guest'}</span>
                            <span className={cn(
                                "text-[10px] font-bold uppercase tracking-wider",
                                user?.rank === 'Legend' ? 'text-rank-legend' :
                                user?.rank === 'Grandmaster' ? 'text-rank-grandmaster' :
                                user?.rank === 'Master' ? 'text-rank-master' :
                                user?.rank === 'Diamond' ? 'text-rank-diamond' :
                                'text-slate-500'
                            )}>
                                {user?.rank || 'Bronze'} - Lv.{user?.level || 1}
                            </span>
                        </div>
                    </button>
                </div>
            </div>
        </nav>
    );
}
