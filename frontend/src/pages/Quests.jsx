import React, { useState } from 'react';
import { useNeuralHaptics } from '../hooks/useNeuralHaptics';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { useAudioUI } from '../hooks/useAudioUI';

const Quests = () => {
    const { triggerLightHaptic, triggerHeavyHaptic } = useNeuralHaptics();
    const { showAreniAlert } = useAuth();
    const { playSuccess, playError } = useAudioUI();

    const [quests] = useState([
        { id: 1, title: "Neural Linkup", desc: "Sync 5 different devices in the engine.", reward: "500 AXP", status: "Active", progress: 0.8, tier: "ELITE", color: "cyan" },
        { id: 2, title: "First Blood", desc: "Get 5 eliminations in a single match.", reward: "200 XP", status: "Active", progress: 0.6, tier: "DAILY", color: "indigo" },
        { id: 3, title: "Sniper Elite", desc: "Land 3 headshots from over 150m.", reward: "500 XP", status: "Active", progress: 0.33, tier: "ELITE", color: "purple" },
        { id: 4, title: "Team Player", desc: "Revive 3 teammates in ranked.", reward: "300 AXP", status: "Completed", progress: 1.0, tier: "SOCIAL", color: "green" },
    ]);

    const handleClaim = (quest) => {
        if (quest.status === 'Completed') {
            triggerHeavyHaptic();
            playSuccess();
            showAreniAlert(`${quest.title} Reward Claimed!`, 'success');
        } else {
            triggerLightHaptic();
            playError();
            showAreniAlert(`Objective: ${quest.title} is still in progress.`, 'error');
        }
    };

    return (
        <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-right-5 duration-700">
            {/* Header */}
            <div className="flex justify-between items-end px-4">
                <div>
                    <h2 className="text-3xl font-black italic text-white tracking-tighter uppercase">Mission_Hub</h2>
                    <p className="text-[9px] font-black text-indigo-400 tracking-[0.4em] uppercase mt-2">Neural Objectives Alpha</p>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-black text-white px-3 py-1 bg-white/5 border border-white/10 rounded-full uppercase italic">Season_01</div>
                </div>
            </div>

            {/* Quest Grid */}
            <div className="flex flex-col gap-4">
                {quests.map((q) => (
                    <div
                        key={q.id}
                        onClick={() => handleClaim(q)}
                        className={`group relative overflow-hidden bg-gray-950/40 backdrop-blur-2xl border transition-all duration-500 rounded-[2.5rem] p-6 cursor-pointer ${q.status === 'Completed'
                                ? 'border-green-500/20 hover:border-green-500/50'
                                : 'border-white/5 hover:border-white/20'
                            }`}
                    >
                        {/* Tier Badge */}
                        <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl text-[8px] font-black tracking-widest uppercase italic transition-all ${q.status === 'Completed' ? 'bg-green-500 text-gray-950' : `bg-gray-800 text-gray-400 group-hover:bg-${q.color}-500 group-hover:text-white`
                            }`}>
                            {q.status === 'Completed' ? 'VERIFIED' : q.tier}
                        </div>

                        <div className="flex items-start gap-6 mb-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 group-hover:scale-110 ${q.status === 'Completed' ? 'bg-green-500/10 border border-green-500/20' : 'bg-white/5 border border-white/10'
                                }`}>
                                {q.status === 'Completed' ? '✅' : '🎯'}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-black text-white uppercase italic tracking-tight mb-1">{q.title}</h3>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight leading-relaxed max-w-[80%]">{q.desc}</p>
                            </div>
                        </div>

                        {/* Progress HUD */}
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-2 bg-gray-900 rounded-full overflow-hidden relative">
                                <div
                                    className={`absolute inset-0 bg-white/5 group-hover:bg-${q.color}-500/10 transition-colors`}
                                />
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,255,255,0.2)] ${q.status === 'Completed' ? 'bg-green-500' : `bg-${q.color}-500`
                                        }`}
                                    style={{ width: `${q.progress * 100}%` }}
                                />
                            </div>
                            <div className="w-12 text-right">
                                <span className={`text-[10px] font-mono font-black ${q.status === 'Completed' ? 'text-green-400' : 'text-white'}`}>
                                    {Math.floor(q.progress * 100)}%
                                </span>
                            </div>
                        </div>

                        {/* Reward Bar */}
                        <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-yellow-400/20 border border-yellow-400/50 flex items-center justify-center text-[8px]">💎</div>
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Reward Package</span>
                            </div>
                            <div className="text-xs font-black italic text-white tracking-widest">{q.reward}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Analytics Summary */}
            <div className="bg-white/5 border border-white/10 p-5 rounded-3xl flex items-center justify-between opacity-50 contrast-125">
                <div className="flex flex-col">
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Total XP Earned</span>
                    <span className="text-xl font-bold font-mono text-white tracking-tighter">42,500</span>
                </div>
                <div className="h-8 w-[1px] bg-white/10"></div>
                <div className="flex flex-col text-right">
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Completion Rate</span>
                    <span className="text-xl font-bold font-mono text-cyan-400 tracking-tighter">14.2%</span>
                </div>
            </div>
        </div>
    );
};

export default Quests;
