import React, { useState } from 'react';
import { useHUDDepth } from '../hooks/useHUDDepth';
import { useNeuralHaptics } from '../hooks/useNeuralHaptics';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { useAudioUI } from '../hooks/useAudioUI';

const Mystery = () => {
    const depthRef = useHUDDepth(15);
    const { triggerHeavyHaptic } = useNeuralHaptics();
    const { axp, triggerAreniPulse } = useAuth();
    const { playSuccess } = useAudioUI();
    const [isOpening, setIsOpening] = useState(false);
    const [reward, setReward] = useState(null);

    const handleOpen = () => {
        if (axp < 500) return;
        setIsOpening(true);
        triggerHeavyHaptic();

        setTimeout(() => {
            setIsOpening(false);
            setReward({ type: 'AXP', val: '1,200', name: 'Neural Overload' });
            playSuccess();
            triggerAreniPulse();
        }, 2000);
    };

    return (
        <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Header */}
            <div className="flex flex-col items-center text-center px-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-[1px] bg-yellow-500"></div>
                    <span className="text-[10px] font-black italic text-yellow-500 uppercase tracking-[0.4em]">Secret_Storage_Node</span>
                    <div className="w-4 h-[1px] bg-yellow-500"></div>
                </div>
                <h2 className="text-4xl font-black italic text-white tracking-tighter uppercase leading-none mb-2">Mystery_Vault</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest max-w-[250px]">Decrypt high-tier reward packages using your earned AXP tokens.</p>
            </div>

            {/* Mystery Box HUD */}
            <div
                ref={depthRef}
                className="hud-depth bg-gradient-to-br from-gray-900 to-black border border-white/10 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group mx-auto w-full max-w-sm flex flex-col items-center"
            >
                <div className={`absolute inset-0 bg-gradient-to-t from-yellow-500/10 to-transparent transition-opacity ${isOpening ? 'opacity-100' : 'opacity-0'}`}></div>

                <div className={`relative mb-12 transition-all duration-700 ${isOpening ? 'scale-110 rotate-[360deg] blur-sm' : 'hover:scale-105'}`}>
                    <div className="w-40 h-40 bg-gray-950 rounded-[3rem] border-2 border-yellow-500/30 flex items-center justify-center text-7xl shadow-[0_0_60px_rgba(234,179,8,0.2)]">
                        {reward ? '🎁' : '📦'}
                    </div>
                    {!isOpening && !reward && (
                        <div className="absolute -top-4 -right-4 bg-yellow-500 text-gray-900 text-[10px] font-black px-4 py-1.5 rounded-full shadow-xl animate-bounce">
                            LOCKED
                        </div>
                    )}
                </div>

                {reward ? (
                    <div className="text-center animate-in zoom-in duration-500">
                        <div className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.4em] mb-2">Reward_Decrypted</div>
                        <h3 className="text-3xl font-black italic text-white tracking-tighter uppercase mb-2">{reward.name}</h3>
                        <div className="text-xl font-black text-white font-mono mb-8">+{reward.val} {reward.type}</div>
                        <button
                            onClick={() => setReward(null)}
                            className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors"
                        >
                            Return_to_Vault
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-6 w-full relative z-10">
                        <div className="flex flex-col items-center">
                            <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Decryption_Cost</span>
                            <span className="text-xl font-black text-white italic tracking-widest">500 AXP</span>
                        </div>

                        <button
                            onClick={handleOpen}
                            disabled={isOpening || axp < 500}
                            className={`w-full py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] transition-all relative overflow-hidden ${isOpening
                                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                    : 'bg-white text-gray-950 hover:scale-105 active:scale-95 shadow-xl disabled:opacity-20'
                                }`}
                        >
                            <span className="relative z-10">{isOpening ? 'Decrypting...' : 'Initiate_Unlock'}</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Odds Footer */}
            <div className="bg-white/5 border border-white/5 p-6 rounded-3xl opacity-50 text-center">
                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Rarity_Drop_Rates</span>
                <div className="flex justify-center gap-6 mt-3">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400">Common</span>
                        <span className="text-[8px] font-bold text-gray-600">70%</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-indigo-400">Rare</span>
                        <span className="text-[8px] font-bold text-gray-600">25%</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-yellow-500">Elite</span>
                        <span className="text-[8px] font-bold text-gray-600">5%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Mystery;
