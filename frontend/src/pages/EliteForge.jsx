import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Target, Zap, Cpu, Wifi, MousePointer2, Lock, ShieldCheck, CreditCard, Crown, ChevronRight, Activity, Smartphone, Info } from 'lucide-react';
import { initializePaystack } from '../utils/paystack';
import { cn } from '../utils/cn';

export default function EliteForge() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const [isProcessing, setIsProcessing] = useState(false);

    const [formData, setFormData] = useState({
        dpi: 400,
        ping: 20,
        chipset: 'Snapdragon 8 Gen 2',
        fps: 60,
        playStyle: 'Balanced',
        currentSens: 100,
        screenSize: 6.1
    });

    const chipsetTiers = [
        { id: 'S-Tier', label: 'Snapdragon 8 Gen 2/3 / A17 Pro', desc: 'Flagship Performance' },
        { id: 'A-Tier', label: 'Snapdragon 870/888 / A15', desc: 'Premium Performance' },
        { id: 'B-Tier', label: 'Helio G99 / Dimensity 7000', desc: 'Mid-Range Performance' },
        { id: 'C-Tier', label: 'Snapdragon 680 / Helio G85', desc: 'Standard Performance' }
    ];

    const handlePayment = () => {
        setIsProcessing(true);

        initializePaystack({
            email: user?.email || 'guest@xparena.com',
            amount: 100000, 
            metadata: {
                custom_fields: [
                    { display_name: "Feature", variable_name: "feature", value: "Advanced Performance Audit" },
                    { display_name: "User ID", variable_name: "user_id", value: user?._id }
                ]
            },
            onSuccess: (response) => {
                setIsProcessing(false);
                addNotification('Access Granted', 'Advanced report unlocked.', 'success');
                navigate('/elite-result', { state: { formData, reference: response.reference } });
            },
            onClose: () => {
                setIsProcessing(false);
                addNotification('Transaction Cancelled', 'Payment was not completed.', 'info');
            }
        });
    };

    return (
        <div className="space-y-12 pb-20 animate-fade-in font-sans">
            {/* Premium Header */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-amber-500/20 shadow-xl">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none select-none">
                    <Crown className="w-64 h-64 text-amber-500" />
                </div>
                
                <div className="relative p-10 md:p-16 space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                        <Crown className="w-4 h-4 text-amber-500" />
                        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Pro Access</span>
                    </div>
                    
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight uppercase leading-tight">
                            Advanced <span className="text-amber-500">Calibration</span>
                        </h1>
                        <p className="text-slate-400 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
                            Unlock our most precise calibration algorithm. Factor in exact hardware benchmarks, display latency, and network stability for the ultimate performance profile.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Hardware Input Section */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center gap-3 px-2">
                        <Activity className="w-4 h-4 text-amber-500" />
                        <h3 className="text-[10px] font-bold text-white tracking-widest uppercase">Hardware Specifications</h3>
                    </div>

                    <Card className="p-8 md:p-12 space-y-12 bg-slate-900/50 border-white/5 rounded-[2rem]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* DPI and Ping */}
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Screen DPI</label>
                                        <span className="text-sm font-bold text-amber-500 tabular-nums">{formData.dpi} DPI</span>
                                    </div>
                                    <input
                                        type="range" min="100" max="1200" step="10"
                                        value={formData.dpi}
                                        onChange={(e) => setFormData({ ...formData, dpi: parseInt(e.target.value) })}
                                        className="w-full accent-amber-500 bg-white/5 rounded-full h-1.5"
                                    />
                                    <div className="flex justify-between text-[8px] text-slate-600 font-bold uppercase tracking-widest">
                                        <span>Standard</span>
                                        <span>Ultra High</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Network Latency</label>
                                        <span className="text-sm font-bold text-primary tabular-nums">{formData.ping}ms</span>
                                    </div>
                                    <input
                                        type="range" min="1" max="150" step="1"
                                        value={formData.ping}
                                        onChange={(e) => setFormData({ ...formData, ping: parseInt(e.target.value) })}
                                        className="w-full accent-primary bg-white/5 rounded-full h-1.5"
                                    />
                                    <div className="flex justify-between text-[8px] text-slate-600 font-bold uppercase tracking-widest">
                                        <span>Fiber</span>
                                        <span>Mobile</span>
                                    </div>
                                </div>
                            </div>

                            {/* Base Sens and PPI */}
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Base Sensitivity</label>
                                        <span className="text-sm font-bold text-white tabular-nums">{formData.currentSens}%</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="200" step="1"
                                        value={formData.currentSens}
                                        onChange={(e) => setFormData({ ...formData, currentSens: parseInt(e.target.value) })}
                                        className="w-full accent-white bg-white/5 rounded-full h-1.5"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Display Size</label>
                                    <div className="relative">
                                        <select
                                            value={formData.screenSize}
                                            onChange={(e) => setFormData({ ...formData, screenSize: parseFloat(e.target.value) })}
                                            className="w-full bg-slate-800 border border-white/5 rounded-xl p-4 font-bold text-sm text-white focus:outline-none focus:border-amber-500 transition-all appearance-none uppercase"
                                        >
                                            <option value="5.5">5.5" Display</option>
                                            <option value="6.1">6.1" Display</option>
                                            <option value="6.7">6.7" Display</option>
                                            <option value="12.9">12.9" Tablet</option>
                                        </select>
                                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chipset Selection */}
                        <div className="space-y-6 pt-10 border-t border-white/5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Processor Tier</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {chipsetTiers.map(tier => (
                                    <button
                                        key={tier.id}
                                        onClick={() => setFormData({ ...formData, chipset: tier.id })}
                                        className={cn(
                                            "flex items-center justify-between p-6 rounded-2xl border text-left transition-all group overflow-hidden relative",
                                            formData.chipset === tier.id
                                                ? "bg-amber-500/5 border-amber-500/30 shadow-lg"
                                                : "bg-slate-800 border-white/5 hover:border-white/10"
                                        )}
                                    >
                                        <div className="relative z-10 w-full flex justify-between items-center">
                                            <div className="space-y-1">
                                                <div className={cn("text-xs font-bold uppercase tracking-tight", formData.chipset === tier.id ? "text-white" : "text-slate-400")}>
                                                    {tier.label}
                                                </div>
                                                <div className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.2em]">{tier.desc}</div>
                                            </div>
                                            {formData.chipset === tier.id && <Zap className="w-5 h-5 text-amber-500 fill-amber-500/10" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Checkout Section */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="flex items-center gap-3 px-2">
                        <Lock className="w-4 h-4 text-amber-500" />
                        <h3 className="text-[10px] font-bold text-white tracking-widest uppercase">Secure Checkout</h3>
                    </div>

                    <Card className="p-8 md:p-10 border-amber-500/20 bg-amber-500/[0.02] relative overflow-hidden h-full flex flex-col justify-between rounded-[2rem]">
                        <div className="absolute top-0 left-0 w-24 h-24 bg-amber-500/10 blur-3xl -translate-x-1/2 -translate-y-1/2" />
                        
                        <div className="space-y-10 relative z-10">
                            <div className="text-center space-y-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widestSmall">Access Fee</span>
                                <div className="text-6xl font-bold text-white tracking-tight tabular-nums">
                                    $0.99
                                </div>
                            </div>

                            <div className="space-y-5">
                                {[
                                    { icon: Target, text: "Recoil Pattern Analysis" },
                                    { icon: Wifi, text: "Ping Lag Compensation" },
                                    { icon: MousePointer2, text: "DPI Matrix Scaling" },
                                    { icon: ShieldCheck, text: "Verified Pro Status" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <item.icon className="w-4 h-4 text-amber-500" />
                                        {item.text}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6 pt-12 relative z-10">
                            <Button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold h-18 uppercase tracking-widest text-[11px] rounded-xl shadow-lg transition-all"
                            >
                                {isProcessing ? 'Verifying...' : 'Unlock Advanced Audit'}
                            </Button>
                            
                            <div className="flex flex-col items-center gap-4 border-t border-white/5 pt-6">
                                <div className="flex items-center gap-2 opacity-50">
                                    <CreditCard className="w-4 h-4 text-white" />
                                    <span className="text-[8px] font-bold text-white uppercase tracking-widest">Secured by Paystack</span>
                                </div>
                                <div className="flex items-center gap-1 opacity-20">
                                    <ShieldCheck className="w-3 h-3 text-white" />
                                    <p className="text-[7px] text-white font-bold uppercase tracking-widest text-center">
                                        Single Audit License
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
