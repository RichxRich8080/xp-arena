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
        <div className="min-h-screen text-text-default relative overflow-x-hidden">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 20% 0%, color-mix(in srgb, var(--app-accent) 14%, transparent), transparent 40%)' }} />
                <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 90% 10%, color-mix(in srgb, var(--app-primary) 18%, transparent), transparent 45%)' }} />
            </div>

            <TopNav />
            <ActivityTicker />

            <div className="relative z-10 max-w-[1400px] mx-auto pt-20 pb-32 md:pb-28 px-2 md:px-4">
                <div className="grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] gap-4">
                    <div className="hidden md:block">
                        <SideNav />
                    </div>
                    <main className="min-h-[70vh] rounded-3xl border border-white/10 bg-black/35 backdrop-blur-xl p-3 sm:p-5 md:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                        <GlitchTransition>
                            <Outlet />
                        </GlitchTransition>
                    </main>
                </div>
            </div>

            <div className="md:hidden">
                <SideNav />
            </div>
            <GlobalFAB />
            <PaletteButton />
            <BottomNav />
        </div>
    );
}
