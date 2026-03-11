import React, { useMemo, useEffect, useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { analyzeDifference, calculateEliteSensitivities, getRecoilTips } from '../utils/sensLogic';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import {
    Download, ArrowLeft, Zap, Target, Cpu, Wifi,
    Crown, ShieldCheck, Share2, Info, ChevronRight, Check, Copy, Sparkles as SparklesIcon
} from 'lucide-react';
import { saveSetup } from '../utils/storage';
import { SFX } from '../utils/sfx';
import { Sparkles, Burst } from '../components/ui/Particles';
import { cn } from '../utils/cn';

export default function EliteResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const { addAXP } = useAuth();
    const { addNotification } = useNotifications();
    const [isRevealed, setIsRevealed] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const { formData, reference } = location.state || {};

    // Calculate elite settings
    const results = useMemo(() => {
        if (!formData) return null;
        return calculateEliteSensitivities(formData);
    }, [formData]);

    const whyAnalysis = useMemo(() => {
        if (!formData || !results) return null;
        return analyzeDifference(formData.currentSens, results.general);
    }, [formData, results]);

    const recoilTips = useMemo(() => {
        if (!formData) return [];
        return getRecoilTips(formData.playStyle, formData.chipset);
    }, [formData]);

    useEffect(() => {
        if (!reference || !formData) return;

        // Peak Reveal Sequence
        const timer = setTimeout(() => {
            setIsRevealed(true);
            SFX.play('levelUp'); // More premium sound for Elite
            addAXP(100); // 10x reward for Elite Forge
        }, 300);

        return () => clearTimeout(timer);
    }, [reference, formData, addAXP]);

    if (!reference || !formData || !results) {
        return <Navigate to="/generate-sensitivity" />;
    }

    const sensItems = [
        { key: 'general', label: 'General', color: 'from-axp-gold to-white' },
        { key: 'redDot', label: 'Red Dot', color: 'from-axp-gold to-yellow-600' },
        { key: 'scope2x', label: '2x Scope', color: 'from-axp-gold to-orange-500' },
        { key: 'scope4x', label: '4x Scope', color: 'from-axp-gold to-red-600' },
        { key: 'awmScope', label: 'AWM Scope', color: 'from-white to-gray-400' },
        { key: 'freeLook', label: 'Free Look', color: 'from-axp-gold to-white' },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-slide-in">
            {/* Elite Header Banner */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/generate-sensitivity')}
                    className="flex items-center gap-2 text-gray-500 hover:text-axp-gold transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-[2px]">Back to Engine</span>
                </button>
                <div className="flex items-center gap-2 bg-axp-gold/10 border border-axp-gold/30 px-3 py-1 rounded-full">
                    <Crown className="w-3 h-3 text-axp-gold" />
                    <span className="text-[10px] font-black text-axp-gold uppercase tracking-widest italic">Elite Audit Verified</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* 1. The Elite Card (3/5 Columns) */}
                <div className="lg:col-span-3 space-y-6">
                    <div className={cn(
                        "relative group transition-all duration-1000",
                        isRevealed ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95"
                    )}>
                        <Burst active={isRevealed} />
                        <div className="absolute -inset-1 bg-gradient-to-r from-axp-gold via-white to-axp-gold rounded-[2rem] blur opacity-40 group-hover:opacity-70 transition duration-1000 animate-pulse"></div>

                        <Card glass className="relative bg-[#0b0f1a] border-axp-gold/40 p-0 overflow-hidden shadow-2xl rounded-[2rem]">
                            <div className="scanline"></div>
                            <Sparkles count={30} color="bg-axp-gold/30" />

                            {/* Card Header */}
                            <div className="p-8 border-b border-axp-gold/20 relative bg-gradient-to-br from-gray-900 to-black">
                                <div className="absolute top-0 right-0 p-8 opacity-10 font-black italic text-5xl text-axp-gold">ELITE</div>

                                <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-4">
                                    Hardware <span className="text-axp-gold text-glow-gold">Mastery</span>
                                </h2>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                                        <Cpu className="w-5 h-5 text-axp-gold" />
                                        <div className="space-y-0.5">
                                            <div className="text-[8px] font-black text-gray-500 uppercase">Processor</div>
                                            <div className="text-[10px] font-black text-white uppercase">{formData.chipset}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                                        <Target className="w-5 h-5 text-axp-gold" />
                                        <div className="space-y-0.5">
                                            <div className="text-[8px] font-black text-gray-500 uppercase">Precision</div>
                                            <div className="text-[10px] font-black text-white uppercase">{formData.dpi} DPI</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Values Grid */}
                            <div className="p-8 grid grid-cols-2 gap-8 bg-black/40">
                                {sensItems.map(item => (
                                    <div key={item.key} className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                                            <span className="text-2xl font-black text-white italic tracking-tighter text-glow-gold">{results[item.key]}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden border border-white/5">
                                            <div
                                                className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out`}
                                                style={{ width: `${(results[item.key] / 200) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Card Footer */}
                            <div className="p-6 bg-axp-gold/5 flex justify-between items-center border-t border-axp-gold/20">
                                <div className="space-y-1">
                                    <span className="text-[8px] font-black text-axp-gold/60 uppercase tracking-widest">Elite Signature</span>
                                    <div className="text-xs font-mono font-black text-white tracking-widest">XP-ARENA-ELITE-V22</div>
                                </div>
                                <div className="text-right">
                                    <ShieldCheck className="w-6 h-6 text-axp-gold ml-auto mb-1 animate-pulse" />
                                    <div className="text-[8px] font-black text-gray-500 uppercase">Verified Audit</div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Elite Actions */}
                    <div className="grid grid-cols-3 gap-4">
                        <Button variant="secondary" className="bg-gray-900/50 border-gray-800 text-[10px] font-black gap-2 h-14">
                            <Download className="w-4 h-4 text-axp-gold" /> DOWNLOAD HD
                        </Button>
                        <Button
                            variant="secondary"
                            className={cn(
                                "bg-gray-900/50 border-gray-800 text-[10px] font-black gap-2 h-14 transition-all",
                                isSaved && "border-neon-green text-neon-green"
                            )}
                            onClick={() => {
                                if (isSaved) return;
                                saveSetup({ formData, results, type: 'Elite' });
                                setIsSaved(true);
                                addNotification('Elite Preset Saved', '+200 AXP Claimed!', 'success');
                            }}
                        >
                            <Check className={cn("w-4 h-4", isSaved ? "text-neon-green" : "text-axp-gold")} /> {isSaved ? 'SAVED' : 'SAVE CLOUD'}
                        </Button>
                        <Button
                            variant="secondary"
                            className={cn(
                                "bg-gray-900/50 border-gray-800 text-[10px] font-black gap-2 h-14 transition-all",
                                isCopied && "border-axp-gold text-axp-gold"
                            )}
                            onClick={() => {
                                navigator.clipboard.writeText(JSON.stringify(results));
                                setIsCopied(true);
                                addNotification('Copied', 'Elite Settings on clipboard', 'info');
                                setTimeout(() => setIsCopied(false), 2000);
                            }}
                        >
                            <Copy className="w-4 h-4 text-axp-gold" /> COPY ALL
                        </Button>
                    </div>
                </div>

                {/* 2. Recoil Mastery Sidebar (2/5 Columns) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-axp-gold" />
                        <h2 className="font-black text-white uppercase tracking-[3px] text-xs underline decoration-axp-gold/30 underline-offset-8">Recoil Mastery</h2>
                    </div>

                    <div className="space-y-4">
                        <Card glass className="bg-axp-gold/5 border-axp-gold/30">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-axp-gold/20 flex items-center justify-center shrink-0">
                                    <SparklesIcon className="w-5 h-5 text-axp-gold" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Precision Audit AI</h4>
                                    <p className="text-xs text-gray-400 font-medium italic leading-relaxed">
                                        {whyAnalysis}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {recoilTips.map((tip, i) => (
                            <Card key={i} glass className="bg-white/5 border-white/10 group hover:border-axp-gold/50 transition-colors">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-axp-gold/20 flex items-center justify-center text-axp-gold font-black italic">0{i + 1}</div>
                                        <h4 className="font-black text-white uppercase text-xs tracking-widest">{tip.title}</h4>
                                    </div>
                                    <p className="text-[11px] text-gray-400 font-medium leading-relaxed italic">{tip.text}</p>
                                </div>
                            </Card>
                        ))}

                        <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 relative group overflow-hidden">
                            <div className="absolute inset-0 bg-axp-gold/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10 flex gap-4">
                                <Info className="w-5 h-5 text-axp-gold shrink-0 mt-1" />
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-white uppercase tracking-widest">DPI Calibration</p>
                                    <p className="text-[9px] text-gray-500 font-medium uppercase leading-normal">
                                        Set your device <strong>Pointer Speed</strong> to exactly 50% in settings for the most accurate translation of these elite values.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
