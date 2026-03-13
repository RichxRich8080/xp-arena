import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import devicesData from '../data/devices.json';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, Tablet, Cpu, Zap, Activity, ChevronRight, Laptop, MousePointer2, Settings, Sparkles, SlidersHorizontal } from 'lucide-react';
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
        // Simple mock results for high-fidelity tool UX
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
        <div className="space-y-16 pb-20 animate-slide-in font-display">
            {/* Header / Intro */}
            <div className="text-center space-y-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-4">
                    <div className="h-1px w-10 bg-accent-cyan/50" />
                    <span className="text-[10px] font-black italic text-accent-cyan uppercase tracking-[0.5em]">Neural_Calibration_v3.0</span>
                    <div className="h-1px w-10 bg-accent-cyan/50" />
                </div>
                <h1 className="text-5xl md:text-7xl font-black italic text-white tracking-tighter uppercase leading-none">
                    CALIBRATION <span className="text-accent-cyan">MATRIX</span>
                </h1>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-lg mx-auto italic">
                    Establish a hardware-level synchronization loop to generate the most precise sensitivity coefficients for your terminal.
                </p>
            </div>

            {/* Progress Segmented Bar */}
            <div className="max-w-md mx-auto flex items-center gap-4">
                {[1, 2].map(s => (
                    <div key={s} className="flex-1 space-y-3">
                        <div className={cn(
                            "h-1.5 rounded-full transition-all duration-700",
                            step >= s ? "bg-accent-cyan shadow-[0_0_15px_rgba(6,182,212,0.8)]" : "bg-white/5"
                        )} />
                        <div className="flex items-center justify-between px-1">
                            <span className={cn("text-[8px] font-black uppercase tracking-widest", step >= s ? "text-accent-cyan" : "text-gray-700")}>PHASE_0{s}</span>
                            {step > s && <Zap className="w-3 h-3 text-accent-cyan fill-accent-cyan" />}
                        </div>
                    </div>
                ))}
            </div>

            <div className="max-w-3xl mx-auto">
                {step === 1 && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-500">
                        <div className="flex items-center gap-4 ml-4">
                            <Tablet className="w-4 h-4 text-gray-500" />
                            <h3 className="text-[10px] font-black text-gray-500 tracking-[0.4em] uppercase">STEP_01: HARDWARE_LINK_HANDSHAKE</h3>
                        </div>

                        <Card className="p-6 md:p-16 border-white/5 bg-white/[0.01] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.03] font-black text-8xl italic select-none pointer-events-none uppercase text-white">DEVICE</div>
                            
                            <div className="space-y-8 relative z-10">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                        <Search className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="SEARCH_TERMINAL_MODEL..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-background border border-white/10 rounded-2xl pl-12 pr-6 py-5 md:pl-16 md:pr-8 md:py-7 font-black text-xs md:text-sm text-white focus:outline-none focus:border-accent-cyan transition-all italic uppercase placeholder:text-gray-700 shadow-2xl"
                                    />
                                    
                                    {filteredDevices.length > 0 && (
                                        <div className="absolute top-full left-0 w-full mt-4 glass-panel border-white/10 bg-[#0a0f18]/95 p-2 z-[200] shadow-[0_30px_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl animate-in zoom-in-95 duration-200 rounded-[1.5rem] md:rounded-[2rem]">
                                            <div className="grid grid-cols-1 gap-2">
                                                {filteredDevices.map(device => (
                                                    <button
                                                        key={`${device.brand}-${device.model}`}
                                                        onClick={() => handleSelectDevice(device)}
                                                        className="w-full p-6 text-left hover:bg-white/5 rounded-2xl group/item transition-all flex items-center justify-between border border-transparent hover:border-white/10"
                                                    >
                                                        <div>
                                                            <div className="text-[9px] text-gray-600 font-black uppercase tracking-widest leading-none mb-1.5">{device.brand}_NODES</div>
                                                            <div className="text-md font-black text-white italic tracking-tighter uppercase group-hover/item:text-accent-cyan transition-colors">{device.model}</div>
                                                        </div>
                                                        <ChevronRight className="w-5 h-5 text-gray-700 group-hover/item:text-accent-cyan group-hover/item:translate-x-1 transition-all" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex flex-wrap gap-6 pt-10 border-t border-white/5 opacity-40">
                                    {[
                                        { icon: Tablet, label: 'MOBILE' },
                                        { icon: Laptop, label: 'PHABLET' },
                                        { icon: MousePointer2, label: 'INPUT' }
                                    ].map((cat, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <cat.icon className="w-4 h-4" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">{cat.label}_CLASS_IDENTIFIED</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-right-10 duration-500">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-8 px-4">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                                    <h3 className="text-[10px] font-black text-gray-500 tracking-[0.4em] uppercase">STEP_02: PHYSICS_WEIGHT_ADJUSTMENT</h3>
                                </div>
                                <div className="text-xl font-black text-white italic uppercase tracking-tighter">
                                    {selectedDevice?.brand} <span className="text-accent-cyan">{selectedDevice?.model}</span> LINKED
                                </div>
                            </div>
                            <button 
                                onClick={() => setStep(1)}
                                className="text-[9px] font-black text-gray-700 uppercase tracking-widest border-b border-gray-800 pb-1 hover:text-white transition-colors"
                            >
                                CHANGE_HARDWARE_NODE
                            </button>
                        </div>

                        <Card className="p-6 md:p-16 border-white/5 bg-white/[0.01] space-y-12 md:space-y-16">
                            {/* RAM PROFILE */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 justify-between px-1">
                                    <label className="text-[9px] font-black text-accent-cyan uppercase tracking-[0.3em]">MEMORY_THROUGHPUT (RAM)</label>
                                    <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest italic">HARDWARE_SPEC_SYNC</span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {['2GB', '4GB', '8GB', '12GB+'].map(val => (
                                        <button
                                            key={val}
                                            onClick={() => setHardware({ ...hardware, ram: val })}
                                            className={cn(
                                                "p-6 rounded-2xl font-black italic tracking-tighter text-sm transition-all border",
                                                hardware.ram === val 
                                                    ? "bg-accent-cyan/10 border-accent-cyan shadow-[0_10px_30px_rgba(6,182,212,0.15)] text-white" 
                                                    : "bg-white/[0.02] border-white/5 text-gray-600 hover:border-white/20"
                                            )}
                                        >
                                            {val}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* TACTILE WEIGHTS */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                <div className="space-y-6">
                                    <label className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] block ml-1">TACTILE_CALIBRATION</label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {['NORMAL_DRY', 'SLEEVES_PRO', 'HARD_GRIP'].map(val => {
                                            const key = val.split('_')[0].charAt(0) + val.split('_')[0].slice(1).toLowerCase();
                                            return (
                                                <button
                                                    key={val}
                                                    onClick={() => setHardware({ ...hardware, hand: key })}
                                                    className={cn(
                                                        "p-5 rounded-2xl font-black italic tracking-widest text-[10px] uppercase transition-all border text-left flex justify-between items-center group/opt",
                                                        hardware.hand === key 
                                                            ? "bg-indigo-500/10 border-indigo-500/50 text-white" 
                                                            : "bg-white/[0.02] border-white/5 text-gray-600 hover:border-white/20"
                                                    )}
                                                >
                                                    {val}
                                                    {hardware.hand === key && <Settings className="w-4 h-4 text-indigo-400 animate-spin-slow" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <label className="text-[9px] font-black text-accent-rose uppercase tracking-[0.3em] block ml-1">MOVEMENT_VELOCITY</label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {['SLOW_PRECISION', 'BALANCED_STABLE', 'ULTRA_FAST'].map(val => {
                                            const key = val.split('_')[0].charAt(0) + val.split('_')[0].slice(1).toLowerCase();
                                            return (
                                                <button
                                                    key={val}
                                                    onClick={() => setHardware({ ...hardware, style: key })}
                                                    className={cn(
                                                        "p-5 rounded-2xl font-black italic tracking-widest text-[10px] uppercase transition-all border text-left flex justify-between items-center group/opt",
                                                        hardware.style === key 
                                                            ? "bg-accent-rose/10 border-accent-rose/50 text-white" 
                                                            : "bg-white/[0.02] border-white/5 text-gray-600 hover:border-white/20"
                                                    )}
                                                >
                                                    {val}
                                                    {hardware.style === key && <Activity className="w-4 h-4 text-accent-rose animate-pulse" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={calculateSens}
                                className="w-full py-10 bg-accent-cyan hover:bg-white text-background font-black uppercase italic tracking-[0.5em] text-[12px] shadow-[0_25px_50px_rgba(6,182,212,0.2)] transition-all group/run relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-6">
                                    INITIALIZE_NEURAL_LINK
                                    <Sparkles className="w-6 h-6 group-hover/run:scale-125 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover/run:translate-x-0 transition-transform duration-700" />
                            </Button>
                        </Card>
                    </div>
                )}
            </div>
            
            <div className="flex justify-center pt-8">
                <div className="glass-panel border-white/5 bg-white/[0.01] p-8 flex flex-col items-center gap-6 max-w-xl opacity-30 text-center">
                   <div className="flex items-center gap-4">
                       <Cpu className="w-5 h-5" />
                       <div className="h-1px w-20 bg-white/10" />
                       <Zap className="w-5 h-5" />
                       <div className="h-1px w-20 bg-white/10" />
                       <Activity className="w-5 h-5" />
                   </div>
                   <p className="text-[8px] text-gray-700 font-bold uppercase tracking-[0.4em] leading-relaxed italic">
                      HARDWARE_ATOMIC_CALIBRATION_MODULE_v3.2 // SYNC_STABLE // READY_FOR_UPLINK
                   </p>
                </div>
            </div>
        </div>
    );
}
