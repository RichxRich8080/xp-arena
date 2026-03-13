import React, { useState, useEffect } from 'react';
import { Zap, Target, Users, TrendingUp } from 'lucide-react';

// Helper aliases used in ticker events
const Active = TrendingUp;
const Star = Zap;

const EVENTS = [
    { text: "User 'Optima' just generated a High-End setup!", icon: Zap, color: "text-amber-500" },
    { text: "New Group 'Vanguard Pro' is looking for analysts.", icon: Users, color: "text-primary" },
    { text: "2.4k users active in the Platform right now.", icon: Active, color: "text-emerald-500" },
    { text: "System Pulse activated. Rewards doubled.", icon: Target, color: "text-purple-400" },
    { text: "User 'NinjaX' earned +50 Points!", icon: Zap, color: "text-amber-500" },
    { text: "Group 'Data Miners' just reached Level 15 Collective!", icon: Users, color: "text-emerald-500" },
    { text: "Elite Audit completed for 'OneTap_God' • 99.8% Precision", icon: Star, color: "text-amber-500" },
    { text: "Global Streak: 12 setups generated in last 60s!", icon: Zap, color: "text-primary font-bold" },
];

export default function ActivityTicker() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % EVENTS.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const event = EVENTS[index];

    return (
        <div className="w-full bg-background/50 border-y border-white/5 py-2 overflow-hidden relative backdrop-blur-sm">
            <div className="max-w-[1500px] mx-auto px-4 flex items-center gap-4 animate-slide-in-fast" key={index}>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-sm" />
                    <span className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] whitespace-nowrap">Live Intel</span>
                </div>
                
                <div className="w-px h-3 bg-white/10 hidden sm:block" />
                
                <p className="text-[10px] font-display font-medium uppercase tracking-[0.1em] text-gray-400 truncate">
                    {event.text}
                </p>

                <div className="ml-auto hidden sm:flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[8px] font-display font-bold text-gray-600 uppercase tracking-widest">Global Feed</span>
                    </div>
                </div>
            </div>

            {/* Scrolling scan effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.03] to-transparent -translate-x-full animate-progress-scan pointer-events-none" />
        </div>
    );
}
