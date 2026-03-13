import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import devicesData from '../data/devices.json';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, Tablet, Cpu, Zap, Activity, ChevronRight, Laptop, MousePointer2, Settings, Sparkles, SlidersHorizontal, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '../utils/cn';

export default function Tool() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedDevice, setSelectedDevice] = useState(null);

    // Hardware & Style State
    const [hardware, setHardware] = useState({
        ram: '8GB',
        hand: 'Normal',
        style: 'Fast'
    });

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const filteredDevices = useMemo(() => {
        if (!debouncedSearch) return [];
        return devicesData.devices
            .filter(d => `${d.brand} ${d.model}`.toLowerCase().includes(debouncedSearch.toLowerCase()))
            .slice(0, 8);
    }, [debouncedSearch]);

    const handleSelectDevice = (device) => {
        setSelectedDevice(device);
        setStep(2);
    };

    const calculateSens = () => {
        // Mock results
        const results = {
            general: 90,
            redDot: 100,
            scope2x: 82,
            scope4x: 75,
            sniper: 32
        };
        navigate('/result', { state: { calculation: results, device: selectedDevice, hardware } });
    };

    return (
        <div className="space-y-12 pb-20 animate-fade-in font-sans">
            {/* Header */}
            <div className="text-center space-y-6 max-w-3xl mx-auto px-4">
                <div className="flex items-center justify-center gap-4">
                    <div className="h-px w-8 bg-primary/30" />
                    <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Pro Calibration System</span>
                    <div className="h-px w-8 bg-primary/30" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight uppercase leading-none">
                    Sensitivity <span className="text-primary">Calibration</span>
                </h1>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest leading-relaxed max-w-xl mx-auto">
                    Configure your hardware parameters to generate precision sensitivity settings optimized for your specific device.
                </p>
            </div>

            {/* Progress Stepper */}
            <div className="max-w-md mx-auto flex items-center gap-6 px-4">
                {[1, 2].map(s => (
                    <div key={s} className="flex-1 space-y-3">
                        <div className={cn(
                            "h-1.5 rounded-full transition-all duration-500",
                            step >= s ? "bg-primary shadow-[0_0_15px_rgba(6,182,212,0.3)]" : "bg-slate-800"
                        )} />
                        <div className="flex items-center justify-between px-1">
                            <span className={cn("text-[8px] font-bold uppercase tracking-widest", step >= s ? "text-primary" : "text-slate-600")}>Step 0{s}</span>
                            {step > s && <CheckCircle2 className="w-3 h-3 text-primary" />}
                        </div>
                    </div>
                ))}
            </div>

            <div className="max-w-4xl mx-auto px-4">
                {step === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
                        <div className="flex items-center gap-3 ml-2">
                            <Tablet className="w-4 h-4 text-primary" />
                            <h3 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Device Selection</h3>
                        </div>

                        <Card className="p-8 md:p-12 bg-slate-900 border-white/5 relative overflow-hidden group rounded-[2.5rem] shadow-2xl">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.02] font-bold text-8xl select-none pointer-events-none uppercase text-white">DEVICE</div>
                            
                            <div className="space-y-8 relative z-10">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                        <Search className="w-5 h-5 text-slate-500" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search your device model..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-12 pr-6 py-5 md:pl-16 md:pr-8 md:py-6 font-bold text-sm text-white focus:outline-none focus:border-primary transition-all uppercase placeholder:text-slate-700 shadow-xl"
                                    />
                                    
                                    {filteredDevices.length > 0 && (
                                        <div className="absolute top-full left-0 w-full mt-4 bg-slate-900 border border-white/10 p-3 z-[200] shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200 rounded-3xl">
                                            <div className="grid grid-cols-1 gap-2">
                                                {filteredDevices.map(device => (
                                                    <button
                                                        key={`${device.brand}-${device.model}`}
                                                        onClick={() => handleSelectDevice(device)}
                                                        className="w-full p-5 text-left hover:bg-slate-800 rounded-2xl group/item transition-all flex items-center justify-between border border-transparent hover:border-white/5"
                                                    >
                                                        <div>
                                                            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-1.5">{device.brand} Series</div>
                                                            <div className="text-base font-bold text-white tracking-tight uppercase group-hover/item:text-primary transition-colors">{device.model}</div>
                                                        </div>
                                                        <ArrowRight className="w-5 h-5 text-slate-700 group-hover/item:text-primary group-hover/item:translate-x-1 transition-all" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex flex-wrap gap-8 pt-8 border-t border-white/5">
                                    {[
                                        { icon: Tablet, label: 'MOBILE' },
                                        { icon: Laptop, label: 'TABLET' },
                                        { icon: Settings, label: 'CUSTOM' }
                                    ].map((cat, i) => (
                                        <div key={i} className="flex items-center gap-3 text-slate-500">
                                            <cat.icon className="w-4 h-4" />
                                            <span className="text-[9px] font-bold uppercase tracking-widest">{cat.label} SUPPORTED</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-right-10 duration-500">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-6 px-4">
                            <div className="space-y-3 text-center md:text-left">
                                <div className="flex items-center gap-3 justify-center md:justify-start">
                                    <SlidersHorizontal className="w-4 h-4 text-primary" />
                                    <h3 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Hardware Configuration</h3>
                                </div>
                                <div className="text-2xl font-bold text-white uppercase tracking-tight">
                                    {selectedDevice?.brand} <span className="text-primary">{selectedDevice?.model}</span> Selected
                                </div>
                            </div>
                            <button 
                                onClick={() => setStep(1)}
                                className="text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/10 pb-1 hover:text-white transition-colors"
                            >
                                Change Device
                            </button>
                        </div>

                        <Card className="p-8 md:p-12 bg-slate-900 border-white/5 space-y-12 md:space-y-14 rounded-[2.5rem] shadow-2xl">
                            {/* RAM PROFILE */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-4 justify-between px-1">
                                    <label className="text-[9px] font-bold text-primary uppercase tracking-widest">Memory Capacity (RAM)</label>
                                    <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Hardware Sync</span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {['2GB', '4GB', '8GB', '12GB+'].map(val => (
                                        <button
                                            key={val}
                                            onClick={() => setHardware({ ...hardware, ram: val })}
                                            className={cn(
                                                "p-6 rounded-2xl font-bold tracking-tight text-sm transition-all border",
                                                hardware.ram === val 
                                                    ? "bg-primary/10 border-primary text-white shadow-lg shadow-primary/10" 
                                                    : "bg-slate-950 border-white/5 text-slate-500 hover:border-white/10"
                                            )}
                                        >
                                            {val}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* CONFIGURATION OPTIONS */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-5">
                                    <label className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest block ml-1">Grip Preference</label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {['Normal Grip', 'Pro Sleeve', 'Steady Grip'].map(val => {
                                            return (
                                                <button
                                                    key={val}
                                                    onClick={() => setHardware({ ...hardware, hand: val })}
                                                    className={cn(
                                                        "p-5 rounded-2xl font-bold tracking-widest text-[10px] uppercase transition-all border text-left flex justify-between items-center group/opt",
                                                        hardware.hand === val 
                                                            ? "bg-indigo-500/10 border-indigo-500/50 text-white" 
                                                            : "bg-slate-950 border-white/5 text-slate-500 hover:border-white/10"
                                                    )}
                                                >
                                                    {val}
                                                    {hardware.hand === val && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <label className="text-[9px] font-bold text-amber-500 uppercase tracking-widest block ml-1">Targeting Speed</label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {['Precision', 'Balanced', 'High Speed'].map(val => {
                                            return (
                                                <button
                                                    key={val}
                                                    onClick={() => setHardware({ ...hardware, style: val })}
                                                    className={cn(
                                                        "p-5 rounded-2xl font-bold tracking-widest text-[10px] uppercase transition-all border text-left flex justify-between items-center group/opt",
                                                        hardware.style === val 
                                                            ? "bg-amber-500/10 border-amber-500/50 text-white" 
                                                            : "bg-slate-950 border-white/5 text-slate-500 hover:border-white/10"
                                                    )}
                                                >
                                                    {val}
                                                    {hardware.style === val && <Zap className="w-4 h-4 text-amber-500" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={calculateSens}
                                className="w-full h-20 bg-primary hover:bg-white text-slate-950 font-bold uppercase tracking-[0.3em] text-[10px] shadow-2xl transition-all group/run relative overflow-hidden rounded-2xl"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-4">
                                    Generate Calibration
                                    <Sparkles className="w-5 h-5 group-hover/run:scale-110 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover/run:translate-x-0 transition-transform duration-700" />
                            </Button>
                        </Card>
                    </div>
                )}
            </div>
            
            <div className="flex justify-center pt-8">
                <div className="bg-slate-900 border border-white/5 p-8 flex flex-col items-center gap-6 max-w-xl opacity-30 text-center rounded-[2rem]">
                   <div className="flex items-center gap-6">
                       <Cpu className="w-5 h-5" />
                       <div className="h-px w-16 bg-white/10" />
                       <Zap className="w-5 h-5" />
                       <div className="h-px w-16 bg-white/10" />
                       <Activity className="w-5 h-5" />
                   </div>
                   <p className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.3em] leading-relaxed">
                      Advanced Calibration Module // System Stable // Ready for Generation
                   </p>
                </div>
            </div>
        </div>
    );
}
