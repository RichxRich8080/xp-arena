import React, { useState } from 'react';
import { useHUDDepth } from '../hooks/useHUDDepth';
import { useNeuralHaptics } from '../hooks/useNeuralHaptics';
import { useAreni } from '../context/AreniContext';
import { useNavigate } from 'react-router-dom';

const Submit = () => {
    const depthRef = useHUDDepth(10);
    const { triggerHeavyHaptic } = useNeuralHaptics();
    const { showAreniAlert } = useAreni();
    const navigate = useNavigate();
    const [isUploading, setIsUploading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsUploading(true);
        triggerHeavyHaptic();

        setTimeout(() => {
            setIsUploading(false);
            showAreniAlert('Clip Submitted for Verification!', 'success');
            navigate('/clips');
        }, 2000);
    };

    return (
        <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-right-5 duration-700">
            {/* Header */}
            <div className="flex flex-col items-center text-center px-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-[1px] bg-red-500"></div>
                    <span className="text-[10px] font-black italic text-red-500 uppercase tracking-[0.4em]">Content_Submission_Node</span>
                    <div className="w-4 h-[1px] bg-red-500"></div>
                </div>
                <h2 className="text-4xl font-black italic text-white tracking-tighter uppercase leading-none mb-2">Submit_Highlight</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest max-w-[250px]">Upload your mechanical highlights to earn AXP and global recognition.</p>
            </div>

            {/* Submission Form */}
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6"
            >
                {/* Upload Area */}
                <div
                    ref={depthRef}
                    className="hud-depth group relative overflow-hidden bg-gray-950/40 border-2 border-dashed border-white/5 p-12 rounded-[3.5rem] flex flex-col items-center justify-center text-center hover:border-red-500/30 transition-all cursor-pointer min-h-[240px]"
                >
                    <div className="absolute inset-0 bg-red-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                    <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">📁</div>
                    <h4 className="text-sm font-black text-white uppercase italic tracking-widest relative z-10">Select_Video_File</h4>
                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-2 relative z-10">MP4, MOV | Max 50MB | 1080p+ Preferred</p>
                </div>

                {/* Meta Inputs */}
                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-gray-950/40 border border-white/5 p-6 rounded-[2rem] flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-1">Clip_Title</label>
                            <input
                                type="text"
                                placeholder="Enter_Catchy_Name"
                                className="bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-xs text-white uppercase font-black italic tracking-tighter placeholder:text-gray-700 outline-none focus:border-red-500/30 transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-1">Category</label>
                                <select className="bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-[10px] text-white uppercase font-black italic tracking-tighter outline-none appearance-none">
                                    <option>Clutch</option>
                                    <option>Headshot</option>
                                    <option>Movement</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-1">Visibility</label>
                                <div className="px-5 py-4 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black text-indigo-400 italic">PUBLIC</div>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isUploading}
                    className={`w-full py-6 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.4em] transition-all relative overflow-hidden ${isUploading
                            ? 'bg-gray-800 text-gray-500'
                            : 'bg-white text-gray-950 hover:scale-105 active:scale-95 shadow-xl'
                        }`}
                >
                    <span className="relative z-10">{isUploading ? 'Uploading_Bypass...' : 'Transmit_Data'}</span>
                    <div className={`absolute inset-0 bg-red-500/10 transition-transform duration-[2000ms] ${isUploading ? 'translate-x-0' : 'translate-x-[-101%]'}`}></div>
                </button>
            </form>

            <div className="bg-red-500/5 border border-red-500/10 p-5 rounded-2xl opacity-50">
                <div className="flex items-center gap-3 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    <span className="text-[8px] font-black text-red-400 uppercase tracking-widest">Legal_Verification</span>
                </div>
                <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest leading-relaxed">By submitting, you grant Areni Network universal rights to feature your gameplay in highlights and social broadcast modules.</p>
            </div>
        </div>
    );
};

export default Submit;
