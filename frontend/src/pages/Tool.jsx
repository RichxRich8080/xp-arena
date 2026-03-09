import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import devicesData from '../data/devices.json';
import { useNeuralHaptics } from '../hooks/useNeuralHaptics';
import { useHUDDepth } from '../hooks/useHUDDepth';
import { useAudioUI } from '../hooks/useAudioUI';

const Tool = () => {
    const navigate = useNavigate();
    const { triggerLightHaptic, triggerHeavyHaptic } = useNeuralHaptics();
    const { playClick, playSuccess } = useAudioUI();
    const depthRef = useHUDDepth(5);

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
        triggerLightHaptic();
        playClick();
        setStep(2);
    };

    const calculateSens = () => {
        triggerHeavyHaptic();
        playSuccess();

        // Base Calculation Logic (Free Fire Standard Weights)
        let base_gen = 90;
        let base_red = 70;
        let base_2x = 80;
        let base_4x = 75;
        let base_snp = 15;

        // RAM Weights
        const ramWeight = hardware.ram === '2GB' ? -10 : hardware.ram === '4GB' ? -5 : hardware.ram === '8GB' ? 5 : 15;
        // Hand Type Weights
        const handWeight = hardware.hand === 'Hard' ? -8 : hardware.hand === 'Sleeves' ? 12 : 0;
        // Style Weights
        const styleWeight = hardware.style === 'Slow' ? -15 : hardware.style === 'Fast' ? 15 : 0;

        const results = {
            general: Math.min(200, Math.max(0, base_gen + ramWeight + handWeight + styleWeight)),
            redDot: Math.min(200, Math.max(0, base_red + ramWeight + handWeight + styleWeight)),
            scope2x: Math.min(200, Math.max(0, base_2x + ramWeight + handWeight + styleWeight)),
            scope4x: Math.min(200, Math.max(0, base_4x + ramWeight + handWeight + styleWeight)),
            sniper: Math.min(200, Math.max(0, base_snp + Math.floor(ramWeight / 2)))
        };

        navigate('/result', { state: { calculation: results, device: selectedDevice, hardware } });
    };

    return (
        <div ref={depthRef} className="flex flex-col gap-6 pb-20 hud-depth transition-all duration-500">
            {/* Header */}
            <div className="text-center mb-2">
                <div className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] mb-2 opacity-50 underline decoration-indigo-500">Neural Calibration v3.0</div>
                <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Calibration Matrix</h2>
            </div>

            {/* Progress HUD */}
            <div className="flex items-center gap-2 justify-center mb-4">
                {[1, 2].map(s => (
                    <div key={s} className={`h-1 transition-all duration-500 rounded-full ${step >= s ? 'w-12 bg-cyan-500' : 'w-4 bg-gray-800'}`} />
                ))}
            </div>

            {step === 1 && (
                <div className="bg-gray-900/60 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl animate-in fade-in slide-in-from-bottom-5">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Step 01: Hardware Link</h3>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="FIND YOUR DEVICE..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-950/80 border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold text-white focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all"
                        />
                        {filteredDevices.length > 0 && (
                            <div className="absolute top-full left-0 w-full mt-3 bg-gray-950/90 border border-white/10 rounded-3xl overflow-hidden z-50 shadow-[0_30px_60px_rgba(0,0,0,0.8)] backdrop-blur-3xl animate-in zoom-in-95 duration-200">
                                {filteredDevices.map(device => (
                                    <button
                                        key={`${device.brand}-${device.model}`}
                                        onClick={() => handleSelectDevice(device)}
                                        className="w-full px-6 py-5 text-left hover:bg-white/5 flex flex-col group transition-all border-b border-white/5 last:border-0"
                                    >
                                        <div className="text-[9px] text-gray-500 font-black uppercase opacity-60">{device.brand}</div>
                                        <div className="text-md font-bold text-white group-hover:text-cyan-400 tracking-tight uppercase">{device.model}</div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="bg-gray-900/60 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl animate-in fade-in slide-in-from-right-5">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Step 02: Physics Weights</h3>
                        <button onClick={() => setStep(1)} className="text-[10px] text-gray-600 font-black hover:text-white uppercase">Change Device</button>
                    </div>

                    <div className="space-y-8">
                        {/* RAM Selector */}
                        <div>
                            <label className="text-[9px] font-black text-cyan-400 uppercase tracking-widest block mb-4">Device RAM Profile</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['2GB', '4GB', '8GB', '12GB+'].map(val => (
                                    <button
                                        key={val}
                                        onClick={() => { setHardware({ ...hardware, ram: val }); triggerLightHaptic(); }}
                                        className={`px-4 py-4 rounded-xl text-xs font-bold transition-all border ${hardware.ram === val ? 'bg-cyan-500/10 border-cyan-500/50 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'bg-white/5 border-transparent text-gray-500'}`}
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Hand Type Selector */}
                        <div>
                            <label className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block mb-4">Tactile Interaction</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['Hard', 'Normal', 'Sleeves'].map(val => (
                                    <button
                                        key={val}
                                        onClick={() => { setHardware({ ...hardware, hand: val }); triggerLightHaptic(); }}
                                        className={`px-2 py-4 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all border ${hardware.hand === val ? 'bg-indigo-500/10 border-indigo-500/50 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-white/5 border-transparent text-gray-500'}`}
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Style Selector */}
                        <div>
                            <label className="text-[9px] font-black text-purple-400 uppercase tracking-widest block mb-4">Movement Velocity</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['Slow', 'Normal', 'Fast'].map(val => (
                                    <button
                                        key={val}
                                        onClick={() => { setHardware({ ...hardware, style: val }); triggerLightHaptic(); }}
                                        className={`px-2 py-4 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all border ${hardware.style === val ? 'bg-purple-500/10 border-purple-500/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'bg-white/5 border-transparent text-gray-500'}`}
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={calculateSens}
                        className="w-full mt-10 bg-gradient-to-r from-cyan-600 to-indigo-600 p-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] text-white shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-cyan-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        Initialize Final Link
                    </button>
                </div>
            )}
        </div>
    );
};

export default Tool;
