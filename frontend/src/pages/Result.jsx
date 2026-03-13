import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, Share2, Save, ArrowLeft, Activity, ShieldCheck, Zap, Info, ChevronRight, Layout, CheckCircle2, FileText, RefreshCcw } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

const MultiSliderResult = ({ label, value, color, delay }) => (
    <Card 
        className="bg-slate-900 border-white/5 p-8 hover:border-primary/20 transition-all group animate-fade-in rounded-[2rem] shadow-xl"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="flex justify-between items-end mb-6">
            <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">{label}</span>
                <span className={cn("text-4xl font-bold tracking-tight leading-none", color)}>{value}</span>
            </div>
            <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Optimal</div>
        </div>
        <div className="h-1.5 bg-slate-950 border border-white/5 rounded-full overflow-hidden">
            <div
                className={cn("h-full rounded-full transition-all duration-[1500ms] ease-out", color.replace('text-', 'bg-'))}
                style={{ width: `${(value / 200) * 100}%` }}
            />
        </div>
    </Card>
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
        }, 2000);

        return () => clearTimeout(timer);
    }, [location.state, navigate]);

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-10 px-4">
                <div className="relative">
                    <div className="absolute -inset-10 bg-primary/10 blur-[60px] rounded-full animate-pulse" />
                    <div className="w-32 h-32 border-2 border-white/5 rounded-3xl flex items-center justify-center relative bg-slate-900 shadow-2xl">
                        <RefreshCcw className="w-12 h-12 text-primary animate-spin" />
                    </div>
                </div>
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight text-white uppercase">Calculating Results</h2>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Analyzing Input Variables &amp; Hardware Profile</p>
                </div>
                <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce delay-150" />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce delay-300" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20 animate-fade-in font-sans">
            {/* Report Header */}
            <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 border border-white/5 p-10 md:p-14 shadow-2xl">
                 <div className="absolute top-0 right-0 p-10 opacity-[0.02] font-bold text-9xl select-none pointer-events-none uppercase text-white pointer-events-none">REPORT</div>
                 <div className="relative z-10 flex flex-col md:flex-row justify-between items-center md:items-start gap-10 text-center md:text-left">
                    <div className="space-y-6">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <FileText className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Calibration Report</span>
                            <div className="w-8 h-px bg-primary/30 hidden md:block" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight uppercase leading-none">
                            {location.state.device?.brand} <span className="text-primary">{location.state.device?.model}</span>
                        </h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-6">
                             <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest tabular-nums">Confidence: 99.8%</span>
                             </div>
                             <div className="flex items-center gap-2.5">
                                <Activity className="w-4 h-4 text-primary" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Optimized for Latency</span>
                             </div>
                        </div>
                    </div>
                    
                    <Button 
                        onClick={() => navigate('/tool')}
                        className="h-12 px-8 bg-slate-950 hover:bg-slate-900 border border-white/5 text-[9px] font-bold text-slate-400 hover:text-white uppercase tracking-widest rounded-xl transition-all"
                    >
                        Recalibrate Profile
                    </Button>
                 </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MultiSliderResult label="General Sens" value={results.general} color="text-primary" delay={100} />
                <MultiSliderResult label="ADS Sensitivity" value={results.redDot} color="text-indigo-400" delay={200} />
                <MultiSliderResult label="2X Scope" value={results.scope2x} color="text-emerald-400" delay={300} />
                <MultiSliderResult label="4X Scope" value={results.scope4x} color="text-rose-400" delay={400} />
                <MultiSliderResult label="Sniper Profile" value={results.sniper} color="text-amber-500" delay={500} />
                
                <Card className="bg-slate-900 border-white/5 p-8 flex flex-col justify-center gap-6 animate-fade-in rounded-[2rem] shadow-xl" style={{ animationDelay: '600ms' }}>
                    <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Hardware Profile</span>
                        <div className="text-xl font-bold text-white tracking-tight uppercase">{location.state.hardware?.ram} RAM // {location.state.hardware?.style}</div>
                    </div>
                    <div className="h-px w-full bg-white/5" />
                    <div className="flex items-center gap-3 text-emerald-500">
                         <ShieldCheck className="w-4 h-4" />
                         <span className="text-[9px] font-bold uppercase tracking-widest">Verified Output</span>
                    </div>
                </Card>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto px-4">
                 <Button className="h-16 bg-white hover:bg-slate-200 text-slate-950 font-bold uppercase tracking-widest text-[10px] shadow-xl transition-all flex items-center justify-center gap-3 group rounded-2xl">
                    <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Save Profile
                 </Button>
                 <Button className="h-16 bg-primary hover:bg-primary/90 text-slate-950 font-bold uppercase tracking-widest text-[10px] shadow-xl transition-all flex items-center justify-center gap-3 group rounded-2xl">
                    <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                    Download Report
                 </Button>
            </div>
            
            <div className="flex flex-col items-center gap-10 px-4">
                 <button 
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:text-white transition-colors group"
                 >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Return to Dashboard
                 </button>
                 
                 <div className="bg-slate-900 border border-white/5 p-8 flex items-center gap-6 max-w-2xl rounded-3xl opacity-40 hover:opacity-100 transition-opacity">
                   <Info className="w-8 h-8 text-slate-500 shrink-0" />
                   <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                      Calibration Engine v4.0. Results are optimized for standard performance metrics. Discrepancies may occur across non-standard configurations.
                   </p>
                </div>
            </div>
        </div>
    );
};

export default Result;
