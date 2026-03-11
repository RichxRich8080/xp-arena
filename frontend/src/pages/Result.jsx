import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNeuralHaptics } from '../hooks/useNeuralHaptics';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';

const MultiSliderResult = ({ label, value, color }) => (
    <div className="bg-gray-900/40 border border-white/5 p-4 rounded-2xl flex justify-between items-center mb-3">
        <div>
            <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{label}</div>
            <div className={`text-2xl font-black font-mono text-${color}-400`}>{value}</div>
        </div>
        <div className="w-12 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
                className={`h-full bg-${color}-500 transition-all duration-1000 ease-out`}
                style={{ width: `${(value / 200) * 100}%` }}
            />
        </div>
    </div>
);

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { triggerHeavyHaptic, triggerLightHaptic } = useNeuralHaptics();
    const { showAreniAlert } = useAuth();
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState(null);

    useEffect(() => {
        if (!location.state?.calculation) {
            navigate('/tool');
            return;
        }

        // Simulate Neural Calculation Animation
        const timer = setTimeout(() => {
            setLoading(false);
            setResults(location.state.calculation);
            triggerHeavyHaptic();
        }, 2500);

        return () => clearTimeout(timer);
    }, [location.state, navigate, triggerHeavyHaptic]);

    const savePreset = () => {
        const saved = JSON.parse(localStorage.getItem('areni_presets') || '[]');
        const newPreset = {
            id: Date.now(),
            device: location.state.device,
            data: results,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('areni_presets', JSON.stringify([newPreset, ...saved]));
        triggerLightHaptic();
        showAreniAlert("Preset Encrypted & Saved to Vault", "success");
    };

    if (loading) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center text-center">
                <div className="relative w-32 h-32 mb-8">
                    <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full animate-ping"></div>
                    <div className="absolute inset-2 border-2 border-indigo-500/40 rounded-full animate-pulse border-t-cyan-400 border-t-4"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl animate-bounce">🧬</span>
                    </div>
                </div>
                <h2 className="text-2xl font-black italic tracking-tighter text-white animate-pulse">CALIBRATING OPTICS...</h2>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-4">Analyzing Hardware Weights & DPI</p>
                <div className="mt-8 flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce delay-100"></div>
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce delay-200"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 animate-in fade-in zoom-in duration-500">
            <div className="bg-gradient-to-br from-indigo-600 to-cyan-500 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl italic font-black">ARENI</div>
                <div className="relative z-10">
                    <div className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-2">Device Optimized</div>
                    <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-4">
                        {location.state.device.brand} {location.state.device.model}
                    </h2>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        <span className="text-[9px] font-black text-white uppercase tracking-widest">Accuracy: 99.8%</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MultiSliderResult label="General Sensitivity" value={results.general} color="cyan" />
                <MultiSliderResult label="Red Dot / Holographic" value={results.redDot} color="indigo" />
                <MultiSliderResult label="2x Scope Velocity" value={results.scope2x} color="purple" />
                <MultiSliderResult label="4x Scope Damping" value={results.scope4x} color="pink" />
                <MultiSliderResult label="Sniper Precision" value={results.sniper} color="yellow" />
            </div>

            <div className="flex gap-4 mt-4">
                <button
                    onClick={savePreset}
                    className="flex-1 bg-gray-800 border border-gray-700 p-5 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-gray-700 transition-all active:scale-95 shadow-xl"
                >
                    <span className="text-2xl">💾</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Save Preset</span>
                </button>
                <button
                    onClick={() => {
                        triggerLightHaptic();
                        showAreniAlert("Generating high-res capture...", "success");
                    }}
                    className="flex-1 bg-cyan-500 p-5 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-cyan-400 transition-all active:scale-95 shadow-[0_10px_30px_rgba(6,182,212,0.4)]"
                >
                    <span className="text-2xl">📸</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Download PNG</span>
                </button>
            </div>

            <button
                onClick={() => navigate('/presets')}
                className="w-full py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] hover:text-cyan-400 transition-colors"
            >
                View Saved Presets Library
            </button>
        </div>
    );
};

export default Result;
