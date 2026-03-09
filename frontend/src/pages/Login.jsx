import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useNeuralHaptics } from '../hooks/useNeuralHaptics';
import { useAudioUI } from '../hooks/useAudioUI';
import { useAreni } from '../context/AreniContext';

const Login = () => {
    const { triggerLightHaptic, triggerHeavyHaptic } = useNeuralHaptics();
    const { playClick, playSuccess, playError } = useAudioUI();
    const { showAreniAlert } = useAreni();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = e.target.elements[0].value;
        const password = e.target.elements[1].value;

        setLoading(true);
        triggerHeavyHaptic();
        playClick();

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem('areni_token', data.token);
                playSuccess();
                navigate('/');
            } else {
                throw new Error(data.message || 'Authentication Failed');
            }
        } catch (err) {
            playError();
            showAreniAlert(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] bg-gray-950 flex flex-col items-center justify-center p-6 overflow-hidden font-sans">
            {/* Background Neural Matrix */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[150px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[150px] rounded-full animate-pulse delay-1000"></div>

            {/* Header HUD */}
            <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-700">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-8 h-[1px] bg-cyan-500/50"></div>
                        <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.3)] rotate-12 transition-transform hover:rotate-0 duration-500">
                            <span className="text-3xl font-black text-white italic">A</span>
                        </div>
                        <div className="w-8 h-[1px] bg-cyan-500/50"></div>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-white italic uppercase leading-none">Areni_Uplink</h1>
                    <p className="text-gray-500 text-[9px] font-black tracking-[0.4em] uppercase mt-2">Neural_Authentication_Node</p>
                </div>

                {/* Login HUB */}
                <div className="bg-gray-950/60 backdrop-blur-3xl border border-white/5 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>

                    <form onSubmit={handleLogin} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                            <label className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em] ml-1">Identity_Handle</label>
                            <input
                                type="email"
                                placeholder="USERNAME_OR_EMAIL"
                                className="bg-white/5 border border-white/5 rounded-2xl px-6 py-5 text-xs text-white uppercase font-black italic tracking-widest focus:outline-none focus:border-cyan-500/30 transition-all placeholder:text-gray-800"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em] ml-1">Access_Protocol</label>
                            <input
                                type="password"
                                placeholder="••••••••••••"
                                className="bg-white/5 border border-white/5 rounded-2xl px-6 py-5 text-xs text-white uppercase font-black italic tracking-widest focus:outline-none focus:border-cyan-500/30 transition-all placeholder:text-gray-800"
                                required
                            />
                        </div>

                        <div className="flex justify-between items-center px-1">
                            <NavLink
                                to="/forgot-password"
                                className="text-[9px] font-black text-gray-600 hover:text-cyan-400 uppercase tracking-widest transition-colors"
                            >
                                Lost_Protocol?
                            </NavLink>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className={`w-full py-6 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] transition-all relative overflow-hidden ${loading
                                ? 'bg-gray-800 text-gray-500'
                                : 'bg-white text-gray-950 hover:scale-[1.02] active:scale-95 shadow-xl'
                                }`}
                        >
                            <span className="relative z-10">{loading ? 'Syncing_Data...' : 'Initiate_Session'}</span>
                            <div className={`absolute inset-0 bg-cyan-500/10 transition-transform duration-[2000ms] ${loading ? 'translate-x-0' : 'translate-x-[-101%]'}`}></div>
                        </button>
                    </form>
                </div>

                <div className="mt-10 text-center text-[9px] font-black text-gray-600 uppercase tracking-widest">
                    External_Node? <NavLink to="/signup" className="text-white hover:text-cyan-400 transition-colors ml-2 italic">JOIN_THE_SYNDICATE</NavLink>
                </div>
            </div>

            {/* Termination Notice */}
            <div className="absolute bottom-8 text-[8px] font-black text-gray-800 uppercase tracking-[0.6em] opacity-20 pointer-events-none">
                ARENI_ESPORTS_SYSTEMS_v8.4.2
            </div>
        </div>
    );
};

export default Login;
