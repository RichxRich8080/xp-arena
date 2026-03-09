import React from 'react';
import { useHUDDepth } from '../hooks/useHUDDepth';
import { useNeuralHaptics } from '../hooks/useNeuralHaptics';

const SponsorCard = ({ name, emoji, perk, color }) => (
    <div className={`relative group overflow-hidden bg-gray-950/40 border border-${color}-500/10 p-8 rounded-[3rem] transition-all duration-500 hover:border-${color}-500/30 hover:bg-white/5`}>
        <div className={`absolute -top-12 -right-12 w-32 h-32 bg-${color}-500/5 blur-[60px] rounded-full transition-opacity opacity-50 group-hover:opacity-100`}></div>

        <div className="flex flex-col items-center text-center relative z-10">
            <div className={`w-20 h-20 rounded-[2rem] bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center text-3xl mb-6 shadow-xl transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                {emoji}
            </div>
            <h3 className="text-xl font-black italic text-white tracking-tighter uppercase mb-2 group-hover:text-white transition-colors">{name}</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest max-w-[150px] mb-6">{perk}</p>

            <button className={`w-full py-4 rounded-[1.5rem] bg-${color}-500 text-white text-[9px] font-black uppercase tracking-[0.3em] shadow-lg transition-all hover:scale-105 active:scale-95`}>
                Sync_Node
            </button>
        </div>
    </div>
);

const Sponsors = () => {
    const depthRef = useHUDDepth(10);
    const { triggerLightHaptic } = useNeuralHaptics();

    return (
        <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Header */}
            <div className="flex flex-col items-center text-center px-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-[1px] bg-yellow-500"></div>
                    <span className="text-[10px] font-black italic text-yellow-400 uppercase tracking-[0.4em]">Corporate_Partners_Node</span>
                    <div className="w-4 h-[1px] bg-yellow-500"></div>
                </div>
                <h2 className="text-4xl font-black italic text-white tracking-tighter uppercase leading-none mb-2">Arena_Alliance</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest max-w-[250px]">Engage with premium ecosystem partners to unlock exclusive neural perks.</p>
            </div>

            {/* Sponsor Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SponsorCard name="Neural_Dynamics" emoji="🧠" perk="+20% Synaptic Sync Speed" color="cyan" />
                <SponsorCard name="Areni_Energy" emoji="⚡" perk="Permanent +500 XP Cap" color="yellow" />
                <SponsorCard name="Vanguard_Safe" emoji="🛡️" perk="Encrypted Presets Storage" color="indigo" />
                <SponsorCard name="Titan_Optics" emoji="👓" perk="Enhanced 4x Scope Accuracy" color="red" />
            </div>

            {/* Alliance Info */}
            <div className="bg-white/5 border border-white/5 p-8 rounded-[3rem] opacity-50 text-center">
                <div className="flex flex-col items-center gap-3">
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1 leading-none">Global_Partner_Status</span>
                    <h4 className="text-sm font-black text-white uppercase italic tracking-widest">Active_Strategic_Alliance</h4>
                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-[300px] mt-2">All partnership rewards are synchronized with your global bio-signature and persist across all competitive titles.</p>
                </div>
            </div>
        </div>
    );
};

export default Sponsors;
