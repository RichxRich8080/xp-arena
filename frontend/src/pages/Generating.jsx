import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Cpu, ShieldCheck, Zap, Activity, Fingerprint, Database, Network, Loader2, Lock } from 'lucide-react';
import { cn } from '../utils/cn';

export default function Generating() {
    const navigate = useNavigate();
    const location = useLocation();
    const [progress, setProgress] = useState(0);

    const steps = [
        "Analyzing Hardware Profile...",
        "Optimizing Input Response...",
        "Synchronizing Movement Logic...",
        "Finalizing Calibration...",
        "Processing Complete"
    ];

    const stepIndex = Math.min(Math.floor((progress / 100) * steps.length), steps.length - 1);
    const status = steps[stepIndex];

    useEffect(() => {
        const duration = 2500;
        const interval = 20;
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
            }, 800);
            return () => clearTimeout(redirect);
        }
    }, [progress, navigate, location.state]);

    return (
        <div className="fixed inset-0 bg-slate-950 z-[100] flex flex-col items-center justify-center p-8 overflow-hidden font-sans">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] bg-primary/[0.02] rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.03)_0%,transparent_70%)]" />
            </div>

            {/* Central Progress Circle */}
            <div className="relative mb-16">
                <div className="absolute -inset-16 bg-primary/10 rounded-full blur-3xl opacity-10 animate-pulse" />
                
                <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* Ring background */}
                    <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
                    
                    {/* Active rotating ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle
                            cx="96"
                            cy="96"
                            r="94"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeDasharray={2 * Math.PI * 94}
                            strokeDashoffset={2 * Math.PI * 94 * (1 - progress / 100)}
                            className="text-primary transition-all duration-300 ease-linear"
                        />
                    </svg>
                    
                    <div className="relative z-10 flex flex-col items-center">
                        <Loader2 className="w-10 h-10 text-primary animate-spin mb-2" />
                        <span className="text-xl font-bold text-white tabular-nums">{Math.round(progress)}%</span>
                    </div>
                </div>
            </div>

            {/* Readout Section */}
            <div className="w-full max-w-lg space-y-10 relative z-10">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold text-white tracking-tight uppercase">Processing Optimization</h2>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-px flex-1 bg-white/5" />
                        <div className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <p className="text-primary text-[10px] font-bold uppercase tracking-widest">
                                {status}
                            </p>
                        </div>
                        <div className="h-px flex-1 bg-white/5" />
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Progress Track */}
                    <div className="h-1.5 w-full bg-slate-900 border border-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-300 relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/10 animate-pulse" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col items-center gap-2 p-4 bg-slate-900/50 border border-white/5 rounded-2xl">
                            <Cpu className="w-4 h-4 text-primary" />
                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Processing</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 p-4 bg-slate-900/50 border border-white/5 rounded-2xl">
                            <Network className="w-4 h-4 text-indigo-400" />
                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Sync</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 p-4 bg-slate-900/50 border border-white/5 rounded-2xl">
                            <Database className="w-4 h-4 text-emerald-400" />
                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Calculated</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Status */}
            <div className="absolute bottom-12 flex items-center justify-between w-full px-12 opacity-30">
                <div className="flex items-center gap-3">
                    <Lock className="w-3.5 h-3.5 text-white" />
                    <span className="text-[8px] font-bold text-white tracking-widest uppercase">Secure Processing</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[8px] font-bold text-white tracking-widest uppercase">Platform Engine v4.0</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                </div>
            </div>
        </div>
    );
}
