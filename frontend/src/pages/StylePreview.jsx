import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Activity, Shield, Zap, Globe, Cpu, Sliders, Layout, MousePointer2, Settings, Sparkles, ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';

const StylePreview = () => {
    return (
        <div className="space-y-20 pb-32 animate-slide-in font-display">
            {/* Header */}
            <div className="text-center space-y-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-4">
                    <div className="h-1px w-10 bg-indigo-500/50" />
                    <span className="text-[10px] font-black italic text-indigo-400 uppercase tracking-[0.5em]">Design_Protocol_v8.4</span>
                    <div className="h-1px w-10 bg-indigo-500/50" />
                </div>
                <h1 className="text-5xl md:text-7xl font-black italic text-white tracking-tighter uppercase leading-none">
                    ARENI <span className="text-indigo-400">UI_KIT</span>
                </h1>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-lg mx-auto italic">
                    Tactical design tokens and high-fidelity component architectures defining the global Arena aesthetic.
                </p>
            </div>

            {/* Typography Section */}
            <section className="space-y-10">
                <div className="flex items-center gap-4 ml-4">
                    <span className="text-[10px] font-black text-gray-500 tracking-[0.4em] uppercase">01_TYPOGRAPHY_PROTOCOL</span>
                </div>
                <Card className="p-16 border-white/5 bg-white/[0.01] space-y-12 backdrop-blur-3xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] font-black text-9xl italic select-none pointer-events-none uppercase text-white">TYPE</div>
                    
                    <div className="space-y-16 relative z-10">
                        <div className="space-y-2">
                            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest italic block">DISPLAY_MAIN_CONDENSED</span>
                            <h2 className="text-6xl md:text-8xl font-black italic text-white tracking-tighter uppercase leading-none">NEURAL_TERMINAL</h2>
                        </div>
                        
                        <div className="space-y-2">
                             <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest italic block">SUB_HEADER_ACCENT</span>
                             <h3 className="text-3xl font-black italic text-accent-cyan tracking-widest uppercase">TACTICAL_NODE_IDENTITY</h3>
                        </div>

                        <div className="space-y-4 max-w-2xl">
                             <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest italic block">BODY_SYSTEM_MONO</span>
                             <p className="text-[12px] text-gray-400 font-bold uppercase tracking-[0.25em] leading-[2.2] italic">
                                PRECISE MECHANICAL CALIBRATION THROUGH HARDWARE-ATOMIC LOGIC AND KINEMATIC SIMULATION CYCLES DRIVEN BY USER TELEMETRY.
                             </p>
                        </div>
                    </div>
                </Card>
            </section>

            {/* Neural Colors Section */}
            <section className="space-y-10">
                <div className="flex items-center gap-4 ml-4">
                    <span className="text-[10px] font-black text-gray-500 tracking-[0.4em] uppercase">02_NEURAL_COLOR_TOKENS</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { name: "CYAN_CORE_ACCENT", color: "bg-accent-cyan", hex: "#06B6D4", shadow: "shadow-accent-cyan/20" },
                        { name: "INDIGO_NODE_LINK", color: "bg-indigo-500", hex: "#6366F1", shadow: "shadow-indigo-500/20" },
                        { name: "ROSE_ALERT_ALPHA", color: "bg-accent-rose", hex: "#F43F5E", shadow: "shadow-accent-rose/20" },
                        { name: "GOLD_AXP_ELITE", color: "bg-axp-gold", hex: "#FBBF24", shadow: "shadow-axp-gold/20" }
                    ].map((token, i) => (
                        <Card key={i} className="p-8 border-white/5 bg-white/[0.01] flex flex-col items-center group hover:border-white/20 transition-all cursor-crosshair">
                            <div className={cn("w-20 h-20 rounded-3xl mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-2xl", token.color, token.shadow)} />
                            <div className="text-center space-y-2">
                                <span className="text-[9px] font-black text-white uppercase italic tracking-tighter block">{token.name}</span>
                                <span className="text-[10px] font-black text-gray-600 uppercase font-mono tracking-widest">{token.hex}</span>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            {/* HUD Components Section */}
            <section className="space-y-10">
                <div className="flex items-center gap-4 ml-4">
                    <span className="text-[10px] font-black text-gray-500 tracking-[0.4em] uppercase">03_HUD_PRIMITIVES</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Interactive Button Preview */}
                    <Card className="p-12 border-white/5 bg-white/[0.01] space-y-10">
                        <div className="space-y-1">
                             <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic block">INTERACTIVE_ELEMENTS</span>
                             <h4 className="text-xl font-black italic text-white tracking-tighter uppercase">BUTTON_ARCHITECTURE</h4>
                        </div>
                        <div className="flex flex-col gap-6">
                            <Button className="w-full py-8 bg-accent-cyan font-black uppercase italic tracking-[0.5em] text-[10px] shadow-2xl">PRIMARY_UPLINK</Button>
                            <Button variant="outline" className="w-full py-8 border-accent-cyan/50 text-accent-cyan font-black uppercase italic tracking-[0.5em] text-[10px]">GHOST_NODE_OUTLINE</Button>
                            <Button variant="ghost" className="w-full py-6 text-gray-600 font-black uppercase italic tracking-[0.4em] text-[9px] hover:text-white transition-colors">DESTRUCTIVE_BYPASS</Button>
                        </div>
                    </Card>

                    {/* Glassmorphic Node Preview */}
                    <Card className="p-12 border-indigo-500/20 bg-indigo-500/[0.03] space-y-10 relative overflow-hidden group">
                        <div className="absolute -top-20 -right-20 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
                        <div className="space-y-4 relative z-10">
                             <div className="flex items-center gap-3">
                                <Settings className="w-4 h-4 text-indigo-400 animate-spin-slow" />
                                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.5em] italic">DYNAMICS_SYNERGY</span>
                             </div>
                             <h4 className="text-2xl font-black italic text-white tracking-tighter uppercase">GLASS_BYPASS_HUD_v2</h4>
                             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-loose italic max-w-xs">
                                MULTI-LAYERED_GLASS_PRIMITIVES_WITH_BACKDROP_ADAPTIVE_DENSITY.
                             </p>
                        </div>
                        <div className="pt-6 relative z-10">
                            <div className="flex items-center gap-6">
                                <div className="h-2 w-full bg-background rounded-full overflow-hidden p-0.5 border border-white/5">
                                    <div className="h-full w-2/3 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                                </div>
                                <span className="text-[11px] font-black text-white italic tracking-tighter">66%</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Footer Specifications */}
            <section className="pt-20 border-t border-white/5">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-1000">
                    <div className="flex items-center gap-10">
                        <Shield className="w-8 h-8 text-indigo-400" />
                        <div className="space-y-1">
                            <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest block">SECURITY_CLEARANCE</span>
                            <span className="text-[10px] font-black text-white italic uppercase tracking-widest">ENCRYPTED_DESIGN_LINK</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-12">
                         {[Globe, Cpu, Zap, Activity].map((Icon, i) => (
                            <Icon key={i} className="w-6 h-6 text-gray-700 hover:text-white transition-colors cursor-help" />
                         ))}
                    </div>
                </div>
                
                <div className="text-center pt-16">
                     <p className="text-[8px] text-gray-800 font-black uppercase tracking-[0.8em] italic">
                        ARENI_SYNDICATE_IDENTITY_GUIDELINES_STABLE_v8.4.2
                     </p>
                </div>
            </section>
        </div>
    );
};

export default StylePreview;
