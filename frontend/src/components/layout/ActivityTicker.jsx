import React, { useState, useEffect } from 'react';
import { Zap, Target, Users, TrendingUp } from 'lucide-react';

// Helper aliases used in ticker events
const Active = TrendingUp;
const Star = Zap;

const EVENTS = [
    { text: "User 'FireSlayer' just generated a High-End setup!", icon: Zap, color: "text-axp-gold" },
    { text: "New Clan 'Vanguard Pro' is looking for rushers.", icon: Users, color: "text-neon-cyan" },
    { text: "2.4k players active in the Forge right now.", icon: Active, color: "text-neon-green" },
    { text: "Top setup of the hour: 'iPhone 15 Pro • Sniper'", icon: Target, color: "text-primary-blue" },
    { text: "User 'NinjaX' earned +50 AXP!", icon: Zap, color: "text-axp-gold" },
    { text: "Clan 'Snake Pit' just reached Level 15 Collective!", icon: Users, color: "text-neon-green" },
    { text: "Elite Audit completed for 'OneTap_God' • 99.8% Precision", icon: Star, color: "text-axp-gold" },
    { text: "Global Forge Streak: 12 setups generated in last 60s!", icon: Zap, color: "text-neon-cyan font-black" },
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
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                    <span className="text-[9px] font-display font-black text-accent-cyan/80 uppercase tracking-[0.2em] whitespace-nowrap">Live Intel</span>
                </div>
                
                <div className="w-px h-3 bg-white/10 hidden sm:block" />
                
                <p className="text-[10px] font-display font-medium uppercase tracking-[0.1em] text-gray-400 truncate">
                    {event.text}
                </p>

                <div className="ml-auto hidden sm:flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-accent-rose animate-pulse" />
                        <span className="text-[8px] font-display font-bold text-gray-600 uppercase tracking-widest">Global Feed</span>
                    </div>
                </div>
            </div>

            {/* Scrolling scan effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-cyan/[0.03] to-transparent -translate-x-full animate-progress-scan pointer-events-none" />
        </div>
    );
}
