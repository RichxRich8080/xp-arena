import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useNeuralHaptics } from '../hooks/useNeuralHaptics';
import { useAudioUI } from '../hooks/useAudioUI';

const ForgotPassword = () => {
    const { triggerLightHaptic } = useNeuralHaptics();
    const { playClick, playSuccess } = useAudioUI();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleRecover = (e) => {
        e.preventDefault();
        setLoading(true);
        triggerLightHaptic();
        playClick();

        setTimeout(() => {
            setLoading(false);
            setSent(true);
            playSuccess();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[200] bg-gray-950 flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-red-500/5 blur-[150px] rounded-full animate-pulse"></div>

            <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-700">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-4 h-[1px] bg-red-500"></div>
                        <span className="text-[10px] font-black italic text-red-500 uppercase tracking-[0.4em]">Recovery_Protocol_Initial</span>
                        <div className="w-4 h-[1px] bg-red-500"></div>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-white mb-2 italic uppercase">Neural_Bypass</h1>
                    <p className="text-gray-500 text-[10px] font-bold tracking-widest uppercase">Initiate access token restoration</p>
                </div>

                <div className="bg-gray-950/60 backdrop-blur-3xl border border-white/5 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent"></div>

                    {sent ? (
                        <div className="text-center py-6 animate-in fade-in slide-in-from-bottom-5">
                            <div className="w-20 h-20 mx-auto rounded-[2rem] bg-red-500/10 border border-red-500/30 flex items-center justify-center text-3xl mb-8">📡</div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Signal_Transmitted</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-10">Check your neural linked email for the bypass code.</p>
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full py-5 rounded-2xl bg-white text-gray-950 text-[11px] font-black uppercase tracking-[0.2em] transform transition-all active:scale-95"
                            >
                                Return_to_Uplink
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleRecover} className="flex flex-col gap-8">
                            <div className="flex flex-col gap-3">
                                <label className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em] ml-1">Registered_Identifier</label>
                                <input
                                    type="email"
                                    placeholder="Enter_Neural_Linked_Email"
                                    className="bg-white/5 border border-white/5 rounded-2xl px-6 py-5 text-xs text-white uppercase font-black italic tracking-widest focus:outline-none focus:border-red-500/30 transition-all placeholder:text-gray-700"
                                    required
                                />
                                <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest leading-relaxed ml-1">
                                    A secure restoration link will be dispatched to this address.
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
                                <span className="relative z-10">{loading ? 'Transmitting...' : 'Request_Restoration'}</span>
                                <div className={`absolute inset-0 bg-red-500/10 transition-transform duration-[1500ms] ${loading ? 'translate-x-0' : 'translate-x-[-101%]'}`}></div>
                            </button>

                            <NavLink to="/login" className="text-center text-[9px] font-black text-gray-600 hover:text-white uppercase tracking-widest transition-colors">Abourt_Recovery</NavLink>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
