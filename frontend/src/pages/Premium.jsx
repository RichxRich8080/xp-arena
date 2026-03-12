import React from 'react';
import { Target, Shield, Zap, Award, Check, ChevronRight, Star, Gem, CreditCard, Activity, Cpu } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

const Premium = () => {
    return (
        <div className="space-y-16 pb-20 animate-slide-in font-display">
            {/* Header / Intro */}
            <div className="text-center space-y-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-4">
                    <div className="h-1px w-10 bg-accent-purple/50" />
                    <span className="text-[10px] font-black italic text-accent-purple uppercase tracking-[0.5em]">Elite_Syndicate_Node</span>
                    <div className="h-1px w-10 bg-accent-purple/50" />
                </div>
                <h1 className="text-5xl md:text-7xl font-black italic text-white tracking-tighter uppercase leading-none">
                    UNLOCK <span className="text-accent-purple text-glow-purple">ELITE</span>
                </h1>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-lg mx-auto italic">
                    Secure the ultimate architectural advantage and dominate the global network with high-tier syndicate privileges.
                </p>
            </div>

            {/* Premium Membership Card */}
            <div className="max-w-md mx-auto relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-purple/30 via-accent-cyan/20 to-accent-purple/30 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
                
                <Card className="relative p-12 md:p-16 border-accent-purple/20 bg-[#080510] overflow-hidden rounded-[4rem] flex flex-col items-center">
                    <div className="scanline opacity-10" />
                    
                    {/* Visual Badge */}
                    <div className="relative mb-12">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-accent-purple/10 border-2 border-accent-purple/30 flex items-center justify-center shadow-[0_0_60px_rgba(168,85,247,0.15)] group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                           <Gem className="w-16 h-16 text-accent-purple" />
                        </div>
                        <div className="absolute -top-4 -right-4">
                             <div className="bg-white text-background p-3 rounded-2xl shadow-2xl animate-pulse">
                                <Star className="w-4 h-4 fill-current" />
                             </div>
                        </div>
                    </div>

                    <div className="text-center space-y-4 mb-12">
                         <div className="flex items-baseline justify-center gap-2">
                            <span className="text-6xl font-black italic text-white tracking-tighter">$9.99</span>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">/ SOLAR_CYCLE</span>
                         </div>
                         <div className="inline-flex items-center gap-3 bg-accent-purple/10 border border-accent-purple/20 px-6 py-2 rounded-full">
                            <span className="text-[10px] font-black text-accent-purple uppercase tracking-[0.4em] italic">DIAMOND_TIER_ACCESS</span>
                         </div>
                    </div>

                    <div className="w-full space-y-4 mb-12">
                        {[
                            { label: "Permanent 20% AXP Boost", sub: "ACCELERATED_GROWTH_NODE" },
                            { label: "Ad-Free Neural Calibration", sub: "UNINTERRUPTED_SYNC_BYPASS" },
                            { label: "Exclusive Diamond Badge", sub: "GLOBAL_IDENTITY_MARKER" },
                            { label: "Priority Guild Creation", sub: "SYNDICATE_LEADERSHIP_PERM" }
                        ].map((benefit, i) => (
                            <div key={i} className="flex items-center gap-6 p-5 glass-panel border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group/item">
                                <div className="w-6 h-6 rounded-lg bg-accent-purple/10 flex items-center justify-center text-accent-purple group-hover/item:scale-110 transition-transform">
                                    <Check className="w-4 h-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-[10px] font-black text-white uppercase italic tracking-tight block">{benefit.label}</span>
                                    <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest">{benefit.sub}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button className="w-full py-8 bg-white text-background font-black uppercase italic tracking-[0.4em] text-[11px] shadow-[0_20px_40px_rgba(255,255,255,0.1)] group/btn hover:scale-105 transition-all">
                        <span className="relative z-10 flex items-center justify-center gap-4">
                            INITIATE_UPGRADE_LINK
                            <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                        </span>
                    </Button>
                </Card>
            </div>

            {/* Secure Payment Footer */}
            <div className="flex flex-col items-center gap-8 opacity-40 transition-opacity hover:opacity-100 pb-10 pt-10 border-t border-white/5 mx-auto max-w-lg">
                <div className="flex items-center gap-4">
                    <Shield className="w-4 h-4 text-accent-green" />
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] italic">SECURE_NEURAL_TRANSACTION_PROTOCOL</span>
                </div>
                <div className="flex gap-12 items-center">
                    <div className="text-xl font-black text-white italic tracking-tighter opacity-20 hover:opacity-100 transition-opacity cursor-default">VISA</div>
                    <div className="text-xl font-black text-white italic tracking-tighter opacity-20 hover:opacity-100 transition-opacity cursor-default">MASTER_CARD</div>
                    <div className="text-xl font-black text-white italic tracking-tighter opacity-20 hover:opacity-100 transition-opacity cursor-default">APPLE_PAY</div>
                </div>
                
                <div className="flex items-center gap-10">
                   <div className="flex items-center gap-3">
                       <Activity className="w-3.5 h-3.5 text-gray-700" />
                       <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">RSA_ENCRYPTED</span>
                   </div>
                   <div className="flex items-center gap-3">
                       <Cpu className="w-3.5 h-3.5 text-gray-700" />
                       <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">NODE_VERIFIED</span>
                   </div>
                </div>
            </div>
        </div>
    );
};

export default Premium;
