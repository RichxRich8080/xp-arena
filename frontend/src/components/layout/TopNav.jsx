import React from 'react';
import { Search } from 'lucide-react';
import { NotificationDropdown } from '../notifications/NotificationDropdown';

export function TopNav() {
    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 z-40 flex items-center justify-between px-4">
            {/* Brand */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-blue to-neon-cyan flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                    <span className="font-black text-white text-sm">XP</span>
                </div>
                <span className="font-bold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
                    ARENA
                </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                <button className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-300">
                    <Search className="w-5 h-5" />
                </button>
                <NotificationDropdown />
            </div>
        </nav>
    );
}
