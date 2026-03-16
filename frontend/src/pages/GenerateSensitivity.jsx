import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BRANDS, DEVICE_DB } from '../utils/devices';
import { Cpu, Smartphone, MousePointer2, Zap, Target, Crown, ChevronRight, Activity, Fingerprint, BarChart3, Layers, Sliders, Crosshair, Gauge, Sparkles } from 'lucide-react';
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
        { id: 'Rusher', label: 'Aggressive', desc: 'High response for close-quarters combat.', icon: Zap, color: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/20' },
        { id: 'Balanced', label: 'Balanced', desc: 'Optimal stability for all scenarios.', icon: Gauge, color: 'text-primary', bgColor: 'bg-primary/10', borderColor: 'border-primary/20' },
        { id: 'Sniper', label: 'Precision', desc: 'Micro-adjustments for long range.', icon: Crosshair, color: 'text-rose-400', bgColor: 'bg-rose-500/10', borderColor: 'border-rose-500/20' },
        { id: 'Tactical', label: 'Tactical', desc: 'Versatile profile for pros.', icon: Target, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/20' },
    ];

    const handTypes = ['Two Fingers', 'Three Fingers', 'Four Fingers', 'Five Fingers'];

    const handleGenerate = () => {
        navigate('/generating', { state: { formData } });
    };

    const isFormValid = formData.brand && formData.series && formData.model && formData.ram;

    return (
        <div className="space-y-8 pb-24 animate-fade-in">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-3xl card-gaming">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent-cyan/5" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-cyan/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                
                {/* Decorative Icon */}
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none select-none">
                    <BarChart3 className="w-80 h-80" />
                </div>
                
                <div className="relative p-8 md:p-12 space-y-6">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 w-fit backdrop-blur-sm">
                        <Activity className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-xs font-bold text-primary uppercase tracking-widest">AI Calibration Engine v5.0</span>
                    </div>
                    
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight">
                            <span className="text-white">Sensitivity</span>
                            <br />
                            <span className="text-gradient">Calibration</span>
                        </h1>
                        <p className="text-slate-400 text-sm md:text-base max-w-xl leading-relaxed">
                            Configure your hardware profile and gameplay style. Our AI engine will generate 
                            the optimal sensitivity coefficients for your specific setup.
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex flex-wrap gap-6 pt-4">
                        {[
                            { label: 'Devices Supported', value: '2,500+' },
                            { label: 'Profiles Generated', value: '1.2M+' },
                            { label: 'Accuracy Rate', value: '99.7%' },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-2xl font-display font-bold text-white">{stat.value}</div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Premium Upgrade Banner */}
            <div className="relative group cursor-pointer" onClick={() => navigate('/submit')}>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/30 to-yellow-500/30 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl card-gaming border-amber-500/20 hover:border-amber-500/40 transition-all">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-amber-500/20 rounded-2xl blur-xl animate-pulse" />
                            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30 flex items-center justify-center">
                                <Crown className="w-8 h-8 text-amber-400" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-display font-bold text-white text-lg tracking-tight">Pro Configuration Audit</h3>
                            <p className="text-xs text-slate-500 font-medium mt-1">Advanced Chipset Analysis & Recoil Compensation</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-2xl font-display font-bold text-gradient-gold">$0.99</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest">One-time</div>
                        </div>
                        <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-xs uppercase tracking-widest hover:from-amber-400 hover:to-yellow-400 transition-all shadow-glow-amber">
                            Upgrade
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Hardware Profile Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 ml-1">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <Smartphone className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">Hardware Profile</h3>
                    </div>
                    
                    <Card className="p-8 space-y-6 card-gaming">
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block ml-1">Manufacturer</label>
                            <select
                                value={formData.brand}
                                onChange={(e) => setFormData({ ...formData, brand: e.target.value, series: '', model: '', ram: '' })}
                                className="w-full bg-surface-elevated/80 border border-white/[0.08] rounded-xl p-4 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all appearance-none cursor-pointer hover:border-white/20"
                            >
                                <option value="">Select Brand</option>
                                {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block ml-1">Device Series</label>
                            <select
                                value={formData.series}
                                onChange={(e) => setFormData({ ...formData, series: e.target.value, model: '', ram: '' })}
                                disabled={!formData.brand}
                                className="w-full bg-surface-elevated/80 border border-white/[0.08] rounded-xl p-4 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all appearance-none cursor-pointer hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <option value="">Select Series</option>
                                {allSeries.map(s => <option key={s} value={s}>{s}</option>)}
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block ml-1">Device Model</label>
                            <select
                                value={formData.model}
                                onChange={(e) => setFormData({ ...formData, model: e.target.value, ram: '' })}
                                disabled={!formData.series}
                                className="w-full bg-surface-elevated/80 border border-white/[0.08] rounded-xl p-4 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all appearance-none cursor-pointer hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <option value="">Select Model</option>
                                {models.map(m => <option key={m.model} value={m.model}>{m.model}</option>)}
                                <option value="Other / Generic">Other / Generic</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block ml-1">System Memory (RAM)</label>
                            <div className="grid grid-cols-4 gap-3">
                                {(formData.model && formData.model !== "Other / Generic" 
                                    ? models.find(m => m.model === formData.model)?.ram || [4, 6, 8, 12]
                                    : [3, 4, 6, 8, 12, 16]
                                ).map(r => (
                                    <button
                                        key={r}
                                        onClick={() => setFormData({ ...formData, ram: r })}
                                        className={cn(
                                            "py-3 rounded-xl border text-sm font-bold transition-all",
                                            formData.ram === r 
                                                ? "bg-primary text-white border-primary shadow-glow-sm" 
                                                : "bg-surface-elevated/60 border-white/[0.06] text-slate-400 hover:border-white/20 hover:text-white"
                                        )}
                                    >
                                        {r}GB
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Input Calibration Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 ml-1">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <MousePointer2 className="w-4 h-4 text-emerald-400" />
                        </div>
                        <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">Input Calibration</h3>
                    </div>

                    <Card className="p-8 space-y-8 card-gaming">
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block ml-1">Control Layout</label>
                            <div className="grid grid-cols-2 gap-3">
                                {handTypes.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setFormData({ ...formData, handType: type })}
                                        className={cn(
                                            "p-4 rounded-xl border text-xs font-bold uppercase transition-all tracking-wider",
                                            formData.handType === type
                                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-lg"
                                                : "bg-surface-elevated/60 border-white/[0.06] text-slate-400 hover:border-white/20 hover:text-white"
                                        )}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6 pt-2">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Screen Size</label>
                                    <span className="text-sm font-display font-bold text-white">{formData.screenSize}"</span>
                                </div>
                                <div className="relative">
                                    <input
                                        type="range" min="4.7" max="12.9" step="0.1"
                                        value={formData.screenSize}
                                        onChange={(e) => setFormData({ ...formData, screenSize: parseFloat(e.target.value) })}
                                        className="w-full h-2 bg-surface-elevated rounded-full appearance-none cursor-pointer"
                                    />
                                    <div 
                                        className="absolute top-0 left-0 h-2 bg-gradient-to-r from-primary to-accent-cyan rounded-full pointer-events-none"
                                        style={{ width: `${((formData.screenSize - 4.7) / (12.9 - 4.7)) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Sensitivity</label>
                                    <span className="text-sm font-display font-bold text-white">{formData.currentSens}</span>
                                </div>
                                <div className="relative">
                                    <input
                                        type="range" min="0" max="200" step="1"
                                        value={formData.currentSens}
                                        onChange={(e) => setFormData({ ...formData, currentSens: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-surface-elevated rounded-full appearance-none cursor-pointer"
                                    />
                                    <div 
                                        className="absolute top-0 left-0 h-2 bg-gradient-to-r from-primary to-accent-cyan rounded-full pointer-events-none"
                                        style={{ width: `${(formData.currentSens / 200) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Operational Profiles */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 ml-1">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                        <Layers className="w-4 h-4 text-purple-400" />
                    </div>
                    <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">Play Style Profile</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {playStyles.map(style => (
                        <button
                            key={style.id}
                            onClick={() => setFormData({ ...formData, playStyle: style.id })}
                            className={cn(
                                "relative p-6 rounded-2xl border transition-all text-left flex flex-col justify-between min-h-[180px] group overflow-hidden",
                                formData.playStyle === style.id
                                    ? `card-gaming ${style.borderColor} border-2`
                                    : "card-gaming hover:border-white/20"
                            )}
                        >
                            {formData.playStyle === style.id && (
                                <div className={cn("absolute inset-0 opacity-20", style.bgColor)} />
                            )}
                            
                            <div className={cn(
                                "relative w-12 h-12 rounded-xl flex items-center justify-center transition-all border",
                                formData.playStyle === style.id 
                                    ? `${style.bgColor} ${style.borderColor}` 
                                    : "bg-surface-elevated border-white/[0.06]"
                            )}>
                                <style.icon className={cn("w-6 h-6 transition-colors", formData.playStyle === style.id ? style.color : "text-slate-500")} />
                            </div>
                            
                            <div className="relative mt-auto">
                                <h3 className={cn(
                                    "text-base font-display font-bold tracking-tight mb-1",
                                    formData.playStyle === style.id ? "text-white" : "text-slate-300"
                                )}>{style.label}</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">{style.desc}</p>
                            </div>

                            {formData.playStyle === style.id && (
                                <div className={cn("absolute top-4 right-4 w-3 h-3 rounded-full", style.bgColor.replace('/10', ''))}>
                                    <div className={cn("absolute inset-0 rounded-full animate-ping", style.bgColor)} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Generate Button */}
            <div className="pt-8">
                <button
                    disabled={!isFormValid}
                    onClick={handleGenerate}
                    className={cn(
                        "relative w-full py-6 rounded-2xl font-display font-bold text-sm uppercase tracking-[0.2em] transition-all overflow-hidden group",
                        isFormValid 
                            ? "bg-gradient-to-r from-primary to-accent-cyan text-white shadow-glow-md hover:shadow-glow-lg" 
                            : "bg-surface-elevated text-slate-600 cursor-not-allowed"
                    )}
                >
                    {isFormValid && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    )}
                    <span className="relative flex items-center justify-center gap-3">
                        <Sparkles className="w-5 h-5" />
                        Run Performance Analysis
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                </button>
            </div>
        </div>
    );
}
