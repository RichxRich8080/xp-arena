import React from 'react';
import Navbar from './Navbar';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col font-sans relative">
            <Navbar />

            {/* Subtle ambient light effects behind main content */}
            <div className="fixed top-20 left-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>
            <div className="fixed bottom-10 right-10 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>

            <main className="flex-grow pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                {children}
            </main>

            <footer className="py-6 border-t border-gray-800 mt-12 bg-gray-900/50 backdrop-blur-sm text-center text-sm text-gray-400">
                <p>&copy; 2026 XP-Arena. Built for Pro Players.</p>
            </footer>
        </div>
    );
};

export default MainLayout;
