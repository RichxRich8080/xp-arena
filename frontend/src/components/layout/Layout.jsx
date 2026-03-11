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
        <div className="min-h-screen bg-background text-text-default flex flex-col relative overflow-hidden">
            {/* Background ambient lighting */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-blue/10 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-neon-cyan/5 blur-[100px]" />
            </div>

            <TopNav />
            <ActivityTicker />

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-7xl mx-auto pt-16 pb-24 px-4 overflow-y-auto relative z-10 scroll-smooth">
                <GlitchTransition>
                    <Outlet />
                </GlitchTransition>
            </main>

            <SideNav />
            <GlobalFAB />
            <PaletteButton />
            <BottomNav />
        </div>
    );
}
