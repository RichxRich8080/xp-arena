import React from 'react';
import { useHUDDepth } from '../hooks/useHUDDepth';
import { useNeuralHaptics } from '../hooks/useNeuralHaptics';

const FAQNode = ({ question, answer }) => (
    <div className="bg-gray-950/40 border border-white/5 p-6 rounded-[2rem] group hover:border-cyan-500/30 transition-all cursor-pointer">
        <div className="flex items-center gap-4 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
            <h4 className="text-[11px] font-black text-white uppercase italic tracking-tight group-hover:text-cyan-400 transition-colors uppercase">{question}</h4>
        </div>
        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed ml-5">{answer}</p>
    </div>
);

const Support = () => {
    const depthRef = useHUDDepth(10);
    const { triggerLightHaptic } = useNeuralHaptics();

    return (
        <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Header */}
            <div className="flex flex-col items-center text-center px-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-[1px] bg-cyan-500"></div>
                    <span className="text-[10px] font-black italic text-cyan-400 uppercase tracking-[0.4em]">Neural_Support_Node</span>
                    <div className="w-4 h-[1px] bg-cyan-500"></div>
                </div>
                <h2 className="text-4xl font-black italic text-white tracking-tighter uppercase leading-none mb-2">Help_Center</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest max-w-[250px]">Access tactical documentation and support protocols for the Arena network.</p>
            </div>

            {/* Quick Actions HUD */}
            <div
                ref={depthRef}
                className="hud-depth bg-gray-950/40 border border-white/5 p-8 rounded-[3rem] shadow-2xl space-y-4"
            >
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => triggerLightHaptic()}
                        className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex flex-col items-center gap-3 transition-all hover:bg-white/10 hover:border-cyan-500/30"
                    >
                        <span className="text-2xl">⚡</span>
                        <span className="text-[9px] font-black text-white uppercase tracking-widest leading-none">Quick_Start</span>
                    </button>
                    <button
                        onClick={() => triggerLightHaptic()}
                        className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex flex-col items-center gap-3 transition-all hover:bg-white/10 hover:border-cyan-500/30"
                    >
                        <span className="text-2xl">📑</span>
                        <span className="text-[9px] font-black text-white uppercase tracking-widest leading-none">Docs_Node</span>
                    </button>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center px-4">
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.4em]">Frequenty_Asked</h3>
                    <div className="h-[1px] flex-1 mx-6 bg-white/5"></div>
                </div>

                <div className="flex flex-col gap-4">
                    <FAQNode
                        question="How is AXP calculated?"
                        answer="AXP is derived from match performance, quest completion, and successful neural calibrations within the engine."
                    />
                    <FAQNode
                        question="Is the sensitivity engine legal?"
                        answer="Yes. Our engine uses hardware-level physics and does not modify any game files. It is 100% compliant with major anti-cheats."
                    />
                    <FAQNode
                        question="Can I export my presets?"
                        answer="Presets can be downloaded as encrypted data packets or PNG dossiers for sharing with your syndicate."
                    />
                </div>
            </div>

            {/* Footer Contact */}
            <div className="bg-cyan-500/5 border border-cyan-500/10 p-8 rounded-[3rem] flex flex-col items-center text-center group">
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 text-xl">📧</div>
                <h4 className="text-sm font-black text-white uppercase italic tracking-widest">Still Need Assistance?</h4>
                <p className="text-[9px] text-gray-500 mt-2 max-w-[200px] uppercase font-bold leading-tight mb-6">Open a priority ticket with our lead architects for complex node issues.</p>
                <button className="bg-white text-gray-950 px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Submit_Ticket</button>
            </div>
        </div>
    );
};

export default Support;
