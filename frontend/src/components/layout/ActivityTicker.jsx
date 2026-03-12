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
        <div className="w-full bg-gray-950 border-y border-gray-800/50 py-1.5 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 flex items-center gap-3 animate-slide-in-fast" key={index}>
                <div className={`p-1 rounded-md bg-gray-900 ${event.color}`}>
                    <event.icon className="w-3.5 h-3.5" />
                </div>
                <p className="text-[10px] sm:text-xs font-black uppercase tracking-[1px] text-gray-400">
                    {event.text}
                </p>

                <div className="ml-auto flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse"></div>
                    <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Demo Feed</span>
                </div>
            </div>

            {/* Speed scanning line */}
            <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-neon-green/5 to-transparent -translate-x-full animate-progress-scan pointer-events-none"></div>
        </div>
    );
}
