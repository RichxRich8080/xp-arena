import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BRANDS, DEVICE_DB } from '../utils/devices';
import { Cpu, Smartphone, MousePointer2, Zap, Target, Crown, ChevronRight, Activity, Fingerprint, BarChart3, Layers, Sliders } from 'lucide-react';
import { cn } from '../utils/cn';

export default function GenerateSensitivity() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        brand: '',
        series: '',
        model: '',
        ram: '',
        handType: 'Two Fingers',
        playStyle: 'Balanced',
        screenSize: 6.1,
        currentSens: 100
    });

    const allSeries = formData.brand ? Object.keys(DEVICE_DB[formData.brand] || {}) : [];
    const models = (formData.brand && formData.series) ? (DEVICE_DB[formData.brand][formData.series] || []) : [];

    const playStyles = [
        { id: 'Rusher', label: 'Aggressive', desc: 'High response for close-quarters.', icon: Zap, color: 'text-amber-500' },
        { id: 'Balanced', label: 'Balanced', desc: 'Optimal stability for general use.', icon: Smartphone, color: 'text-blue-500' },
        { id: 'Sniper', label: 'Precision', desc: 'Micro-adjustment focus for long range.', icon: Target, color: 'text-red-500' },
        { id: 'Tactical', label: 'Tactical', desc: 'Versatile profile for all scenarios.', icon: Sliders, color: 'text-emerald-500' },
    ];

    const handTypes = ['Two Fingers', 'Three Fingers', 'Four Fingers', 'Five Fingers'];

    const handleGenerate = () => {
        navigate('/generating', { state: { formData } });
    };

    const isFormValid = formData.brand && formData.series && formData.model && formData.ram;

    return (
        <div className="space-y-8 pb-12 animate-fade-in">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-white/5 shadow-sm">
                <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none select-none">
                    <BarChart3 className="w-64 h-64" />
                </div>
                
                <div className="relative p-8 md:p-12 space-y-6">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit">
                        <Activity className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Calibration Engine v4.5</span>
                    </div>
                    
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                            Sensitivity <span className="text-primary">Calibration</span>
                        </h1>
                        <p className="text-slate-400 text-sm md:text-base max-w-xl leading-relaxed font-medium">
                            Configure your hardware profile and gameplay style. Our AI analysis will generate the optimal sensitivity coefficients for your specific setup.
                        </p>
                    </div>
                </div>
            </div>

            {/* Premium Upgrade Promo */}
            <div className="relative group cursor-pointer" onClick={() => navigate('/submit')}>
                <div className="absolute -inset-0.5 bg-primary/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                <Card className="relative p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-white/5 bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Crown className="w-7 h-7 text-amber-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white tracking-tight">Configuration Audit Program</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Advanced Chipset Analysis & Recoil Compensation</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-900 px-4 py-2 rounded-xl border border-white/5">
                        <span className="font-bold text-amber-500 text-lg">$0.99</span>
                        <div className="bg-amber-500 text-slate-900 px-6 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-colors">Upgrade Plan</div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. Hardware Diagnostic */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-500 tracking-[0.2em] uppercase flex items-center gap-2 ml-1">
                        <Smartphone className="w-4 h-4 text-primary" />
                        Hardware Profile
                    </h3>
                    
                    <Card className="p-8 space-y-6 border-white/5 bg-slate-900/50">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block ml-1">Manufacturer</label>
                            <select
                                value={formData.brand}
                                onChange={(e) => setFormData({ ...formData, brand: e.target.value, series: '', model: '', ram: '' })}
                                className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary outline-none transition-all appearance-none"
                            >
                                <option value="">Select Brand</option>
                                {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block ml-1">Device Series</label>
                            <select
                                value={formData.series}
                                onChange={(e) => setFormData({ ...formData, series: e.target.value, model: '', ram: '' })}
                                disabled={!formData.brand}
                                className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary outline-none transition-all appearance-none disabled:opacity-30"
                            >
                                <option value="">Select Series</option>
                                {allSeries.map(s => <option key={s} value={s}>{s}</option>)}
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block ml-1">Device Model</label>
                            <select
                                value={formData.model}
                                onChange={(e) => setFormData({ ...formData, model: e.target.value, ram: '' })}
                                disabled={!formData.series}
                                className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary outline-none transition-all appearance-none disabled:opacity-30"
                            >
                                <option value="">Select Model</option>
                                {models.map(m => <option key={m.model} value={m.model}>{m.model}</option>)}
                                <option value="Other / Generic">Other / Generic</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block ml-1">System Memory (RAM)</label>
                            <div className="grid grid-cols-4 gap-2">
                                {(formData.model && formData.model !== "Other / Generic" 
                                    ? models.find(m => m.model === formData.model)?.ram || [4, 6, 8, 12]
                                    : [3, 4, 6, 8, 12, 16]
                                ).map(r => (
                                    <button
                                        key={r}
                                        onClick={() => setFormData({ ...formData, ram: r })}
                                        className={cn(
                                            "py-2.5 rounded-lg border text-[10px] font-bold transition-all",
                                            formData.ram === r 
                                                ? "bg-primary text-white border-primary shadow-lg" 
                                                : "bg-slate-800/50 border-white/5 text-slate-500 hover:border-white/20"
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
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-500 tracking-[0.2em] uppercase flex items-center gap-2 ml-1">
                        <MousePointer2 className="w-4 h-4 text-emerald-500" />
                        Input Calibration
                    </h3>

                    <Card className="p-8 space-y-8 border-white/5 bg-slate-900/50">
                        <div className="grid grid-cols-2 gap-2">
                            {handTypes.map(type => (
                                <button
                                    key={type}
                                    onClick={() => setFormData({ ...formData, handType: type })}
                                    className={cn(
                                        "p-3 rounded-lg border text-[10px] font-bold uppercase transition-all tracking-wider",
                                        formData.handType === type
                                            ? "bg-emerald-500 text-white border-emerald-500 shadow-lg"
                                            : "bg-slate-800/50 border-white/5 text-slate-500 hover:border-white/20"
                                    )}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-6 pt-2">
                            <div className="space-y-4">
                                <div className="flex justify-between items-end px-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Screen Size</label>
                                    <span className="text-xs font-bold text-white">{formData.screenSize}" Inch</span>
                                </div>
                                <input
                                    type="range" min="4.7" max="12.9" step="0.1"
                                    value={formData.screenSize}
                                    onChange={(e) => setFormData({ ...formData, screenSize: parseFloat(e.target.value) })}
                                    className="w-full accent-primary bg-slate-800 rounded-full h-1.5 cursor-pointer"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-end px-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Target Sensitivity</label>
                                    <span className="text-xs font-bold text-white">{formData.currentSens} Units</span>
                                </div>
                                <input
                                    type="range" min="0" max="200" step="1"
                                    value={formData.currentSens}
                                    onChange={(e) => setFormData({ ...formData, currentSens: parseInt(e.target.value) })}
                                    className="w-full accent-primary bg-slate-800 rounded-full h-1.5 cursor-pointer"
                                />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* 3. Operational Profiles */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 tracking-[0.2em] uppercase flex items-center gap-2 ml-1">
                    <Layers className="w-4 h-4 text-purple-500" />
                    Operational Profile
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {playStyles.map(style => (
                        <button
                            key={style.id}
                            onClick={() => setFormData({ ...formData, playStyle: style.id })}
                            className={cn(
                                "p-6 rounded-2xl border transition-all text-left flex flex-col justify-between h-40 group",
                                formData.playStyle === style.id
                                    ? "bg-slate-800/80 border-primary shadow-xl ring-1 ring-primary/20"
                                    : "bg-slate-900/50 border-white/5 hover:border-white/10"
                            )}
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center transition-all border border-white/5",
                                formData.playStyle === style.id ? "bg-primary/20 border-primary/40 shadow-sm" : "bg-slate-800"
                            )}>
                                <style.icon className={cn("w-5 h-5", formData.playStyle === style.id ? style.color : "text-slate-500")} />
                            </div>
                            
                            <div>
                                <h3 className={cn(
                                    "text-sm font-bold tracking-tight mb-1",
                                    formData.playStyle === style.id ? "text-white" : "text-slate-500"
                                )}>{style.label}</h3>
                                <p className="text-[10px] text-slate-500 font-medium leading-tight">{style.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Start Button */}
            <div className="pt-8">
                <Button
                    variant="primary"
                    className="w-full py-8 text-sm font-bold uppercase tracking-[0.3em] disabled:opacity-30 group relative overflow-hidden rounded-2xl"
                    disabled={!isFormValid}
                    onClick={handleGenerate}
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        Run Performance Analysis <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                </Button>
            </div>
        </div>
    );
}
