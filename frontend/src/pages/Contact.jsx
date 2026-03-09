import React, { useState } from 'react';
import { useHUDDepth } from '../hooks/useHUDDepth';
import { useNeuralHaptics } from '../hooks/useNeuralHaptics';
import { useAreni } from '../context/AreniContext';

const Contact = () => {
    const depthRef = useHUDDepth(10);
    const { triggerHeavyHaptic } = useNeuralHaptics();
    const { showAreniAlert } = useAreni();
    const [sending, setSending] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSending(true);
        triggerHeavyHaptic();
        setTimeout(() => {
            setSending(false);
            showAreniAlert('Message Transmitted to Command!', 'success');
        }, 2000);
    };

    return (
        <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-right-5 duration-700">
            {/* Header */}
            <div className="flex flex-col items-center text-center px-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-[1px] bg-indigo-500"></div>
                    <span className="text-[10px] font-black italic text-indigo-400 uppercase tracking-[0.4em]">Neural_Dispatch_Link</span>
                    <div className="w-4 h-[1px] bg-indigo-500"></div>
                </div>
                <h2 className="text-4xl font-black italic text-white tracking-tighter uppercase leading-none mb-2">Contact_Command</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest max-w-[250px]">Open a direct communication channel with the Areni Syndicate architects.</p>
            </div>

            {/* Tactical Form */}
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6"
            >
                <div
                    ref={depthRef}
                    className="hud-depth bg-gray-950/40 border border-white/5 p-8 rounded-[3rem] flex flex-col gap-8 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl pointer-events-none"></div>

                    <div className="flex flex-col gap-5 relative z-10">
                        <div className="flex flex-col gap-2">
                            <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-1">Identity_Handle</label>
                            <input
                                type="text"
                                placeholder="Enter_Operator_Name"
                                required
                                className="bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-xs text-white uppercase font-black italic tracking-tighter outline-none focus:border-indigo-500/30 transition-all placeholder:text-gray-700"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-1">Communication_Topic</label>
                            <select className="bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-[10px] text-white uppercase font-black italic tracking-tighter outline-none appearance-none">
                                <option>Technical_Feedback</option>
                                <option>Partnership_Inquiry</option>
                                <option>Account_Support</option>
                                <option>Bug_Report</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-1">Neural_Message</label>
                            <textarea
                                placeholder="Compose_Your_Message..."
                                required
                                rows={4}
                                className="bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-xs text-white uppercase font-black italic tracking-tighter outline-none focus:border-indigo-500/30 transition-all placeholder:text-gray-700 resize-none"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={sending}
                    className={`w-full py-6 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.4em] transition-all relative overflow-hidden ${sending
                            ? 'bg-gray-800 text-gray-500'
                            : 'bg-white text-gray-950 hover:scale-105 active:scale-95 shadow-xl'
                        }`}
                >
                    <span className="relative z-10">{sending ? 'Transmitting_Data...' : 'Dispatch_Message'}</span>
                    <div className={`absolute inset-0 bg-indigo-500/10 transition-transform duration-[2000ms] ${sending ? 'translate-x-0' : 'translate-x-[-101%]'}`}></div>
                </button>
            </form>

            <div className="bg-white/5 border border-white/5 p-6 rounded-3xl opacity-30 text-center">
                <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest leading-none">Response_Time_Target</span>
                <p className="text-[10px] text-gray-700 font-bold uppercase tracking-widest mt-2 uppercase">Average 2.4 Cycles (Hours)</p>
            </div>
        </div>
    );
};

export default Contact;
