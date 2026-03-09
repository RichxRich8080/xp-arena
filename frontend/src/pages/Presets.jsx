import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNeuralHaptics } from '../hooks/useNeuralHaptics';

const Presets = () => {
    const navigate = useNavigate();
    const { triggerLightHaptic, triggerHeavyHaptic } = useNeuralHaptics();
    const [presets, setPresets] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('areni_presets') || '[]');
        setPresets(saved);
    }, []);

    const deletePreset = (id) => {
        const filtered = presets.filter(p => p.id !== id);
        localStorage.setItem('areni_presets', JSON.stringify(filtered));
        setPresets(filtered);
        triggerHeavyHaptic();
    };

    const loadPreset = (preset) => {
        triggerLightHaptic();
        navigate('/result', { state: { calculation: preset.data, device: preset.device } });
    };

    return (
        <div className="flex flex-col gap-6 pb-20">
            <div className="text-center mb-4">
                <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase underline decoration-cyan-500 decoration-4 underline-offset-8">SENS_VAULT</h2>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-6 leading-relaxed">Your encrypted sensitivity archive. Secure, synced, and verified.</p>
            </div>

            {presets.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-800 rounded-[3rem] text-center">
                    <span className="text-4xl mb-4 grayscale">📁</span>
                    <div className="text-xs font-black text-gray-500 uppercase tracking-widest">Archive Empty</div>
                    <p className="text-[10px] text-gray-600 mt-2 uppercase">Calibrate your first device to populate the vault.</p>
                    <button
                        onClick={() => navigate('/tool')}
                        className="mt-6 px-6 py-3 bg-gray-800 rounded-full text-[10px] font-black uppercase hover:bg-gray-700 transition-colors"
                    >
                        Initialize Engine
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {presets.map(preset => (
                        <div
                            key={preset.id}
                            className="bg-gray-900/60 border border-white/5 p-6 rounded-[2rem] flex justify-between items-center group hover:border-cyan-500/30 transition-all"
                        >
                            <div className="flex-1 cursor-pointer" onClick={() => loadPreset(preset)}>
                                <div className="text-[8px] font-black text-cyan-400 uppercase tracking-widest mb-1">{new Date(preset.timestamp).toLocaleDateString()}</div>
                                <div className="text-lg font-black text-white uppercase italic tracking-tight group-hover:text-cyan-400 transition-colors">
                                    {preset.device.brand} {preset.device.model}
                                </div>
                                <div className="mt-2 flex gap-3">
                                    <div className="text-[8px] font-black text-gray-500 uppercase">GEN: {preset.data.general}</div>
                                    <div className="text-[8px] font-black text-gray-500 uppercase">RED: {preset.data.redDot}</div>
                                </div>
                            </div>
                            <button
                                onClick={() => deletePreset(preset.id)}
                                className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Presets;
