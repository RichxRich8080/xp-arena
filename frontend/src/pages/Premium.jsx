import React from 'react';
import { Target, Shield, Zap, Award, Check, ChevronRight, Star, Gem, CreditCard, Activity, Cpu, ArrowRight, Lock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

const Premium = () => {
    return (
        <div className="space-y-12 pb-20 animate-fade-in font-sans">
            {/* Header */}
            <div className="text-center space-y-6 max-w-3xl mx-auto px-4">
                <div className="flex items-center justify-center gap-4">
                    <div className="h-px w-8 bg-amber-500/30" />
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.3em]">Exclusive Benefits</span>
                    <div className="h-px w-8 bg-amber-500/30" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight uppercase leading-none">
                    Premium <span className="text-amber-500">Membership</span>
                </h1>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest leading-relaxed max-w-xl mx-auto">
                    Enhance your competitive experience with exclusive features and prioritized performance tools.
                </p>
            </div>

            {/* Pricing Card */}
            <div className="max-w-md mx-auto px-4 relative group">
                <div className="absolute -inset-1 bg-amber-500/20 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
                
                <Card className="relative p-10 md:p-14 bg-slate-900 border-amber-500/20 overflow-hidden rounded-[3rem] flex flex-col items-center shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] font-bold text-7xl select-none pointer-events-none uppercase text-white pointer-events-none">PRO</div>
                    
                    {/* Visual Badge */}
                    <div className="relative mb-8">
                        <div className="w-24 h-24 rounded-3xl bg-amber-500/10 border-2 border-amber-500/20 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-700">
                           <Gem className="w-12 h-12 text-amber-500" />
                        </div>
                        <div className="absolute -top-3 -right-3">
                             <div className="bg-amber-500 text-slate-950 p-2.5 rounded-xl shadow-xl animate-pulse">
                                <Star className="w-4 h-4 fill-current" />
                             </div>
                        </div>
                    </div>

                    <div className="text-center space-y-4 mb-10">
                         <div className="flex items-baseline justify-center gap-2">
                            <span className="text-5xl font-bold text-white tracking-tight tabular-nums">$9.99</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">/ MONTH</span>
                         </div>
                         <div className="inline-flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 px-6 py-1.5 rounded-full">
                            <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">Pro Plus Membership</span>
                         </div>
                    </div>

                    <div className="w-full space-y-3.5 mb-10">
                        {[
                            { label: "Permanent 20% XP Boost" },
                            { label: "Ad-Free Performance Tools" },
                            { label: "Exclusive Profile Badge" },
                            { label: "Priority Guild Access" }
                        ].map((benefit, i) => (
                            <div key={i} className="flex items-center gap-5 p-4 bg-slate-950 border border-white/5 rounded-2xl hover:border-amber-500/30 transition-all group/item">
                                <div className="w-5 h-5 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                                    <Check className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">{benefit.label}</span>
                            </div>
                        ))}
                    </div>

                    <Button className="w-full h-16 bg-white hover:bg-amber-500 text-slate-950 font-bold uppercase tracking-[0.2em] text-[10px] shadow-xl transition-all group/btn rounded-2xl">
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            Upgrade to Pro
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </span>
                    </Button>
                </Card>
            </div>

            {/* Payment Info */}
            <div className="flex flex-col items-center gap-8 pt-12 border-t border-white/5 mx-auto max-w-lg px-4 opacity-50 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-emerald-500" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Secure Payment Processing</span>
                </div>
                <div className="flex gap-10 items-center grayscale hover:grayscale-0 transition-all">
                    <div className="text-xl font-bold text-white tracking-tighter cursor-default">VISA</div>
                    <div className="text-xl font-bold text-white tracking-tighter cursor-default">MASTERCARD</div>
                    <div className="text-xl font-bold text-white tracking-tighter cursor-default">APPLE PAY</div>
                </div>
                
                <div className="flex items-center justify-center gap-8">
                   <div className="flex items-center gap-2.5">
                       <Shield className="w-3.5 h-3.5 text-slate-600" />
                       <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">256-Bit SSL</span>
                   </div>
                   <div className="flex items-center gap-2.5">
                       <CreditCard className="w-3.5 h-3.5 text-slate-600" />
                       <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Verified Payment</span>
                   </div>
                </div>
            </div>
        </div>
    );
};

export default Premium;
