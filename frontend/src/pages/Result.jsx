import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, Share2, Save, ArrowLeft, Activity, ShieldCheck, Zap, Info, ChevronRight, Layout } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

const MultiSliderResult = ({ label, value, color, delay }) => (
    <div 
        className="glass-panel border-white/5 bg-white/[0.01] p-8 hover:bg-white/[0.03] transition-all group animate-in zoom-in duration-700"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="flex justify-between items-end mb-6">
            <div className="space-y-1">
                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest block">{label}_NODE</span>
                <span className={cn("text-4xl font-black italic tracking-tighter leading-none", `text-${color}-400`)}>{value}</span>
            </div>
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic opacity-40">STABLE_COEF</div>
        </div>
        <div className="h-2 bg-background border border-white/5 rounded-full overflow-hidden p-0.5">
            <div
                className={cn("h-full rounded-full transition-all duration-[2000ms] ease-out shadow-[0_0_15px]", `bg-${color}-500 shadow-${color}-500/50`)}
                style={{ width: `${(value / 200) * 100}%` }}
            />
        </div>
    </div>
);

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState(null);

    useEffect(() => {
        if (!location.state?.calculation) {
            navigate('/tool');
            return;
        }

        const timer = setTimeout(() => {
            setLoading(false);
            setResults(location.state.calculation);
        }, 2500);

        return () => clearTimeout(timer);
    }, [location.state, navigate]);

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-12">
                <div className="relative group">
                    <div className="absolute -inset-10 bg-accent-cyan/10 blur-[80px] rounded-full animate-pulse" />
                    <div className="w-40 h-40 border-2 border-dashed border-accent-cyan/30 rounded-[3rem] animate-spin-slow flex items-center justify-center">
                        <div className="w-24 h-24 border-2 border-accent-cyan rounded-[2rem] animate-pulse flex items-center justify-center">
                             <Zap className="w-12 h-12 text-accent-cyan animate-bounce" />
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase animate-pulse">CALIBRATING_OPTICS...</h2>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] italic">Analysing Hardware Weights // DPI_Sync // Neural_Bypass</p>
                </div>
                <div className="flex gap-4">
                    <div className="w-3 h-3 rounded-full bg-accent-cyan animate-bounce" />
                    <div className="w-3 h-3 rounded-full bg-accent-cyan animate-bounce delay-150" />
                    <div className="w-3 h-3 rounded-full bg-accent-cyan animate-bounce delay-300" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-16 pb-20 animate-slide-in font-display">
            {/* Header / Banner */}
            <div className="relative overflow-hidden rounded-[4rem] bg-gradient-to-br from-accent-cyan/20 via-background to-background border border-accent-cyan/20 p-12 md:p-16 shadow-2xl">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.03] font-black text-9xl italic select-none pointer-events-none uppercase text-white">ARENI</div>
                 <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-accent-cyan uppercase tracking-[0.5em] italic">Neural_Calibration_Dossier</span>
                            <div className="w-10 h-1px bg-accent-cyan/50" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                            {location.state.device?.brand} <span className="text-accent-cyan">{location.state.device?.model}</span>
                        </h1>
                        <div className="flex gap-8">
                             <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-accent-green animate-pulse" />
                                <span className="text-[10px] font-black text-white uppercase italic tracking-widest">ACCURACY: 99.8%</span>
                             </div>
                             <div className="flex items-center gap-3">
                                <Activity className="w-4 h-4 text-accent-cyan" />
                                <span className="text-[10px] font-black text-gray-500 uppercase italic tracking-widest">LOW_LATENCY_CALIB</span>
                             </div>
                        </div>
                    </div>
                    
                    <Button 
                        onClick={() => navigate('/tool')}
                        variant="ghost" 
                        className="text-[9px] font-black text-gray-500 hover:text-white uppercase tracking-widest border border-white/5 py-3 px-6 rounded-2xl"
                    >
                        RECALIBRATE_NODE
                    </Button>
                 </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MultiSliderResult label="GENERAL_SENS" value={results.general} color="accent-cyan" delay={100} />
                <MultiSliderResult label="RED_DOT_HOLO" value={results.redDot} color="indigo" delay={200} />
                <MultiSliderResult label="2X_SCOPE_VEL" value={results.scope2x} color="accent-purple" delay={300} />
                <MultiSliderResult label="4X_SCOPE_DAMP" value={results.scope4x} color="accent-rose" delay={400} />
                <MultiSliderResult label="SNIPER_PRECISION" value={results.sniper} color="axp-gold" delay={500} />
                
                <Card className="glass-panel border-white/5 bg-white/[0.01] p-8 flex flex-col justify-center gap-6 animate-in zoom-in duration-700 delay-500">
                    <div className="space-y-1">
                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest block">HARDWARE_PROFILE</span>
                        <div className="text-xl font-black text-white italic tracking-tighter uppercase">{location.state.hardware?.ram} RAM // {location.state.hardware?.style}_MODE</div>
                    </div>
                    <div className="h-1px w-full bg-white/5" />
                    <div className="flex items-center gap-4 text-accent-green">
                         <ShieldCheck className="w-4 h-4" />
                         <span className="text-[9px] font-black uppercase tracking-widest">PHYSICS_VALIDATED</span>
                    </div>
                </Card>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
                 <Button className="py-8 bg-white text-background font-black uppercase italic tracking-[0.4em] text-[11px] shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-4 group">
                    <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    SAVE_TO_VAULT
                 </Button>
                 <Button className="py-8 bg-accent-cyan hover:bg-white text-background font-black uppercase italic tracking-[0.4em] text-[11px] shadow-[0_20px_40px_rgba(6,182,212,0.2)] hover:scale-105 transition-all flex items-center justify-center gap-4 group">
                    <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                    DOWNLOAD_DOSSIER
                 </Button>
            </div>
            
            <div className="flex justify-center flex-col items-center gap-8">
                 <button 
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-4 text-[10px] font-black text-gray-700 uppercase tracking-[0.34em] hover:text-white transition-colors group"
                 >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
                    RETURN_TO_COMMAND_CENTER
                 </button>
                 
                 <div className="glass-panel border-white/5 bg-white/[0.01] p-8 flex items-center gap-8 max-w-2xl opacity-30 mt-10">
                   <Info className="w-10 h-10 text-gray-500 shrink-0" />
                   <p className="text-[10px] text-gray-700 font-display font-black uppercase tracking-widest leading-relaxed italic">
                      CALIBRATION_SPEC_V3.2. ENSURE_GAME_DPI_MATCHES_1000_FOR_ATOMIC_PRECISION. UNVERIFIED_USE_OUTSIDE_ARENA_MAY_RESULT_IN_MISALIGNED_AXIS.
                   </p>
                </div>
            </div>
        </div>
    );
};

export default Result;
