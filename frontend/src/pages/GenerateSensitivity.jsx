import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BRANDS, DEVICE_DB } from '../utils/devices';
import { Cpu, Smartphone, MousePointer2, Zap, Target, Crown } from 'lucide-react';
import { cn } from '../utils/cn';

export default function GenerateSensitivity() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        ram: '',
        handType: 'Two Fingers',
        playStyle: 'Balanced'
    });

    const models = formData.brand ? (DEVICE_DB[formData.brand] || []) : [];

    const playStyles = [
        { id: 'Rusher', label: 'RUSHER', desc: 'Fast entries, close combat', icon: Zap },
        { id: 'Balanced', label: 'BALANCED', desc: 'Versatile overall gameplay', icon: Smartphone },
        { id: 'Sniper', label: 'SNIPER', desc: 'Long range precision', icon: Target },
        { id: 'Aggressive', label: 'AGGRESSIVE', desc: 'High pressure performance', icon: Cpu },
    ];

    const handTypes = ['Two Fingers', 'Three Fingers', 'Four Fingers', 'Five Fingers'];

    const handleGenerate = () => {
        // Pass data to the generating page state
        navigate('/generating', { state: { formData } });
    };

    const isFormValid = formData.brand && formData.model && formData.ram;

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-12 animate-slide-in">
            {/* Header Section */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter text-white uppercase italic">
                    Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-primary-blue glow-cyan">Perfect Sensitivity</span>
                </h1>
                <p className="text-gray-400 text-sm font-medium">Professional optimization based on your hardware and style.</p>
            </div>

            {/* Elite Promo Banner */}
            <Card glass className="border-axp-gold/30 bg-axp-gold/5 flex flex-col md:flex-row items-center justify-between gap-4 p-4 md:p-6 group cursor-pointer hover:border-axp-gold transition-all" onClick={() => navigate('/elite-forge')}>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-axp-gold/20 flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.3)] group-hover:scale-110 transition-transform">
                        <Crown className="w-6 h-6 text-axp-gold fill-axp-gold/20" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest italic group-hover:text-axp-gold transition-colors">Elite Sensitivity Audit</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">Deep DPI & Chipset analysis with Recoil Tips</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-axp-gold italic">$0.99</span>
                    <div className="bg-axp-gold text-black px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest group-hover:bg-white transition-colors">Unlock Now</div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Device Selection */}
                <Card glass className="space-y-4 border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                        <Smartphone className="w-5 h-5 text-neon-cyan" />
                        <h2 className="font-bold text-gray-200 uppercase tracking-widest text-xs">Device Specs</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Brand</label>
                            <select
                                value={formData.brand}
                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-neon-cyan transition-colors appearance-none"
                            >
                                <option value="">Select Brand</option>
                                {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Model</label>
                            <select
                                value={formData.model}
                                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                disabled={!formData.brand}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-neon-cyan transition-colors appearance-none disabled:opacity-50"
                            >
                                <option value="">Select Model</option>
                                {models.map(m => <option key={m.model} value={m.model}>{m.model}</option>)}
                                <option value="Other / Generic">Other / Generic</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">RAM Size</label>
                            <select
                                value={formData.ram}
                                onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-neon-cyan transition-colors appearance-none"
                            >
                                <option value="">Select RAM</option>
                                {[2, 3, 4, 6, 8, 12, 16].map(r => <option key={r} value={r}>{r} GB</option>)}
                            </select>
                        </div>
                    </div>
                </Card>

                {/* 2. Control Setup */}
                <Card glass className="space-y-4 border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                        <MousePointer2 className="w-5 h-5 text-neon-green" />
                        <h2 className="font-bold text-gray-200 uppercase tracking-widest text-xs">Control Setup</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {handTypes.map(type => (
                            <button
                                key={type}
                                onClick={() => setFormData({ ...formData, handType: type })}
                                className={cn(
                                    "p-3 rounded-lg border text-[10px] font-black uppercase transition-all",
                                    formData.handType === type
                                        ? "bg-neon-green/10 border-neon-green text-neon-green shadow-[0_0_10px_rgba(34,197,94,0.2)]"
                                        : "bg-gray-800 border-gray-700 text-gray-500 hover:border-gray-600"
                                )}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4 pt-2 border-t border-gray-800/50">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex justify-between">
                                Screen Size <span>{formData.screenSize || '6.1'}"</span>
                            </label>
                            <select
                                value={formData.screenSize || '6.1'}
                                onChange={(e) => setFormData({ ...formData, screenSize: parseFloat(e.target.value) })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-neon-cyan transition-colors appearance-none"
                            >
                                <option value="5.5">5.5" (Compact)</option>
                                <option value="6.1">6.1" (Standard)</option>
                                <option value="6.7">6.7" (Max/Plus)</option>
                                <option value="11">Tablet / iPad</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex justify-between">
                                Current Sens <span>{formData.currentSens || '100'}</span>
                            </label>
                            <input
                                type="range" min="0" max="200" step="1"
                                value={formData.currentSens || 100}
                                onChange={(e) => setFormData({ ...formData, currentSens: parseInt(e.target.value) })}
                                className="w-full accent-neon-green bg-gray-800 rounded-lg h-2"
                            />
                        </div>
                    </div>
                </Card>
            </div>

            {/* 3. Play Style Selection (Full Width) */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pl-2">
                    <Target className="w-5 h-5 text-axp-gold" />
                    <h2 className="font-bold text-gray-200 uppercase tracking-widest text-xs">Battle Style</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {playStyles.map(style => (
                        <button
                            key={style.id}
                            onClick={() => setFormData({ ...formData, playStyle: style.id })}
                            className={cn(
                                "relative group p-4 rounded-2xl border transition-all text-left overflow-hidden",
                                formData.playStyle === style.id
                                    ? "bg-axp-gold/5 border-axp-gold shadow-[0_0_20px_rgba(251,191,36,0.1)]"
                                    : "bg-gray-900/50 border-gray-800 hover:border-gray-700"
                            )}
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors",
                                formData.playStyle === style.id ? "bg-axp-gold text-gray-900" : "bg-gray-800 text-gray-500 group-hover:text-gray-300"
                            )}>
                                <style.icon className="w-5 h-5" />
                            </div>
                            <h3 className={cn(
                                "font-black text-sm uppercase tracking-tighter",
                                formData.playStyle === style.id ? "text-white" : "text-gray-400"
                            )}>{style.label}</h3>
                            <p className="text-[10px] text-gray-500 mt-1 font-medium">{style.desc}</p>

                            {formData.playStyle === style.id && (
                                <div className="absolute top-2 right-2">
                                    <div className="w-2 h-2 rounded-full bg-axp-gold animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Generate Button Container */}
            <div className="pt-6">
                <Button
                    variant="neonGreen"
                    className="w-full py-4 uppercase tracking-[4px] font-black text-gray-900 shadow-[0_10px_30px_rgba(34,197,94,0.3)] disabled:opacity-30 disabled:grayscale transition-all hover:scale-[1.02]"
                    disabled={!isFormValid}
                    onClick={handleGenerate}
                >
                    Initialize Engine
                </Button>
            </div>
        </div>
    );
}
