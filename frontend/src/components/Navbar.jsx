import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav aria-label="Main Navigation" className="fixed top-0 z-50 w-full bg-gray-900/90 backdrop-blur border-b border-gray-800 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 relative">
                            <div className="absolute -inset-1 rounded-full blur opacity-25 bg-gradient-to-r from-cyan-400 to-indigo-500"></div>
                            <img className="h-10 w-10 relative object-contain" src="/vite.svg" alt="XP-Arena" />
                        </div>
                        <div className="hidden md:block">
                            <span className="text-neon text-2xl font-black uppercase tracking-widest cursor-pointer">XP-ARENA</span>
                        </div>
                    </div>

                    <div className="hidden md:block" role="navigation">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link to="/" aria-label="Go to Dashboard" className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">Dashboard</Link>
                            <Link to="/tool" aria-label="Open Sensitivity Tool" className="btn-glow px-4 py-2 text-sm">Sensitivity Tool</Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
