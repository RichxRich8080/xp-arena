import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BRANDS, DEVICE_DB } from '../utils/devices';
import { Cpu, Smartphone, MousePointer2, Zap, Target, Crown, ChevronRight, Activity, Fingerprint } from 'lucide-react';
import { cn } from '../utils/cn';

export default function GenerateSensitivity() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        ram: '',
        handType: 'Two Fingers',
        playStyle: 'Balanced',
        screenSize: 6.1,
        currentSens: 100
    });

    const models = formData.brand ? (DEVICE_DB[formData.brand] || []) : [];

    const playStyles = [
        { id: 'Rusher', label: 'ENTRY_FRAGGER', desc: 'High kinetic, low latency response.', icon: Zap, color: 'text-accent-cyan' },
        { id: 'Balanced', label: 'STRATEGIC', desc: 'Optimal stability across all axis.', icon: Smartphone, color: 'text-accent-green' },
        { id: 'Sniper', label: 'PRECISION_LONG', desc: 'Micro-adjustment precision tuning.', icon: Target, color: 'text-accent-rose' },
        { id: 'Aggressive', label: 'VANGUARD', desc: 'Maximum pressure, rapid repositioning.', icon: Cpu, color: 'text-axp-gold' },
    ];

    const handTypes = ['Two Fingers', 'Three Fingers', 'Four Fingers', 'Five Fingers'];

    const handleGenerate = () => {
        navigate('/generating', { state: { formData } });
    };

    const isFormValid = formData.brand && formData.model && formData.ram;

    return (
        <div className="space-y-12 pb-20 animate-slide-in">
            {/* Header Section */}
            <div className="relative group overflow-hidden glass-panel p-8 md:p-12 border-white/5">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] font-display font-black text-8xl italic select-none pointer-events-none uppercase text-accent-cyan">
                    FORGE_INIT
                </div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <Activity className="w-5 h-5 text-accent-cyan animate-pulse" />
                        <h2 className="text-xs font-display font-black text-gray-500 uppercase tracking-[0.3em]">Neural_Simulation_Lab</h2>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-black text-white italic tracking-tighter uppercase leading-none">
                        AI <span className="text-accent-cyan">FORGE</span>
                    </h1>
                    <p className="text-gray-400 font-display font-bold text-sm mt-6 max-w-xl">
                        Calibrate your neural interface based on hardware signatures and combat protocols. Our AI engine calculates the optimal coefficients for your mobile terminal.
                    </p>
                </div>
            </div>

            {/* Audit Promo */}
            <div className="relative group cursor-pointer" onClick={() => navigate('/submit')}>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-axp-gold/50 to-transparent rounded-3xl blur opacity-20 group-hover:opacity-40 transition" />
                <Card className="relative bg-axp-gold/[0.03] border-axp-gold/20 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-axp-gold/10 blur-3xl -translate-x-1/2 -translate-y-1/2" />
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-axp-gold/10 border border-axp-gold/20 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.15)] group-hover:scale-110 transition-transform">
                            <Crown className="w-8 h-8 text-axp-gold fill-axp-gold/10" />
                        </div>
                        <div>
                            <h3 className="font-display font-black text-white text-sm uppercase tracking-[0.2em] group-hover:text-axp-gold transition-colors italic">COMMUNITY_AUDIT_PROGRAM</h3>
                            <p className="text-[10px] text-gray-500 font-display font-black uppercase tracking-widest mt-1">DPI ANALYSIS + CHIPSET COMPENSATION + RECOIL_ALGORITHMS</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 relative z-10 bg-white/5 p-3 rounded-2xl border border-white/5">
                        <span className="font-display font-black text-axp-gold text-lg italic">$0.99</span>
                        <div className="bg-axp-gold text-background px-6 py-3 rounded-xl font-display font-black text-[10px] uppercase tracking-widest group-hover:bg-white transition-colors">INITIATE_UPGRADE</div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. Hardware Diagnostic */}
                <div className="space-y-6">
                    <h3 className="font-display font-black text-white text-xs tracking-[0.2em] uppercase flex items-center gap-3 ml-4">
                        <Fingerprint className="w-4 h-4 text-accent-cyan" />
                        HARDWARE_DIAGNOSTIC
                    </h3>
                    
                    <Card className="p-8 space-y-8 border-white/5 bg-white/[0.02]">
                        <div className="space-y-4">
                            <label className="text-[9px] font-display font-black text-gray-500 uppercase tracking-[0.3em] block ml-1">TERMINAL_MANUFACTURER</label>
                            <select
                                value={formData.brand}
                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                className="w-full bg-background border border-white/10 rounded-2xl p-4 font-display font-black text-sm text-white focus:outline-none focus:border-accent-cyan transition-all appearance-none italic"
                            >
                                <option value="">SELECT_BRAND</option>
                                {BRANDS.map(b => <option key={b} value={b}>{b.toUpperCase()}</option>)}
                            </select>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[9px] font-display font-black text-gray-500 uppercase tracking-[0.3em] block ml-1">MODEL_SPECIFICATION</label>
                            <select
                                value={formData.model}
                                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                disabled={!formData.brand}
                                className="w-full bg-background border border-white/10 rounded-2xl p-4 font-display font-black text-sm text-white focus:outline-none focus:border-accent-cyan transition-all appearance-none disabled:opacity-20 italic"
                            >
                                <option value="">SELECT_MODEL</option>
                                {models.map(m => <option key={m.model} value={m.model}>{m.model.toUpperCase()}</option>)}
                                <option value="Other / Generic">OTHER / GENERIC</option>
                            </select>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[9px] font-display font-black text-gray-500 uppercase tracking-[0.3em] block ml-1">MEMORY_CAPACITY</label>
                            <div className="grid grid-cols-4 gap-2">
                                {[4, 6, 8, 12].map(r => (
                                    <button
                                        key={r}
                                        onClick={() => setFormData({ ...formData, ram: r })}
                                        className={cn(
                                            "py-3 rounded-xl border font-display font-black text-[10px] transition-all italic",
                                            formData.ram === r 
                                                ? "bg-accent-cyan/10 border-accent-cyan text-accent-cyan" 
                                                : "bg-background border-white/5 text-gray-500 hover:border-white/20"
                                        )}
                                    >
                                        {r}GB
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* 2. Control Layout */}
                <div className="space-y-6">
                    <h3 className="font-display font-black text-white text-xs tracking-[0.2em] uppercase flex items-center gap-3 ml-4">
                        <MousePointer2 className="w-4 h-4 text-accent-green" />
                        KINETIC_CALIBRATION
                    </h3>

                    <Card className="p-8 space-y-8 border-white/5 bg-white/[0.02]">
                        <div className="grid grid-cols-2 gap-3">
                            {handTypes.map(type => (
                                <button
                                    key={type}
                                    onClick={() => setFormData({ ...formData, handType: type })}
                                    className={cn(
                                        "p-4 rounded-xl border font-display font-black text-[10px] uppercase transition-all tracking-widest italic",
                                        formData.handType === type
                                            ? "bg-accent-green/10 border-accent-green text-accent-green"
                                            : "bg-background border-white/5 text-gray-500 hover:border-white/20"
                                    )}
                                >
                                    {type.replace(' Fingers', '_F')}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-6 pt-2">
                            <div className="space-y-4">
                                <div className="flex justify-between items-end px-1">
                                    <label className="text-[9px] font-display font-black text-gray-500 uppercase tracking-[0.3em]">SCREEN_DIMENSION</label>
                                    <span className="text-xs font-display font-black text-white italic">{formData.screenSize}" INCH</span>
                                </div>
                                <input
                                    type="range" min="4.7" max="12.9" step="0.1"
                                    value={formData.screenSize}
                                    onChange={(e) => setFormData({ ...formData, screenSize: parseFloat(e.target.value) })}
                                    className="w-full accent-accent-green bg-white/5 rounded-full h-1.5"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-end px-1">
                                    <label className="text-[9px] font-display font-black text-gray-500 uppercase tracking-[0.3em]">CURRENT_COEFFICIENT</label>
                                    <span className="text-xs font-display font-black text-white italic">{formData.currentSens} PNT</span>
                                </div>
                                <input
                                    type="range" min="0" max="200" step="1"
                                    value={formData.currentSens}
                                    onChange={(e) => setFormData({ ...formData, currentSens: parseInt(e.target.value) })}
                                    className="w-full accent-accent-cyan bg-white/5 rounded-full h-1.5"
                                />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* 3. Combat Protocol */}
            <div className="space-y-6">
                <h3 className="font-display font-black text-white text-xs tracking-[0.2em] uppercase flex items-center gap-3 ml-4">
                    <Target className="w-4 h-4 text-axp-gold" />
                    COMBAT_PROTOCOL_OVERRIDE
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {playStyles.map(style => (
                        <button
                            key={style.id}
                            onClick={() => setFormData({ ...formData, playStyle: style.id })}
                            className={cn(
                                "relative group p-8 rounded-3xl border transition-all text-left overflow-hidden h-48 flex flex-col justify-between",
                                formData.playStyle === style.id
                                    ? "bg-white/[0.03] border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                                    : "bg-background border-white/5 hover:border-white/10"
                            )}
                        >
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all bg-white/5 border border-white/5 group-hover:border-white/10",
                                formData.playStyle === style.id && "bg-white/10 border-white/20"
                            )}>
                                <style.icon className={cn("w-6 h-6", formData.playStyle === style.id ? style.color : "text-gray-500")} />
                            </div>
                            
                            <div>
                                <h3 className={cn(
                                    "font-display font-black text-sm uppercase tracking-[0.2em] italic mb-1",
                                    formData.playStyle === style.id ? "text-white" : "text-gray-600"
                                )}>{style.label}</h3>
                                <p className="text-[9px] text-gray-500 font-display font-bold uppercase tracking-widest">{style.desc}</p>
                            </div>

                            {formData.playStyle === style.id && (
                                <div className="absolute top-4 right-4 animate-pulse">
                                    <div className={cn("w-2 h-2 rounded-full", style.color.replace('text-', 'bg-'))} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Initialize Button */}
            <div className="pt-8">
                <Button
                    variant="primary"
                    className="w-full py-8 uppercase tracking-[0.5em] font-display font-black text-xs italic disabled:opacity-20 group relative overflow-hidden"
                    disabled={!isFormValid}
                    onClick={handleGenerate}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan via-accent-green to-accent-cyan translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 opacity-20 pointer-events-none" />
                    <span className="relative z-10 flex items-center justify-center gap-4">
                        INITIALIZE_NEURAL_FORGE <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </span>
                </Button>
            </div>
        </div>
    );
}
