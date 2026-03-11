import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Cpu, ShieldCheck, Zap, Activity } from 'lucide-react';

export default function Generating() {
    const navigate = useNavigate();
    const location = useLocation();
    const [progress, setProgress] = useState(0);

    const steps = [
        "Analyzing device hardware signature...",
        "Measuring optimal touch response...",
        "Optimizing for " + (location.state?.formData?.playStyle || "balanced") + " style...",
        "Finalizing precision coefficients...",
        "READY"
    ];

    const stepIndex = Math.min(Math.floor((progress / 100) * steps.length), steps.length - 1);
    const status = steps[stepIndex];

    useEffect(() => {
        const duration = 3000;
        const interval = 30;
        const increment = (interval / duration) * 100;

        const timer = setInterval(() => {
            setProgress(prev => {
                const next = prev + increment;
                if (next >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return next;
            });
        }, interval);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (progress >= 100) {
            const redirect = setTimeout(() => {
                navigate('/sensitivity-result', { state: location.state });
            }, 500);
            return () => clearTimeout(redirect);
        }
    }, [progress, navigate, location.state]);

    return (
        <div className="fixed inset-0 bg-[#06080f] z-50 flex flex-col items-center justify-center p-6 space-y-12">
            {/* Background Decorative Radar Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-neon-cyan/30 rounded-full animate-ping duration-[3000ms]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary-blue/20 rounded-full animate-ping duration-[4000ms]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-neon-green/10 rounded-full"></div>
                {/* Horizontal Scan Line */}
                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent animate-scan-y opacity-40"></div>
            </div>

            {/* Central Animated Logo/Icon */}
            <div className="relative group">
                <div className="absolute -inset-4 bg-neon-cyan/20 rounded-full blur-2xl group-hover:bg-neon-cyan/30 transition-all animate-pulse"></div>
                <div className="relative w-24 h-24 bg-gray-900 border-2 border-neon-cyan/50 rounded-2xl flex items-center justify-center rotate-45 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                    <div className="-rotate-45 relative">
                        <Activity className="w-10 h-10 text-neon-cyan animate-pulse" />
                        <Zap className="absolute -top-2 -right-2 w-5 h-5 text-axp-gold animate-bounce" />
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="text-center space-y-8 relative z-10 w-full max-w-sm">
                <div className="space-y-2">
                    <h2 className="text-xl font-black text-white uppercase tracking-[8px] glow-cyan">OPTIMIZING</h2>
                    <p className="text-neon-cyan text-[10px] font-black uppercase tracking-widest h-4 animate-pulse">
                        {status}
                    </p>
                </div>

                {/* Progress Bar Container */}
                <div className="space-y-4">
                    <div className="h-2 w-full bg-gray-900/50 rounded-full border border-gray-800 p-0.5 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary-blue via-neon-cyan to-neon-green rounded-full shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <div className="flex items-center gap-1.5 text-neon-green">
                            <ShieldCheck className="w-3 h-3" />
                            SECURE PROCESSING
                        </div>
                        <span className="text-gray-400">{Math.round(progress)}%</span>
                    </div>
                </div>
            </div>

            {/* Bottom Status Icons */}
            <div className="flex gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
                <Cpu className="w-6 h-6 text-neon-cyan animate-pulse" />
                <Zap className="w-6 h-6 text-axp-gold animate-bounce" />
            </div>
        </div>
    );
}
