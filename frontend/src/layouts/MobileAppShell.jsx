import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useNeuralHaptics } from '../hooks/useNeuralHaptics';
import { useAreni } from '../context/AreniContext';
import { useAudioUI } from '../hooks/useAudioUI';

// Custom active style for Command Dock Icons
const DockIcon = ({ to, label, icon: Icon }) => {
    const { triggerLightHaptic } = useNeuralHaptics();
    const { playClick } = useAudioUI();

    return (
        <NavLink
            to={to}
            onClick={() => {
                triggerLightHaptic();
                playClick();
            }}
            className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 ${isActive ? 'text-cyan-400 scale-110 drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]' : 'text-gray-500 hover:text-gray-300'}`}
        >
            <Icon className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
        </NavLink>
    );
};

const MobileAppShell = ({ children }) => {
    const location = useLocation();
    const areni = useAreni() || {};
    const { axp = 0, level = 0, xp = 0 } = areni;
    const { playClick = () => { } } = useAudioUI() || {};
    const { triggerLightHaptic = () => { } } = useNeuralHaptics() || {};
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Close drawer upon route change
    useEffect(() => {
        setDrawerOpen(false);
    }, [location.pathname]);

    const toggleDrawer = () => {
        triggerLightHaptic();
        playClick();
        setDrawerOpen(!drawerOpen);
    };

    const getPageTitle = () => {
        const path = location.pathname.split('/')[1];
        return path ? path.charAt(0).toUpperCase() + path.slice(1) : "Dashboard";
    };

    return (
        <div className="w-full h-screen bg-gray-900 text-white overflow-hidden relative font-sans flex flex-col md:flex-row">

            {/* 1. Desktop Sidebar (md breakpoint and up) */}
            <aside className="hidden md:flex flex-col w-64 h-full bg-gray-900 border-r border-gray-800 z-50">
                <div className="p-6 border-b border-gray-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center font-black text-xl shadow-[0_0_15px_rgba(0,255,255,0.4)] animate-pulse">A</div>
                    <span className="font-black tracking-widest text-lg">ARENI</span>
                </div>

                <nav className="flex-1 py-6 px-4 flex flex-col gap-2 overflow-y-auto">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2 mb-2">Command Center</div>
                    {[
                        { to: "/", label: "Home", icon: "🏠" },
                        { to: "/shop", label: "Shop", icon: "💎" },
                        { to: "/tool", label: "Precision", icon: "⚙️" },
                        { to: "/vault", label: "Vault", icon: "🔒" },
                        { to: "/leaderboard", label: "Leaderboard", icon: "👑" },
                    ].map(link => (
                        <NavLink key={link.to} to={link.to} className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all ${isActive ? 'bg-indigo-600 border border-indigo-400 shadow-[0_0_15px_rgba(79,70,229,0.3)] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                            <span>{link.icon}</span>{link.label}
                        </NavLink>
                    ))}

                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2 mt-6 mb-2">Deep Ecosystem</div>
                    {[
                        { to: "/guilds", label: "Guilds", icon: "🛡️" },
                        { to: "/tournaments", label: "Tournaments", icon: "⚔️" },
                        { to: "/clips", label: "Clips", icon: "🎬" },
                        { to: "/quests", label: "Quests", icon: "🎯" },
                        { to: "/support", label: "Support", icon: "🎧" },
                    ].map(link => (
                        <NavLink key={link.to} to={link.to} className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all ${isActive ? 'bg-gray-800 border border-gray-700 text-cyan-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                            <span>{link.icon}</span>{link.label}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* 2. Mobile Drawer (Overlay) */}
            <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 md:hidden ${drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleDrawer} />
            <aside className={`fixed top-0 left-0 h-full w-[280px] bg-gray-900 border-r border-gray-800 z-[101] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] md:hidden flex flex-col ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center font-black text-sm">A</div>
                        <span className="font-black tracking-widest text-sm">ELITE NAVIGATION</span>
                    </div>
                </div>
                <nav className="flex-1 py-4 px-4 flex flex-col gap-2 overflow-y-auto">
                    {[
                        { to: "/guilds", label: "Syndicates", icon: "🛡️" },
                        { to: "/tournaments", label: "Tournaments", icon: "⚔️" },
                        { to: "/clips", label: "Arena Clips", icon: "🎬" },
                        { to: "/quests", label: "Objectives", icon: "🎯" },
                        { to: "/premium", label: "Premium", icon: "✨" },
                        { to: "/ecosystem", label: "Network", icon: "🌐" },
                        { to: "/about", label: "Our Story", icon: "📖" },
                        { to: "/support", label: "Help Center", icon: "🎧" },
                    ].map(link => (
                        <NavLink key={link.to} to={link.to} className={({ isActive }) => `flex items-center gap-4 px-4 py-4 rounded-xl font-bold transition-all ${isActive ? 'bg-cyan-500/10 border border-cyan-500/50 text-cyan-400' : 'text-gray-400 hover:bg-gray-800'}`}>
                            <span className="text-xl">{link.icon}</span>
                            <span className="uppercase tracking-widest text-xs">{link.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Main Wrapper */}
            <div className="flex-1 flex flex-col h-full relative">

                {/* Neural Top Bar (Mobile) */}
                <header className="md:hidden flex h-[70px] bg-gray-900/80 backdrop-blur-md border-b border-gray-800 items-center justify-between px-4 z-40">
                    <div className="flex items-center gap-3">
                        <button onClick={toggleDrawer} className="p-2 -ml-2 text-cyan-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h12m-12 6h16" /></svg>
                        </button>
                        <div className="text-xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 animate-pulse">XP ARENA</div>
                    </div>

                    <div className="bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700 flex items-center gap-2 shadow-inner">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                        <span className="text-[11px] font-black axp-shine">{(axp || 0).toLocaleString()} AXP</span>
                    </div>

                    <NavLink to="/profile" className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-400 p-[2px] shadow-[0_0_10px_rgba(0,255,255,0.4)]">
                        <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center text-[10px] font-bold">PRO</div>
                    </NavLink>
                </header>

                <main className="flex-1 overflow-y-auto momentum-container bg-gradient-to-b from-gray-900 to-black pb-[80px] md:pb-6">
                    <div className="max-w-7xl mx-auto px-4 pt-4 md:pt-8 md:px-8 neural-stagger">

                        {/* Desktop Header Replacer */}
                        <div className="hidden md:flex justify-between items-center mb-8 bg-gray-800/20 p-6 rounded-3xl border border-gray-700/30 backdrop-blur-xl">
                            <div>
                                <h1 className="text-2xl font-black uppercase tracking-widest text-white">{getPageTitle()}</h1>
                                <p className="text-xs text-gray-500 font-mono mt-1 uppercase tracking-tighter">LVL {level || 0} • {(xp || 0).toLocaleString()} XP EARNED</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 bg-gray-900 px-6 py-3 rounded-2xl border border-gray-700 shadow-inner">
                                    <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
                                    <span className="text-lg font-black tracking-widest axp-shine">{(axp || 0).toLocaleString()} AXP</span>
                                </div>
                                <NavLink to="/profile" className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:scale-105 transition-transform">
                                    <span className="text-xl">👤</span>
                                </NavLink>
                            </div>
                        </div>

                        {children}
                    </div>
                </main>

                {/* Floating Command Pill (Bottom Mobile Nav) */}
                <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] z-50">
                    <nav className="h-[70px] bg-gray-950/40 backdrop-blur-2xl border border-white/10 rounded-[32px] flex items-center justify-around px-4 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)]">
                        <DockIcon to="/" label="Home" icon={(props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} />
                        <DockIcon to="/shop" label="Shop" icon={(props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>} />

                        {/* Central Neural Hub Toggle */}
                        <div className="relative -top-1">
                            <NavLink to="/tool" onClick={() => { triggerLightHaptic(); playClick(); }} className={({ isActive }) => `w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.8)] rotate-90 scale-110' : 'bg-white/5 border border-white/10 hover:scale-110'}`}>
                                {({ isActive }) => (
                                    <svg className={`w-8 h-8 ${isActive ? 'text-white' : 'text-cyan-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4h12m-6 4v-2m0 2a2 2 0 100-4m0 4a2 2 0 110-4m-6 0h6m6 0a2 2 0 100-4m0 4a2 2 0 110-4m0 4h2" /></svg>
                                )}
                            </NavLink>
                        </div>

                        <DockIcon to="/vault" label="Vault" icon={(props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>} />
                        <DockIcon to="/leaderboard" label="Ranks" icon={(props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>} />
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default MobileAppShell;
