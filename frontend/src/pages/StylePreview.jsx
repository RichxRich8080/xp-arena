import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Activity, Shield, Zap, Globe, Cpu, Sliders, Layout, MousePointer2, Settings, Sparkles, ChevronRight, Type, Palette, Component, Lock } from 'lucide-react';
import { cn } from '../utils/cn';

const StylePreview = () => {
    return (
        <div className="space-y-16 pb-32 animate-fade-in font-sans px-4 max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-6 max-w-3xl mx-auto">
                <div className="flex items-center justify-center gap-4">
                    <div className="h-px w-8 bg-primary/30" />
                    <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Design Infrastructure</span>
                    <div className="h-px w-8 bg-primary/30" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight uppercase leading-none">
                    Platform <span className="text-primary">Design System</span>
                </h1>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest leading-relaxed max-w-xl mx-auto">
                    A comprehensive library of design tokens and components engineered for consistency and performance.
                </p>
            </div>

            {/* Typography Section */}
            <section className="space-y-8">
                <div className="flex items-center gap-3 ml-2">
                    <Type className="w-4 h-4 text-primary" />
                    <h3 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">01 Typography</h3>
                </div>
                <Card className="p-10 md:p-16 border-white/5 bg-slate-900 space-y-12 overflow-hidden relative rounded-[3rem] shadow-2xl">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.02] font-bold text-9xl select-none pointer-events-none uppercase text-white pointer-events-none">TYPE</div>
                    
                    <div className="space-y-12 relative z-10">
                        <div className="space-y-2">
                            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest block">Display Extra Bold</span>
                            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight uppercase leading-none">Modern Interface</h2>
                        </div>
                        
                        <div className="space-y-2">
                             <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest block">Section Header</span>
                             <h3 className="text-3xl font-bold text-primary tracking-tight uppercase">High Performance Logic</h3>
                        </div>

                        <div className="space-y-4 max-w-2xl">
                             <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest block">Body Text Mono</span>
                             <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-[2] border-l-2 border-primary/20 pl-6">
                                Precise mechanical calibration powered by advanced algorithms and hardware-level performance metrics.
                             </p>
                        </div>
                    </div>
                </Card>
            </section>

            {/* Colors Section */}
            <section className="space-y-8">
                <div className="flex items-center gap-3 ml-2">
                    <Palette className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">02 Color Palette</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { name: "Primary Cyan", color: "bg-primary", hex: "#06B6D4" },
                        { name: "Indigo Modern", color: "bg-indigo-500", hex: "#6366F1" },
                        { name: "Status Alert", color: "bg-rose-500", hex: "#F43F5E" },
                        { name: "Elite Gold", color: "bg-amber-500", hex: "#FBBF24" }
                    ].map((token, i) => (
                        <Card key={i} className="p-6 bg-slate-900 border-white/5 flex flex-col items-center group hover:border-white/10 transition-all rounded-[2rem] shadow-xl">
                            <div className={cn("w-16 h-16 rounded-2xl mb-6 group-hover:scale-110 transition-transform shadow-lg", token.color)} />
                            <div className="text-center space-y-1">
                                <span className="text-[9px] font-bold text-white uppercase tracking-widest block">{token.name}</span>
                                <span className="text-[10px] font-bold text-slate-600 uppercase tabular-nums">{token.hex}</span>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Components Section */}
            <section className="space-y-8">
                <div className="flex items-center gap-3 ml-2">
                    <Component className="w-4 h-4 text-emerald-500" />
                    <h3 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">03 UI Components</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Buttons */}
                    <Card className="p-10 bg-slate-900 border-white/5 space-y-8 rounded-[2.5rem] shadow-xl">
                        <div className="space-y-1">
                             <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest block">Control Elements</span>
                             <h4 className="text-lg font-bold text-white tracking-tight uppercase">Action Buttons</h4>
                        </div>
                        <div className="flex flex-col gap-4">
                            <Button className="w-full h-14 bg-primary text-slate-950 font-bold uppercase tracking-widest text-[9px] shadow-lg rounded-xl">Primary Action</Button>
                            <Button variant="outline" className="w-full h-14 border-white/10 text-white font-bold uppercase tracking-widest text-[9px] rounded-xl hover:bg-white/5">Outline Variant</Button>
                            <Button variant="ghost" className="w-full h-12 text-slate-500 font-bold uppercase tracking-widest text-[8px] hover:text-white transition-colors">Ghost System</Button>
                        </div>
                    </Card>

                    {/* Cards */}
                    <Card className="p-10 bg-slate-900 border-indigo-500/20 space-y-8 relative overflow-hidden group rounded-[2.5rem] shadow-xl">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.02] font-bold text-7xl select-none pointer-events-none uppercase text-white pointer-events-none">CARD</div>
                        <div className="space-y-4 relative z-10">
                             <div className="flex items-center gap-2.5">
                                <Settings className="w-4 h-4 text-indigo-400" />
                                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Interactive State</span>
                             </div>
                             <h4 className="text-2xl font-bold text-white tracking-tight uppercase">Glass Container</h4>
                             <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest leading-relaxed max-w-xs">
                                Refined surfaces with subtle depth and adaptive backdrop effects.
                             </p>
                        </div>
                        <div className="pt-4 relative z-10">
                            <div className="flex items-center gap-6">
                                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                                    <div className="h-full w-2/3 bg-indigo-500 rounded-full shadow-lg" />
                                </div>
                                <span className="text-[10px] font-bold text-white tabular-nums">66%</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Footer */}
            <section className="pt-16 border-t border-white/5">
                <div className="flex flex-col md:flex-row items-center justify-between gap-10 opacity-30 grayscale hover:opacity-100 transition-all duration-700">
                    <div className="flex items-center gap-8">
                        <Lock className="w-7 h-7 text-slate-500" />
                        <div className="space-y-1">
                            <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest block">System Integrity</span>
                            <span className="text-[9px] font-bold text-white uppercase tracking-widest">Secure Design Assets</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-10">
                         {[Globe, Cpu, Zap, Activity].map((Icon, i) => (
                            <Icon key={i} className="w-5 h-5 text-slate-500 hover:text-white transition-colors cursor-help" />
                         ))}
                    </div>
                </div>
                
                <div className="text-center pt-12">
                     <p className="text-[8px] text-slate-700 font-bold uppercase tracking-[0.6em]">
                        Design System Guidelines v4.0.2
                     </p>
                </div>
            </section>
        </div>
    );
};

export default StylePreview;
