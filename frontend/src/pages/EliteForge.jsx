import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Target, Zap, Cpu, Wifi, MousePointer2, Lock, ShieldCheck, CreditCard, Crown, ChevronRight, Activity } from 'lucide-react';
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
        { id: 'S-Tier', label: 'SNAPDRAGON_8_GEN_2/3 / A17_PRO', desc: 'ULTRA_HIGH_PERFORMANCE_NODE' },
        { id: 'A-Tier', label: 'SNAPDRAGON_870/888 / A15', desc: 'PREMIUM_CALIBRATION_SPEC' },
        { id: 'B-Tier', label: 'HELIO_G99 / DIMENSITY_7000', desc: 'MID_RANGE_NEURAL_LINK' },
        { id: 'C-Tier', label: 'SNAPDRAGON_680 / HELIO_G85', desc: 'ENTRY_LEVEL_TERMINAL' }
    ];

    const handlePayment = () => {
        setIsProcessing(true);

        initializePaystack({
            email: user?.email || 'guest@xparena.com',
            amount: 100000, 
            metadata: {
                custom_fields: [
                    { display_name: "Feature", variable_name: "feature", value: "Elite Sensitivity Audit" },
                    { display_name: "User ID", variable_name: "user_id", value: user?._id }
                ]
            },
            onSuccess: (response) => {
                setIsProcessing(false);
                addNotification('Payment Verified', 'Elite Neural Port Unlocked.', 'success');
                navigate('/elite-result', { state: { formData, reference: response.reference } });
            },
            onClose: () => {
                setIsProcessing(false);
                addNotification('Uplink Terminated', 'Premium access requires credential verification.', 'info');
            }
        });
    };

    return (
        <div className="space-y-12 pb-20 animate-slide-in font-display">
            {/* Premium Header */}
            <div className="relative group overflow-hidden glass-panel p-10 md:p-16 border-axp-gold/20 bg-axp-gold/[0.02]">
                <div className="absolute top-0 right-0 p-12 opacity-[0.05] font-black text-9xl italic select-none pointer-events-none uppercase text-axp-gold">
                    ULTRA
                </div>
                
                <div className="relative z-10 space-y-8">
                    <div className="inline-flex items-center gap-3 bg-axp-gold/10 border border-axp-gold/30 px-6 py-2 rounded-full">
                        <Crown className="w-4 h-4 text-axp-gold animate-pulse" />
                        <span className="text-[10px] font-black text-axp-gold uppercase tracking-[0.3em] italic">ELITE_NEURAL_PROTOCOL</span>
                    </div>
                    
                    <div>
                        <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">
                            SENSITIVITY <span className="text-axp-gold">AUDIT</span>
                        </h1>
                        <p className="text-gray-400 font-bold text-sm mt-6 max-w-2xl leading-relaxed uppercase tracking-tighter italic">
                            Initialize a high-fidelity audit of your terminal signature. This premium protocol factors in exact chipset frame-times, display polling rates, and network latency jitter.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 1. Deep Tech Specs (Left) */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center gap-3 ml-4">
                        <Activity className="w-4 h-4 text-axp-gold" />
                        <h3 className="text-[10px] font-black text-white tracking-[0.3em] uppercase italic">HARDWARE_PRECISION_INPUTS</h3>
                    </div>

                    <Card className="p-10 space-y-12 border-axp-gold/10 bg-white/[0.01]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* DPI and Ping */}
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end px-1">
                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">DISPLAY_DPI_RESOLUTION</label>
                                        <span className="text-sm font-black text-axp-gold italic">{formData.dpi} DPI</span>
                                    </div>
                                    <input
                                        type="range" min="100" max="1200" step="10"
                                        value={formData.dpi}
                                        onChange={(e) => setFormData({ ...formData, dpi: parseInt(e.target.value) })}
                                        className="w-full accent-axp-gold bg-white/5 rounded-full h-1.5"
                                    />
                                    <div className="flex justify-between text-[7px] text-gray-600 font-black uppercase tracking-widest">
                                        <span>RETINA_CLASS</span>
                                        <span>ULTRA_CLASS</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-end px-1">
                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">UPLINK_JITTER (PING)</label>
                                        <span className="text-sm font-black text-accent-cyan italic">{formData.ping}MS</span>
                                    </div>
                                    <input
                                        type="range" min="1" max="150" step="1"
                                        value={formData.ping}
                                        onChange={(e) => setFormData({ ...formData, ping: parseInt(e.target.value) })}
                                        className="w-full accent-accent-cyan bg-white/5 rounded-full h-1.5"
                                    />
                                    <div className="flex justify-between text-[7px] text-gray-600 font-black uppercase tracking-widest">
                                        <span>FIBER_PATH</span>
                                        <span>MOBILE_NODE</span>
                                    </div>
                                </div>
                            </div>

                            {/* Base Sens and PPI */}
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end px-1">
                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">NEURAL_COEFFICIENT_BASE</label>
                                        <span className="text-sm font-black text-white italic">{formData.currentSens} PNT</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="200" step="1"
                                        value={formData.currentSens}
                                        onChange={(e) => setFormData({ ...formData, currentSens: parseInt(e.target.value) })}
                                        className="w-full accent-white bg-white/5 rounded-full h-1.5"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] block ml-1">TERMINAL_DIMENSION</label>
                                    <select
                                        value={formData.screenSize}
                                        onChange={(e) => setFormData({ ...formData, screenSize: parseFloat(e.target.value) })}
                                        className="w-full bg-background border border-white/10 rounded-2xl p-4 font-black text-sm text-white focus:outline-none focus:border-axp-gold transition-all appearance-none italic uppercase"
                                    >
                                        <option value="5.5">5.5" (SUPER_RETINA)</option>
                                        <option value="6.1">6.1" (STANDARD_MATRIX)</option>
                                        <option value="6.7">6.7" (ULTRA_PHABLET)</option>
                                        <option value="12.9">iPad Pro / (WORKSTATION_GRADE)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Chipset Selection */}
                        <div className="space-y-6 pt-6 border-t border-white/5">
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] block ml-1">PROCESSOR_ARCHITECTURE_VERIFICATION</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {chipsetTiers.map(tier => (
                                    <button
                                        key={tier.id}
                                        onClick={() => setFormData({ ...formData, chipset: tier.id })}
                                        className={cn(
                                            "flex items-center justify-between p-6 rounded-2xl border text-left transition-all group/tier overflow-hidden relative",
                                            formData.chipset === tier.id
                                                ? "bg-axp-gold/5 border-axp-gold/50 shadow-[0_10px_30px_rgba(251,191,36,0.1)]"
                                                : "bg-background border-white/5 hover:border-white/20"
                                        )}
                                    >
                                        <div className="relative z-10 w-full flex justify-between items-center">
                                            <div>
                                                <div className={cn("text-xs font-black uppercase italic tracking-widest", formData.chipset === tier.id ? "text-white" : "text-gray-500")}>
                                                    {tier.id} — {tier.label}
                                                </div>
                                                <div className="text-[8px] text-gray-600 font-bold uppercase mt-1 tracking-widest group-hover/tier:text-gray-400 transition-colors">{tier.desc}</div>
                                            </div>
                                            {formData.chipset === tier.id && <Zap className="w-5 h-5 text-axp-gold fill-axp-gold/20" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* 2. Tactical Checkout (Right) */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="flex items-center gap-3 ml-4">
                        <Lock className="w-4 h-4 text-axp-gold" />
                        <h3 className="text-[10px] font-black text-white tracking-[0.3em] uppercase italic">SECURE_GATEWAY</h3>
                    </div>

                    <Card className="p-10 border-axp-gold/30 bg-axp-gold/[0.03] relative overflow-hidden h-full flex flex-col justify-between">
                        <div className="absolute top-0 left-0 w-24 h-24 bg-axp-gold/10 blur-3xl -translate-x-1/2 -translate-y-1/2" />
                        
                        <div className="space-y-10 relative z-10">
                            <div className="text-center space-y-2">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">ALLOCATION_COST</span>
                                <div className="text-6xl font-black text-white italic tracking-tighter">
                                    $0.99
                                </div>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { icon: Target, text: "RECOIL_MASTERY_CURVE" },
                                    { icon: Wifi, text: "PING_COMP_ALGORITHM" },
                                    { icon: MousePointer2, text: "DPI_MATRIX_MAPPING" },
                                    { icon: ShieldCheck, text: "ELITE_STATUS_VERIFIED" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] italic">
                                        <item.icon className="w-4 h-4 text-axp-gold" />
                                        {item.text}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6 pt-12 relative z-10">
                            <Button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className="w-full bg-axp-gold hover:bg-white text-background font-black h-20 uppercase italic tracking-[0.4em] text-[11px] shadow-[0_20px_40px_rgba(251,191,36,0.15)] transition-all"
                            >
                                {isProcessing ? 'SYNCHRONIZING...' : 'INITIALIZE_AUDIT'}
                            </Button>
                            
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex items-center gap-3 opacity-30 grayscale brightness-200">
                                    <CreditCard className="w-4 h-4 text-white" />
                                    <span className="text-[8px] font-black text-white uppercase italic tracking-widest">GATEWAY_ENCRYPTION_BY_PAYSTACK</span>
                                </div>
                                <div className="h-1px w-20 bg-white/5" />
                                <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest text-center px-4 leading-relaxed italic">
                                    SINGLE_ACCESS_CREDENTIAL. NON-TRANSFERABLE NEURAL DATA.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
