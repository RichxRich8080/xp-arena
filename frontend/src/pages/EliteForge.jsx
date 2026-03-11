import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Target, Zap, Cpu, Wifi, MousePointer2, Lock, ShieldCheck, CreditCard } from 'lucide-react';
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
        playStyle: 'Balanced'
    });

    const chipsetTiers = [
        { id: 'S-Tier', label: 'Snapdragon 8 Gen 2/3 / A17 Pro', desc: 'Ultra High-Performance' },
        { id: 'A-Tier', label: 'Snapdragon 870/888 / A15', desc: 'Premium Performance' },
        { id: 'B-Tier', label: 'Helio G99 / Dimensity 7000', desc: 'Mid-Range Gaming' },
        { id: 'C-Tier', label: 'Snapdragon 680 / Helio G85', desc: 'Budget Gaming' }
    ];

    const handlePayment = () => {
        setIsProcessing(true);

        initializePaystack({
            email: user?.email || 'guest@xparena.com',
            amount: 100000, // $0.99 or 1000 NGN approx
            metadata: {
                custom_fields: [
                    { display_name: "Feature", variable_name: "feature", value: "Elite Sensitivity Audit" },
                    { display_name: "User ID", variable_name: "user_id", value: user?._id }
                ]
            },
            onSuccess: (response) => {
                setIsProcessing(false);
                addNotification('Payment Successful', 'Elite Forge Unlocked!', 'success');
                // Navigate to elite result with data
                navigate('/elite-result', { state: { formData, reference: response.reference } });
            },
            onClose: () => {
                setIsProcessing(false);
                addNotification('Payment Cancelled', 'Unlock Elite Forge to access deep logic.', 'info');
            }
        });
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-12 animate-slide-in">
            {/* Elite Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 bg-axp-gold/10 border border-axp-gold/30 px-4 py-1.5 rounded-full mb-2">
                    <Lock className="w-3.5 h-3.5 text-axp-gold" />
                    <span className="text-[10px] font-black text-axp-gold uppercase tracking-[2px]">Premium Service</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white uppercase italic">
                    Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-axp-gold via-white to-axp-gold animate-shimmer">Sensitivity Audit</span>
                </h1>
                <p className="text-gray-400 text-sm font-medium max-w-lg mx-auto italic">
                    Unlock deep-level hardware analysis powered by exact chipset frame-times and input latency values.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Deep Tech Inputs */}
                <div className="md:col-span-2 space-y-6">
                    <Card glass className="border-axp-gold/20 relative overflow-hidden">
                        <div className="scanline opacity-[0.02]"></div>
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <Cpu className="w-5 h-5 text-axp-gold" />
                                <h2 className="font-black text-white uppercase tracking-widest text-xs">Hardware Signature</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-gray-800/50">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Screen PPI (Size)</label>
                                    <select
                                        value={formData.screenSize || '6.1'}
                                        onChange={(e) => setFormData({ ...formData, screenSize: parseFloat(e.target.value) })}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-axp-gold transition-colors appearance-none"
                                    >
                                        <option value="5.5">5.5" (Super PPI)</option>
                                        <option value="6.1">6.1" (Standard)</option>
                                        <option value="6.7">6.7" (Phablet)</option>
                                        <option value="12.9">iPad Pro / Large Tablet</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex justify-between">
                                        Current Base Sens <span>{formData.currentSens || 100}</span>
                                    </label>
                                    <input
                                        type="range" min="0" max="200" step="1"
                                        value={formData.currentSens || 100}
                                        onChange={(e) => setFormData({ ...formData, currentSens: parseInt(e.target.value) })}
                                        className="w-full accent-axp-gold bg-gray-800 rounded-lg h-2"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex justify-between">
                                        Device DPI <span>{formData.dpi} DPI</span>
                                    </label>
                                    <input
                                        type="range" min="100" max="1200" step="10"
                                        value={formData.dpi}
                                        onChange={(e) => setFormData({ ...formData, dpi: parseInt(e.target.value) })}
                                        className="w-full accent-axp-gold bg-gray-800 rounded-lg h-2"
                                    />
                                    <div className="flex justify-between text-[8px] text-gray-600 font-bold uppercase">
                                        <span>Standard</span>
                                        <span>Gaming</span>
                                        <span>Extreme</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex justify-between">
                                        Network Ping <span>{formData.ping}ms</span>
                                    </label>
                                    <input
                                        type="range" min="1" max="150" step="1"
                                        value={formData.ping}
                                        onChange={(e) => setFormData({ ...formData, ping: parseInt(e.target.value) })}
                                        className="w-full accent-axp-gold bg-gray-800 rounded-lg h-2"
                                    />
                                    <div className="flex justify-between text-[8px] text-gray-600 font-bold uppercase">
                                        <span>Fiber</span>
                                        <span>Average</span>
                                        <span>High Lag</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Select Processor Tier</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {chipsetTiers.map(tier => (
                                        <button
                                            key={tier.id}
                                            onClick={() => setFormData({ ...formData, chipset: tier.id })}
                                            className={cn(
                                                "flex items-center justify-between p-3 rounded-xl border text-left transition-all",
                                                formData.chipset === tier.id
                                                    ? "bg-axp-gold/10 border-axp-gold ring-1 ring-axp-gold"
                                                    : "bg-gray-800/50 border-gray-700 hover:border-gray-600"
                                            )}
                                        >
                                            <div>
                                                <div className="text-xs font-black text-white uppercase">{tier.id} — {tier.label}</div>
                                                <div className="text-[8px] text-gray-500 font-bold uppercase mt-0.5">{tier.desc}</div>
                                            </div>
                                            {formData.chipset === tier.id && <Zap className="w-4 h-4 text-axp-gold fill-axp-gold" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* 2. Checkout Sidebar */}
                <div className="space-y-6">
                    <Card glass className="border-axp-gold/40 flex flex-col justify-between h-full bg-gradient-to-b from-axp-gold/5 via-transparent to-transparent">
                        <div className="space-y-6">
                            <div className="text-center space-y-1">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Audit Price</span>
                                <div className="text-4xl font-black text-white italic tracking-tighter">$0.99</div>
                            </div>

                            <ul className="space-y-4">
                                {[
                                    { icon: ShieldCheck, text: "Recoil Mastery Curve" },
                                    { icon: Target, text: "Ping Compensation Logic" },
                                    { icon: MousePointer2, text: "Exact DPI Mapping" },
                                    { icon: Zap, text: "Elite Badge Earned" }
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <item.icon className="w-4 h-4 text-axp-gold" />
                                        {item.text}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-8 space-y-4">
                            <Button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className="w-full bg-axp-gold hover:bg-white text-gray-900 font-black h-16 uppercase italic tracking-[2px] transition-all"
                            >
                                {isProcessing ? 'Verifying...' : 'Unlock Audit'}
                            </Button>
                            <div className="flex items-center justify-center gap-2 opacity-30 grayscale">
                                <CreditCard className="w-4 h-4 text-white" />
                                <span className="text-[8px] font-bold text-white uppercase italic">Secured by Paystack</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
