import React from 'react';
import { Globe, Cpu, Zap, Activity, ShieldCheck, Database, Network, ChevronRight, BarChart3, Users, Target, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { cn } from '../utils/cn';

const NodeItem = ({ id, title, icon: Icon, desc, color }) => (
    <Card className="group relative overflow-hidden bg-slate-900 border-white/5 p-8 md:p-10 transition-all duration-500 hover:border-primary/30 rounded-[2.5rem] shadow-2xl">
        <div className={cn("absolute -top-12 -right-12 w-48 h-48 blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity rounded-full", color.replace('text-', 'bg-'))} />
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10 text-center md:text-left">
            <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-500 group-hover:scale-110 border",
                color.replace('text-', 'bg-') + "/10",
                color.replace('text-', 'border-') + "/20"
            )}>
                <Icon className={cn("w-8 h-8", color)} />
            </div>
            <div className="flex-1 space-y-3">
                <div className="flex items-center justify-center md:justify-start gap-4">
                    <span className={cn("text-[9px] font-bold uppercase tracking-widest", color)}>{id}</span>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight uppercase">{title}</h3>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest leading-relaxed max-w-xl">{desc}</p>
            </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6 group/footer">
            <div className="flex items-center gap-3 text-slate-600">
                <Activity className="w-3.5 h-3.5" />
                <span className="text-[8px] font-bold uppercase tracking-widest">Status: Active</span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer group/link">
                <span className="text-[8px] font-bold text-slate-400 group-hover/link:text-primary uppercase tracking-widest transition-colors">View Details</span>
                <ArrowRight className="w-3 h-3 text-slate-600 group-hover/link:text-primary group-hover/link:translate-x-1 transition-all" />
            </div>
        </div>
    </Card>
);

const Ecosystem = () => {
    return (
        <div className="space-y-12 pb-20 animate-fade-in font-sans">
            {/* Header */}
            <div className="text-center space-y-6 max-w-3xl mx-auto px-4">
                <div className="flex items-center justify-center gap-4">
                    <div className="h-px w-8 bg-primary/30" />
                    <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Advanced Infrastructure</span>
                    <div className="h-px w-8 bg-primary/30" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight uppercase leading-none">
                    Platform <span className="text-primary">Ecosystem</span>
                </h1>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest leading-relaxed max-w-xl mx-auto">
                    A unified digital environment engineered for peak performance, consistent identity, and player rewards.
                </p>
            </div>

            {/* Core Components */}
            <div className="space-y-8 px-4 max-w-5xl mx-auto">
                 <div className="flex items-center gap-3 ml-2">
                    <Database className="w-4 h-4 text-primary" />
                    <h3 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">System Foundations</h3>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <NodeItem 
                        id="Component 01"
                        title="Performance Hub"
                        icon={Zap}
                        desc="Earn rewards through daily challenges, competitive ranking milestones, and precision device optimization."
                        color="text-amber-500"
                    />
                    <NodeItem 
                        id="Component 02"
                        title="Unified Identity"
                        icon={Globe}
                        desc="Your digital profile remains consistent across the network. Showcase verified performance data and achievements."
                        color="text-primary"
                    />
                    <NodeItem 
                        id="Component 03"
                        title="Precision Matrix"
                        icon={Target}
                        desc="Utilize advanced calibration logic to optimize your hardware settings for maximum competitive efficiency."
                        color="text-emerald-500"
                    />
                </div>
            </div>

            {/* Community Metrics */}
            <div className="px-4 max-w-5xl mx-auto">
                <Card className="bg-slate-900 border-white/5 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] font-bold text-9xl select-none pointer-events-none uppercase text-white pointer-events-none">DATA</div>
                    
                    <div className="flex flex-col md:flex-row gap-12 items-center relative z-10 text-center md:text-left">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2 leading-none">Global Player Base</span>
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <span className="text-4xl font-bold text-white tracking-tight tabular-nums">142,500</span>
                                <span className="text-xs font-bold text-primary uppercase tracking-widest">+</span>
                            </div>
                        </div>
                        <div className="h-12 w-px bg-white/5 hidden md:block" />
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2 leading-none">System Reliability</span>
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                 <span className="text-4xl font-bold text-primary tracking-tight tabular-nums">99.9%</span>
                                 <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Uptime</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 relative z-10">
                        <div className="text-right hidden sm:block">
                            <span className="text-[8px] font-bold text-slate-500 tracking-widest uppercase block">Operational Status</span>
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Optimal Performance</span>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                            <ShieldCheck className="w-7 h-7 text-emerald-500" />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Ecosystem;
