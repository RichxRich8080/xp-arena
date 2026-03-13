import React from 'react';
import { Shield, Target, Cpu, Network, Award, Activity, Globe, Zap, Info, Layers, Users } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { cn } from '../utils/cn';

const SpecNode = ({ label, val, color }) => (
    <div className="group relative overflow-hidden bg-slate-900 border border-white/5 p-8 hover:border-primary/20 transition-all flex items-center justify-between rounded-2xl shadow-lg">
        <div className={cn("absolute top-0 right-0 w-24 h-24 blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity", color)} />
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest relative z-10">{label}</span>
        <span className={cn("text-[11px] font-bold uppercase tracking-widest tabular-nums relative z-10", color.replace('bg-', 'text-'))}>{val}</span>
    </div>
);

const About = () => {
    return (
        <div className="space-y-16 pb-20 animate-fade-in font-sans">
            {/* Header */}
            <div className="text-center space-y-6 max-w-2xl mx-auto px-4">
                <div className="flex items-center justify-center gap-4">
                    <div className="h-px w-8 bg-primary/30" />
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Platform Overview</span>
                    <div className="h-px w-8 bg-primary/30" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight uppercase leading-none">
                    Our <span className="text-primary">Mission</span>
                </h1>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-[0.1em] leading-relaxed max-w-lg mx-auto">
                    Optimizing the synergy between player skill and digital settings for the next generation of competitive gaming.
                </p>
            </div>

            {/* Content Section */}
            <div className="relative group px-4">
                <Card className="relative p-10 md:p-16 bg-slate-900 border-white/5 overflow-hidden text-center space-y-12 rounded-[2.5rem] shadow-2xl">
                     <div className="absolute top-0 right-0 p-12 opacity-[0.02] font-bold text-9xl select-none pointer-events-none uppercase text-white">
                        ABOUT
                    </div>
                    
                    <div className="space-y-8 relative z-10">
                        <div className="inline-flex items-center gap-3 bg-slate-950 border border-white/10 px-6 py-2 rounded-full">
                            <Shield className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Professional Standards</span>
                        </div>
                        
                        <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight uppercase leading-tight max-w-3xl mx-auto">
                            XP Arena is a professional <span className="text-primary">Ecosystem</span> optimized for competitive performance.
                        </h2>
                        
                        <div className="h-px w-24 bg-white/10 mx-auto" />
                        
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-widest leading-loose max-w-2xl mx-auto opacity-80 decoration-slate-500">
                            Our platform analyzes hardware configurations and player metrics to provide high-precision settings. We bridge the gap between technical setups and player performance, ensuring a consistent and competitive experience across all titles.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-16 border-t border-white/5">
                        {[
                            { icon: Target, title: 'Precision', label: 'Sensitivity Tools' },
                            { icon: Users, title: 'Network', label: 'Player Community' },
                            { icon: Award, title: 'Ranking', label: 'Global Leaderboards' }
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center border border-primary/20">
                                    <stat.icon className="w-6 h-6 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-white font-bold text-xl tracking-tight uppercase">{stat.title}</h4>
                                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Technical Overview */}
            <div className="space-y-8 px-4">
                 <div className="flex items-center gap-3 ml-2">
                    <Cpu className="w-4 h-4 text-primary" />
                    <h3 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Platform Technical Specs</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <SpecNode label="System Version" val="v4.2.0-stable" color="bg-primary" />
                    <SpecNode label="Processing Delay" val="&lt; 1ms" color="bg-green-500" />
                    <SpecNode label="Calibration Data" val="Hardware Sync" color="bg-indigo-400" />
                    <SpecNode label="Global Server" val="United Nodes" color="bg-amber-500" />
                </div>
            </div>

            {/* Footer Notice */}
            <div className="flex flex-col items-center text-center space-y-8 pt-10 px-4">
                <div className="flex items-center gap-8 md:gap-12">
                   <div className="flex flex-col gap-1.5">
                       <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Est. Since</span>
                       <span className="text-[10px] font-bold text-white uppercase tracking-widest">2026 Q1</span>
                   </div>
                   <div className="h-10 w-px bg-white/10" />
                   <div className="flex flex-col gap-1.5">
                       <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Current Status</span>
                       <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active</span>
                   </div>
                </div>
                
                <div className="bg-slate-900 border border-white/5 p-6 flex items-center gap-3 rounded-2xl max-w-2xl">
                   <Info className="w-4 h-4 text-slate-500 shrink-0" />
                   <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest text-left">
                      Proprietary technology developed by the XP Arena team. No part of this platform may be reproduced without explicit permission.
                   </p>
                </div>
            </div>
        </div>
    );
};

export default About;
