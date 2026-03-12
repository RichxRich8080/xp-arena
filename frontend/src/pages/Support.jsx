import React, { useState } from 'react';
import { HelpCircle, Book, MessageSquare, ChevronDown, ChevronUp, Zap, Activity, Info, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

const FAQNode = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div 
            className={cn(
                "glass-panel border-white/5 bg-white/[0.01] overflow-hidden transition-all duration-500",
                isOpen ? "bg-white/[0.03] border-accent-cyan/20" : "hover:bg-white/[0.02]"
            )}
        >
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-8 flex items-center justify-between text-left"
            >
                <div className="flex items-center gap-6">
                    <div className={cn(
                        "w-2 h-2 rounded-full transition-all duration-500",
                        isOpen ? "bg-accent-cyan shadow-[0_0_10px_rgba(6,182,212,0.8)]" : "bg-gray-700"
                    )} />
                    <h4 className="text-[11px] font-black text-white uppercase italic tracking-widest">{question}</h4>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-accent-cyan" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </button>
            <div className={cn(
                "px-20 transition-all duration-500 ease-in-out",
                isOpen ? "pb-8 opacity-100 max-h-96" : "pb-0 opacity-0 max-h-0"
            )}>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed italic border-t border-white/5 pt-6">
                    {answer}
                </p>
            </div>
        </div>
    );
};

const Support = () => {
    return (
        <div className="space-y-16 pb-20 animate-slide-in font-display">
            {/* Header */}
            <div className="text-center space-y-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-4">
                    <div className="h-1px w-10 bg-accent-cyan/50" />
                    <span className="text-[10px] font-black italic text-accent-cyan uppercase tracking-[0.5em]">Neural_Support_Node</span>
                    <div className="h-1px w-10 bg-accent-cyan/50" />
                </div>
                <h1 className="text-5xl md:text-7xl font-black italic text-white tracking-tighter uppercase leading-none">
                    HELP <span className="text-accent-cyan">CENTER</span>
                </h1>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-lg mx-auto italic">
                    Access tactical documentation and support protocols for the global Arena infrastructure.
                </p>
            </div>

            {/* Quick Actions HUD */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <button className="group relative overflow-hidden glass-panel p-12 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all text-left">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/10 blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-accent-cyan/20 transition-colors" />
                    <div className="flex items-center gap-8 relative z-10">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Zap className="w-8 h-8 text-accent-cyan" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black italic text-white tracking-tighter uppercase">Quick_Start</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">NEURAL_CALIBRATION_INTRO_V4</p>
                        </div>
                    </div>
                </button>

                <button className="group relative overflow-hidden glass-panel p-12 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all text-left">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-green/10 blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-accent-green/20 transition-colors" />
                    <div className="flex items-center gap-8 relative z-10">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-accent-green/10 border border-accent-green/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Book className="w-8 h-8 text-accent-green" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black italic text-white tracking-tighter uppercase">Docs_Node</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">SYSTEM_INTEGRITY_SPECS</p>
                        </div>
                    </div>
                </button>
            </div>

            {/* FAQ Section */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 ml-4">
                    <HelpCircle className="w-4 h-4 text-gray-500" />
                    <h3 className="text-[10px] font-black text-gray-500 tracking-[0.4em] uppercase">FREQUENTLY_ACCESSED_LOGS</h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <FAQNode
                        question="How is AXP calculated?"
                        answer="AXP (Areni Experience Points) is derived from atomic match performance metrics, daily quest synchronization, and successful neural calibrations verified by the engine's physics-validation module."
                    />
                    <FAQNode
                        question="is the sensitivity engine legal?"
                        answer="Affirmative. The engine executes hardware-level kinematic calculations without injecting code into game binaries. It is 100% compliant with EAC, BattleEye, and Ricochet anti-cheat protocols."
                    />
                    <FAQNode
                        question="Can I export my presets?"
                        answer="All calibrated presets can be transcoded into high-fidelity PNG dossiers or encrypted data packets (.xpa) for seamless transfer between terminal hardware."
                    />
                </div>
            </div>

            {/* Support Ticket Module */}
            <div className="glass-panel border-accent-cyan/20 bg-accent-cyan/[0.03] p-12 relative overflow-hidden group rounded-[2.5rem]">
                <div className="absolute top-0 left-0 w-2 h-full bg-accent-cyan shadow-[0_0_40px_rgba(6,182,212,0.6)]" />
                <div className="flex flex-col md:flex-row gap-12 items-center relative z-10 text-center md:text-left">
                    <div className="w-24 h-24 rounded-[2rem] bg-accent-cyan/10 flex items-center justify-center shrink-0 border border-accent-cyan/30 group-hover:scale-110 transition-transform">
                        <MessageSquare className="w-12 h-12 text-accent-cyan" />
                    </div>
                    <div className="space-y-4 flex-1">
                        <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase">STILL_NEED_ASSISTANCE?</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed italic max-w-xl mx-auto md:mx-0">
                            Open a high-priority communication link with our lead system architects for complex node issues or partnership synchronization.
                        </p>
                        <div className="pt-4 flex justify-center md:justify-start">
                            <Button 
                                className="px-10 py-5 bg-white text-background font-black text-[10px] tracking-[0.3em] uppercase italic group-hover:scale-105 transition-all flex items-center gap-4 shadow-[0_15px_30px_rgba(255,255,255,0.1)]"
                            >
                                SUBMIT_TACTICAL_TICKET
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Support;
