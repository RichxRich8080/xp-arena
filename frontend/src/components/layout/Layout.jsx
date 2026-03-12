import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';
import { BottomNav } from './BottomNav';
import { SideNav } from './SideNav';
import { PaletteButton } from './PaletteButton';
import ActivityTicker from './ActivityTicker';
import GlobalFAB from '../ui/GlobalFAB';
import GlitchTransition from '../ui/GlitchTransition';

export default function Layout() {
    return (
        <div className="min-h-screen text-gray-200 relative overflow-x-hidden pt-24 pb-32 md:pb-12">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-violet/10 blur-[120px] animate-pulse-slow" />
            </div>

            <TopNav />
            <ActivityTicker />

            <div className="relative z-10 max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar - Desktop */}
                    <aside className="hidden md:block w-72 shrink-0">
                        <div className="sticky top-28 glass-panel p-2">
                            <SideNav />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        <div className="relative">
                            {/* Decorative Corner */}
                            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-accent-cyan/30 rounded-tl-xl pointer-events-none" />
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-accent-cyan/30 rounded-br-xl pointer-events-none" />
                            
                            <div className="glass-panel p-6 sm:p-8 min-h-[75vh] relative overflow-hidden">
                                {/* Subtle Grid Background */}
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                                     style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                                
                                <GlitchTransition>
                                    <Outlet />
                                </GlitchTransition>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Mobile Sidebar Trigger & Bottom Nav */}
            <div className="md:hidden">
                <SideNav />
            </div>
            
            <GlobalFAB />
            <BottomNav />
        </div>
    );
}
