import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useNeuralHaptics } from '../hooks/useNeuralHaptics';
import { useAudioUI } from '../hooks/useAudioUI';
import { useAreni } from '../context/AreniContext';

const Signup = () => {
    const { triggerLightHaptic, triggerHeavyHaptic } = useNeuralHaptics();
    const { playClick, playSuccess, playError } = useAudioUI();
    const { showAreniAlert } = useAreni();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        const username = e.target.elements[0].value;
        const email = e.target.elements[1].value;
        const password = e.target.elements[2].value;

        setLoading(true);
        triggerHeavyHaptic();
        playClick();

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            const data = await res.json();

            if (data.success) {
                playSuccess();
                navigate('/login');
            } else {
                throw new Error(data.message || 'Registration Failed');
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
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[150px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[150px] rounded-full animate-pulse delay-1000"></div>

            {/* Header HUD */}
            <div className="w-full max-w-lg relative z-10 animate-in fade-in zoom-in duration-700">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-4 h-[1px] bg-indigo-500"></div>
                        <span className="text-[10px] font-black italic text-indigo-400 uppercase tracking-[0.4em]">Syndicate_Enlistment_Node</span>
                        <div className="w-4 h-[1px] bg-indigo-500"></div>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-white italic uppercase leading-none">Commission_ID</h1>
                    <p className="text-gray-500 text-[9px] font-black tracking-[0.4em] uppercase mt-2">Initialize your tactical bio-signature</p>
                </div>

                {/* Signup HUB */}
                <div className="bg-gray-950/60 backdrop-blur-3xl border border-white/5 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>

                    <form onSubmit={handleSignup} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-3">
                                <label className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em] ml-1">Identity_Handle</label>
                                <input
                                    type="text"
                                    placeholder="SNIPER_KING"
                                    className="bg-white/5 border border-white/5 rounded-2xl px-6 py-5 text-xs text-white uppercase font-black italic tracking-widest focus:outline-none focus:border-indigo-500/30 transition-all placeholder:text-gray-800"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <label className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em] ml-1">Comms_Dispatch</label>
                                <input
                                    type="email"
                                    placeholder="OPERATOR@ARENA.GG"
                                    className="bg-white/5 border border-white/5 rounded-2xl px-6 py-5 text-xs text-white uppercase font-black italic tracking-widest focus:outline-none focus:border-indigo-500/30 transition-all placeholder:text-gray-800"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em] ml-1">Access_Cipher</label>
                            <input
                                type="password"
                                placeholder="••••••••••••"
                                className="bg-white/5 border border-white/5 rounded-2xl px-6 py-5 text-xs text-white uppercase font-black italic tracking-widest focus:outline-none focus:border-indigo-500/30 transition-all placeholder:text-gray-800"
                                required
                            />
                        </div>

                        <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-2xl">
                            <p className="text-[7px] text-gray-600 font-bold uppercase tracking-[0.2em] text-center leading-relaxed">
                                By commissioning your ID, you adhere to the <span className="text-white">Neural_Protocol</span> and <span className="text-white">Terms_of_Engagement</span>.
                            </p>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className={`w-full py-6 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] transition-all relative overflow-hidden ${loading
                                ? 'bg-gray-800 text-gray-500'
                                : 'bg-white text-gray-950 hover:scale-[1.02] active:scale-95 shadow-xl'
                                }`}
                        >
                            <span className="relative z-10">{loading ? 'Committing_Data...' : 'Confirm_Enlistment'}</span>
                            <div className={`absolute inset-0 bg-indigo-500/10 transition-transform duration-[2000ms] ${loading ? 'translate-x-0' : 'translate-x-[-101%]'}`}></div>
                        </button>
                    </form>
                </div>

                <div className="mt-10 text-center text-[9px] font-black text-gray-600 uppercase tracking-widest">
                    Already_Commissioned? <NavLink to="/login" className="text-white hover:text-indigo-400 transition-colors ml-2 italic">AUTHENTICATE_SESSION</NavLink>
                </div>
            </div>

            {/* Termination Notice */}
            <div className="absolute bottom-8 text-[8px] font-black text-gray-800 uppercase tracking-[0.6em] opacity-20 pointer-events-none">
                ENLISTMENT_PORTAL_v8.4.2
            </div>
        </div>
    );
};

export default Signup;
