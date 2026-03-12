import React from 'react';
import { Shield, Target, Cpu, Network, Award, Activity, Globe, Zap, Info } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { cn } from '../utils/cn';

const SpecNode = ({ label, val, color }) => (
    <div className="group relative overflow-hidden glass-panel border-white/5 bg-white/[0.01] p-8 hover:bg-white/[0.03] transition-all flex items-center justify-between">
        <div className={cn("absolute top-0 right-0 w-24 h-24 blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity", `bg-${color}`)} />
        <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] italic relative z-10">{label}</span>
        <span className={cn("text-[11px] font-black uppercase italic tracking-widest font-mono relative z-10", `text-${color}`)}>{val}</span>
    </div>
);

const About = () => {
    return (
        <div className="space-y-16 pb-20 animate-slide-in font-display">
            {/* Header */}
            <div className="text-center space-y-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-4">
                    <div className="h-1px w-10 bg-accent-cyan/50" />
                    <span className="text-[10px] font-black italic text-accent-cyan uppercase tracking-[0.5em]">Project_Protocol_Alpha</span>
                    <div className="h-1px w-10 bg-accent-cyan/50" />
                </div>
                <h1 className="text-5xl md:text-7xl font-black italic text-white tracking-tighter uppercase leading-none">
                    THE <span className="text-accent-cyan">MISSION</span>
                </h1>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-lg mx-auto italic">
                    Redefining the boundaries between mechanical precision and digital identity for the next generation of operators.
                </p>
            </div>

            {/* Vision Dossier */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-cyan/20 to-accent-green/20 blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" />
                <Card className="relative p-12 md:p-20 border-white/5 bg-[#05070a] overflow-hidden text-center space-y-12">
                     <div className="absolute top-0 right-0 p-12 opacity-[0.03] font-black text-9xl italic select-none pointer-events-none uppercase text-white">
                        ALPHA
                    </div>
                    
                    <div className="space-y-8 relative z-10">
                        <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2 rounded-full">
                            <Shield className="w-4 h-4 text-accent-cyan" />
                            <span className="text-[10px] font-black text-accent-cyan uppercase tracking-[0.3em] italic">SYNDICATE_PROTOCOL</span>
                        </div>
                        
                        <h2 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase leading-tight max-w-3xl mx-auto">
                            XP ARENA IS A HIGH-FIDELITY <span className="text-accent-cyan">ECOSYSTEM</span> ENGINEERED FOR COMPETITIVE SUPREMACY.
                        </h2>
                        
                        <div className="h-1px w-32 bg-white/10 mx-auto" />
                        
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest leading-loose max-w-2xl mx-auto italic opacity-80 group-hover:opacity-100 transition-opacity">
                            Our architecture utilizes hardware-level physics and deep kinematic learning to provide the most precise tactical calibration in the global arena. We map your mechanical precision into universally accepted tokens and persistent decentralized identity.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-16 border-t border-white/5">
                        {[
                            { icon: Target, title: 'PRECISION', label: 'ATOMIC_CALIBRATION' },
                            { icon: Network, title: 'IDENTITY', label: 'CROSS_TITLE_DOSSIER' },
                            { icon: Award, title: 'RANKING', label: 'GLOBAL_ELITE_TIER' }
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col items-center gap-4">
                                <stat.icon className="w-8 h-8 text-accent-cyan" />
                                <div className="space-y-1">
                                    <h4 className="text-white font-black italic text-xl tracking-tighter uppercase">{stat.title}</h4>
                                    <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Technical Hub */}
            <div className="space-y-8">
                 <div className="flex items-center gap-4 ml-4">
                    <Cpu className="w-4 h-4 text-gray-500" />
                    <h3 className="text-[10px] font-black text-gray-500 tracking-[0.4em] uppercase">SYSTEM_TECHNICAL_STACK</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <SpecNode label="ENGINE_VERSION" val="V8.4.2-STABLE" color="accent-cyan" />
                    <SpecNode label="NEURAL_LATENCY" val="0.002MS_TARGET" color="accent-green" />
                    <SpecNode label="CALIBRATION_LOGIC" val="HARDWARE_ATOMIC" color="indigo-400" />
                    <SpecNode label="SYNC_PROTOCOL" val="XPA_INFRA_PRO" color="accent-rose" />
                </div>
            </div>

            {/* Footer Notice */}
            <div className="flex flex-col items-center text-center space-y-8 opacity-30 pt-10">
                <div className="flex items-center gap-12">
                   <div className="flex flex-col gap-2">
                       <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">ESTABLISHED_DATE</span>
                       <span className="text-[10px] font-black text-white italic uppercase tracking-[0.3em]">2026_CYCLE_01</span>
                   </div>
                   <div className="h-10 w-1px bg-white/10" />
                   <div className="flex flex-col gap-2">
                       <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">GLOBAL_REGION</span>
                       <span className="text-[10px] font-black text-white italic uppercase tracking-[0.3em]">OMEGA_SECTOR</span>
                   </div>
                </div>
                
                <div className="glass-panel border-white/5 bg-white/[0.01] p-6 flex items-center gap-3">
                   <Info className="w-4 h-4 text-gray-600" />
                   <p className="text-[8px] text-gray-700 font-bold uppercase tracking-[0.4em] italic">
                      PROPRIETARY TECHNOLOGY OF THE ARENI SYNDICATE GROUP. UNAUTHORIZED NEURAL LINKING IS STRICTLY MONITORED.
                   </p>
                </div>
            </div>
        </div>
    );
};

export default About;
