import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';
import { BottomNav } from './BottomNav';
import { SideNav } from './SideNav';

export default function Layout() {
    return (
        <div className="min-h-screen text-slate-200 relative bg-background pt-20 pb-24 md:pb-8 noise-overlay">
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-cyan/[0.02] rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/[0.01] rounded-full opacity-50" />
            </div>

            <TopNav />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar - Desktop */}
                    <aside className="hidden md:block w-64 shrink-0">
                        <div className="sticky top-24">
                            <SideNav />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        <div className="glass-panel p-6 md:p-8 shadow-lg min-h-[80vh] relative">
                            {/* Top glow accent */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden">
                <BottomNav />
            </div>
        </div>
    );
}
