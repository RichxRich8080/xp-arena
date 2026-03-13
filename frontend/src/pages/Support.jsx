import React, { useState } from 'react';
import { HelpCircle, Book, MessageSquare, ChevronDown, ChevronUp, Zap, Activity, Info, ArrowRight, FileText } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

const FAQNode = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div 
            className={cn(
                "bg-slate-900 border border-white/5 overflow-hidden transition-all duration-300 rounded-2xl",
                isOpen ? "border-primary/30 shadow-lg" : "hover:border-white/10"
            )}
        >
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-6 flex items-center justify-between text-left"
            >
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        isOpen ? "bg-primary shadow-[0_0_10px_rgba(6,182,212,0.5)]" : "bg-slate-700"
                    )} />
                    <h4 className="text-[11px] font-bold text-white uppercase tracking-widest">{question}</h4>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>
            <div className={cn(
                "px-12 md:px-16 transition-all duration-300 ease-in-out",
                isOpen ? "pb-6 opacity-100 max-h-96" : "pb-0 opacity-0 max-h-0"
            )}>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest leading-relaxed border-t border-white/5 pt-5">
                    {answer}
                </p>
            </div>
        </div>
    );
};

const Support = () => {
    return (
        <div className="space-y-12 pb-20 animate-fade-in font-sans">
            {/* Header */}
            <div className="text-center space-y-6 max-w-3xl mx-auto px-4">
                <div className="flex items-center justify-center gap-4">
                    <div className="h-px w-8 bg-primary/30" />
                    <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Support Center</span>
                    <div className="h-px w-8 bg-primary/30" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight uppercase leading-none">
                    Help <span className="text-primary">Center</span>
                </h1>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest leading-relaxed max-w-xl mx-auto">
                    Access technical documentation and support protocols for the global infrastructure.
                </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 max-w-5xl mx-auto">
                <button className="group relative overflow-hidden bg-slate-900 border border-white/5 p-10 hover:border-primary/20 transition-all text-left rounded-[2.5rem] shadow-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                            <Zap className="w-7 h-7 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-white tracking-tight uppercase">Getting Started</h3>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Platform Integration Guide</p>
                        </div>
                    </div>
                </button>

                <button className="group relative overflow-hidden bg-slate-900 border border-white/5 p-10 hover:border-indigo-500/20 transition-all text-left rounded-[2.5rem] shadow-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/10 transition-colors" />
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                            <FileText className="w-7 h-7 text-indigo-400" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-white tracking-tight uppercase">Technical Docs</h3>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">API &amp; System Specifications</p>
                        </div>
                    </div>
                </button>
            </div>

            {/* FAQ Section */}
            <div className="space-y-8 px-4 max-w-5xl mx-auto">
                <div className="flex items-center gap-3 ml-2">
                    <HelpCircle className="w-4 h-4 text-primary" />
                    <h3 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Frequently Asked Questions</h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <FAQNode
                        question="How is XP calculated?"
                        answer="XP (Experience Points) is derived from atomic match performance metrics, daily challenge completion, and successful system optimizations verified by our performance logic."
                    />
                    <FAQNode
                        question="Is the optimization tool permitted?"
                        answer="Yes. Our engine executes hardware-level performance adjustments without modifying game files. It is fully compliant with standard anti-cheat protocols across all major titles."
                    />
                    <FAQNode
                        question="Can I export my configurations?"
                        answer="All optimized settings can be exported as secure profiles or digital documents for easy transfer between compatible hardware devices."
                    />
                </div>
            </div>

            {/* Support Ticket Section */}
            <div className="px-4 max-w-5xl mx-auto">
                <Card className="bg-slate-900 border-primary/20 p-10 md:p-14 relative overflow-hidden group rounded-[2.5rem] shadow-2xl">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                    <div className="flex flex-col md:flex-row gap-10 items-center relative z-10 text-center md:text-left">
                        <div className="w-20 h-20 rounded-2xl bg-slate-950 flex items-center justify-center shrink-0 border border-white/5 group-hover:scale-110 transition-transform shadow-lg">
                            <MessageSquare className="w-10 h-10 text-primary" />
                        </div>
                        <div className="space-y-4 flex-1">
                            <h4 className="text-2xl font-bold text-white tracking-tight uppercase">Need more assistance?</h4>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest leading-relaxed max-w-xl mx-auto md:mx-0">
                                Create a support ticket to receive direct assistance from our technical team for complex issues or partnership inquiries.
                            </p>
                            <div className="pt-4 flex justify-center md:justify-start">
                                <Button 
                                    className="h-14 px-10 bg-white hover:bg-primary text-slate-950 font-bold text-[10px] tracking-widest uppercase rounded-xl transition-all flex items-center gap-3 shadow-xl"
                                >
                                    Create Support Ticket
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Support;
