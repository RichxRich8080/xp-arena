import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, Search, Bell, Activity, Globe, Shield } from 'lucide-react';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { cn } from '../../utils/cn';

export function TopNav() {
    const navigate = useNavigate();

    return (
        <nav className="fixed top-6 left-6 right-6 h-20 z-[100] flex items-center justify-between px-8 glass-panel border-white/5 bg-background/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border">
            <Link to="/dashboard" className="flex items-center gap-5 group transition-all hover:scale-105 active:scale-95">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(6,182,212,0.3)] bg-gradient-to-br from-accent-cyan via-indigo-500 to-accent-purple relative group-hover:rotate-6 transition-transform">
                    <span className="font-display font-black text-white text-base tracking-tighter italic">XP</span>
                </div>
                <div className="hidden sm:block">
                    <span className="font-display font-black text-xl tracking-[0.2em] text-white italic">ARENA</span>
                    <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                         <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.4em]">PRO_COMMAND_ON</p>
                    </div>
                </div>
            </Link>

            <div className="flex items-center gap-6">
                <div className="hidden lg:flex items-center gap-10 px-8 py-3 bg-white/[0.02] border border-white/5 rounded-full">
                    <div className="flex items-center gap-3">
                        <Activity className="w-3.5 h-3.5 text-accent-cyan" />
                        <span className="text-[9px] font-black text-gray-400 tracking-[0.2em] uppercase">LINK_STABLE</span>
                    </div>
                    <div className="w-1px h-3 bg-white/10" />
                    <div className="flex items-center gap-3">
                        <Globe className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="text-[9px] font-black text-gray-400 tracking-[0.2em] uppercase">GLOBAL_NET</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate('/leaderboard')} 
                        className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all group"
                        aria-label="Search Hall of Fame"
                    >
                        <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                    
                    <NotificationDropdown />
                    
                    <button 
                        onClick={() => navigate('/settings')} 
                        className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all group"
                        aria-label="Settings"
                    >
                         <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                    </button>
                    
                    <div className="h-10 w-1px bg-white/5 mx-2 hidden sm:block" />
                    
                    <div className="hidden sm:flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/premium')}>
                         <div className="flex flex-col items-end">
                            <span className="text-[8px] font-black text-accent-cyan uppercase tracking-widest italic">DIAMOND_TIER</span>
                            <span className="text-[10px] font-black text-white uppercase tracking-tighter italic">ELITE_ARENI</span>
                         </div>
                         <div className="w-10 h-10 rounded-xl border border-accent-cyan/20 bg-accent-cyan/10 flex items-center justify-center text-accent-cyan group-hover:scale-110 transition-transform">
                            <Shield className="w-5 h-5" />
                         </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
