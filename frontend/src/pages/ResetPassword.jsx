import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNeuralHaptics } from '../hooks/useNeuralHaptics';
import { useAudioUI } from '../hooks/useAudioUI';

const ResetPassword = () => {
    const { triggerLightHaptic, triggerHeavyHaptic } = useNeuralHaptics();
    const { playClick, playSuccess } = useAudioUI();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleReset = (e) => {
        e.preventDefault();
        setLoading(true);
        triggerHeavyHaptic();
        playClick();

        setTimeout(() => {
            setLoading(false);
            playSuccess();
            navigate('/login');
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[200] bg-gray-950 flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] bg-green-500/5 blur-[150px] rounded-full animate-pulse"></div>

            <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-700">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-4 h-[1px] bg-green-500"></div>
                        <span className="text-[10px] font-black italic text-green-500 uppercase tracking-[0.4em]">Recovery_Protocol_Final</span>
                        <div className="w-4 h-[1px] bg-green-500"></div>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-white mb-2 italic uppercase leading-none">Access_Restoration</h1>
                    <p className="text-gray-500 text-[10px] font-bold tracking-widest uppercase mt-2">Redefine your neural access token</p>
                </div>

                <div className="bg-gray-950/60 backdrop-blur-3xl border border-white/5 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/30 to-transparent"></div>

                    <form onSubmit={handleReset} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                            <label className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em] ml-1">New_Access_Token</label>
                            <input
                                type="password"
                                placeholder="••••••••••••"
                                className="bg-white/5 border border-white/5 rounded-2xl px-6 py-5 text-xs text-white uppercase font-black italic tracking-widest focus:outline-none focus:border-green-500/30 transition-all placeholder:text-gray-700"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em] ml-1">Confirm_Protocol</label>
                            <input
                                type="password"
                                placeholder="••••••••••••"
                                className="bg-white/5 border border-white/5 rounded-2xl px-6 py-5 text-xs text-white uppercase font-black italic tracking-widest focus:outline-none focus:border-green-500/30 transition-all placeholder:text-gray-700"
                                required
                            />
                            <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest leading-relaxed ml-1">
                                Secure your identity with a high-entropy string of characters.
                            </p>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className={`w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] transition-all relative overflow-hidden ${loading
                                    ? 'bg-gray-800 text-gray-500'
                                    : 'bg-white text-gray-950 shadow-xl hover:scale-105 active:scale-95'
                                }`}
                        >
                            <span className="relative z-10">{loading ? 'Restoring...' : 'Commit_Changes'}</span>
                            <div className={`absolute inset-0 bg-green-500/10 transition-transform duration-[2000ms] ${loading ? 'translate-x-0' : 'translate-x-[-101%]'}`}></div>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
