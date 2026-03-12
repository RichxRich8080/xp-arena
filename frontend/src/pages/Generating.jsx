import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Cpu, ShieldCheck, Zap, Activity, Fingerprint, Database, Network } from 'lucide-react';
import { cn } from '../utils/cn';

export default function Generating() {
    const navigate = useNavigate();
    const location = useLocation();
    const [progress, setProgress] = useState(0);

    const steps = [
        "FETCHING_HARDWARE_SIGNATURE...",
        "ANALYZING_TOUCH_LATENCY_PROTOCOLS...",
        "SYNCHRONIZING_COMBAT_AXIS...",
        "CALIBRATING_NEURAL_COEFFICIENTS...",
        "UPLINK_STABLE_READY"
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
        <div className="fixed inset-0 bg-background z-[100] flex flex-col items-center justify-center p-8 overflow-hidden font-display">
            {/* Background Narrative Layers */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] bg-accent-cyan/[0.03] rounded-full blur-[120px] animate-pulse" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]" />
                
                {/* Random Tech Bits */}
                <div className="absolute top-10 left-10 opacity-[0.2] font-black text-[8px] tracking-[0.5em] text-gray-500 uppercase vertical-text">
                    PROTOCOL_V.2.0.4_ACTIVE_NODE_SYMMETRY
                </div>
            </div>

            {/* Central Diagnostic Sphere */}
            <div className="relative mb-20">
                <div className="absolute -inset-20 bg-accent-cyan/10 rounded-full blur-3xl opacity-20 animate-pulse" />
                
                <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* Ring 1 */}
                    <div className="absolute inset-0 border-2 border-accent-cyan/10 rounded-full animate-[spin_10s_linear_infinite]" />
                    <div className="absolute inset-4 border border-accent-cyan/20 rounded-full border-dashed animate-[spin_15s_linear_infinite_reverse]" />
                    <div className="absolute inset-8 border-4 border-white/[0.02] rounded-full border-t-accent-cyan/40 animate-[spin_3s_ease-in-out_infinite]" />
                    
                    <div className="relative z-10 flex flex-col items-center">
                        <Activity className="w-12 h-12 text-accent-cyan animate-pulse mb-2" />
                        <span className="text-[10px] font-black text-white italic tracking-widest">{Math.round(progress)}%</span>
                    </div>
                </div>
            </div>

            {/* Readout Terminal */}
            <div className="w-full max-w-lg space-y-8 relative z-10">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-black text-white italic tracking-[0.3em] uppercase opacity-80">FORGING_COEFFICIENTS</h2>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-1px flex-1 bg-white/5" />
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-ping" />
                            <p className="text-accent-cyan text-[10px] font-black uppercase tracking-[0.25em] italic">
                                {status}
                            </p>
                        </div>
                        <div className="h-1px flex-1 bg-white/5" />
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Progress Track */}
                    <div className="h-2 w-full bg-white/[0.02] border border-white/5 rounded-full overflow-hidden p-0.5">
                        <div
                            className="h-full bg-gradient-to-r from-accent-cyan via-accent-green to-accent-cyan rounded-full transition-all duration-300 relative group"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 glass-panel border-white/5 py-3 px-4">
                            <Cpu className="w-3.5 h-3.5 text-accent-cyan" />
                            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">CPU_OPT</span>
                        </div>
                        <div className="flex items-center gap-3 glass-panel border-white/5 py-3 px-4 justify-center">
                            <Network className="w-3.5 h-3.5 text-accent-green" />
                            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">BUS_SYNC</span>
                        </div>
                        <div className="flex items-center gap-3 glass-panel border-white/5 py-3 px-4 justify-end">
                            <Database className="w-3.5 h-3.5 text-accent-rose" />
                            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">MEM_ALGN</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cinematic Overlay Text */}
            <div className="absolute bottom-12 flex items-center justify-between w-full px-12 border-t border-white/5 pt-8 opacity-20">
                <div className="flex items-center gap-4">
                    <Fingerprint className="w-4 h-4 text-white" />
                    <span className="text-[8px] font-black text-white tracking-[0.5em] uppercase italic">ENCRYPTED_UPLINK</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[8px] font-black text-white tracking-[0.5em] uppercase italic">XP_ARENA_REALT_ENGINE_V2_GENESIS</span>
                    <ShieldCheck className="w-4 h-4 text-white" />
                </div>
            </div>
        </div>
    );
}
