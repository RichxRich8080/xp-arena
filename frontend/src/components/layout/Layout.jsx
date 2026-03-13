import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';
import { BottomNav } from './BottomNav';
import { SideNav } from './SideNav';

export default function Layout() {
    return (
        <div className="min-h-screen text-slate-200 relative bg-background pt-20 pb-24 md:pb-8">
            <TopNav />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar - Desktop */}
                    <aside className="hidden md:block w-64 shrink-0">
                        <div className="sticky top-24">
                            <SideNav />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        <div className="glass-panel p-6 shadow-sm min-h-[80vh]">
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
