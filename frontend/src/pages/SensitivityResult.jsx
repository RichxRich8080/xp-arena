import React, { useMemo, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDeviceTier } from '../utils/devices';
import { calculateSensitivities } from '../utils/sensLogic';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Download, Share2, Save, ArrowLeft, Zap, Smartphone, Target, User, Copy, Check, Sparkles as SparklesIcon } from 'lucide-react';
import { saveSetup } from '../utils/storage';
import { SFX } from '../utils/sfx';
import { Sparkles, Burst } from '../components/ui/Particles';
import { analyzeDifference } from '../utils/sensLogic';
import { cn } from '../utils/cn';

export default function SensitivityResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const { addAXP } = useAuth();
    const { addNotification } = useNotifications();

    const formData = location.state?.formData;

    // Calculate settings
    const results = useMemo(() => {
        if (!formData) return null;
        const tier = getDeviceTier(formData.brand, formData.model, formData.ram);
        return calculateSensitivities({
            tier,
            playStyle: formData.playStyle,
            handType: formData.handType,
            screenSize: formData.screenSize
        });
    }, [formData]);

    const [shareCode, setShareCode] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isRevealed, setIsRevealed] = useState(false);

    const whyAnalysis = useMemo(() => {
        if (!formData || !results) return null;
        return analyzeDifference(formData.currentSens, results.general);
    }, [formData, results]);

    useEffect(() => {
        if (!formData) {
            navigate('/generate-sensitivity');
        } else {
            // Reward for generation
            addAXP(10);
            addNotification('Optimization Complete', 'You earned +10 AXP for generating sensitivity.', 'axp');

            // Play reveal sounds
            SFX.play('reveal');
            const timer = setTimeout(() => SFX.play('xp'), 800);
            return () => clearTimeout(timer);
        }
    }, [formData, navigate, addAXP, addNotification]);

    useEffect(() => {
        const timer = setTimeout(() => setIsRevealed(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShareCode(`AXP-SENS-${Math.floor(Math.random() * 90000) + 10000}`);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const sensItems = [
        { key: 'general', label: 'General', color: 'from-blue-400 to-cyan-400' },
        { key: 'redDot', label: 'Red Dot', color: 'from-orange-400 to-red-400' },
        { key: 'scope2x', label: '2x Scope', color: 'from-green-400 to-emerald-400' },
        { key: 'scope4x', label: '4x Scope', color: 'from-purple-400 to-indigo-400' },
        { key: 'awmScope', label: 'AWM Scope', color: 'from-yellow-400 to-axp-gold' },
        { key: 'freeLook', label: 'Free Look', color: 'from-gray-300 to-white' },
    ];

    if (!results) return null;

    return (
        <div className="max-w-xl mx-auto space-y-8 pb-12 animate-slide-in">
            {/* Navigation Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/generate-sensitivity')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Back to Forge</span>
                </button>
                <div className="flex items-center gap-2 bg-neon-green/10 border border-neon-green/30 px-3 py-1 rounded-full">
                    <Zap className="w-3 h-3 text-neon-green" />
                    <span className="text-[10px] font-black text-neon-green uppercase">+10 AXP EARNED</span>
                </div>
            </div>

            {/* Main Result Card (High Fidelity) */}
            <div id="sens-card" className={cn(
                "relative group transition-all duration-1000",
                isRevealed ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95"
            )}>
                <Burst active={isRevealed} />
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-blue via-neon-cyan to-neon-green rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>

                <Card glass className="relative bg-[#0b0f1a]/80 border-gray-800 p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-3xl">
                    <div className="scanline opacity-[0.03]"></div>
                    <Sparkles count={15} color="bg-neon-cyan/20" />
                    {/* Card Header Overlay */}
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900/40 p-6 border-b border-gray-800/50 relative">
                        <div className="absolute top-0 right-0 p-6 opacity-5 font-black italic text-4xl">SENS-PRO</div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">
                                Optimized <span className="text-neon-cyan">Settings</span>
                            </h2>

                            <div className="flex flex-wrap gap-4 mt-2">
                                <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                    <Smartphone className="w-3.5 h-3.5 text-neon-cyan" />
                                    {formData.brand} {formData.model}
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest border-l border-gray-700 pl-4">
                                    <Target className="w-3.5 h-3.5 text-axp-gold" />
                                    {formData.playStyle}
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest border-l border-gray-700 pl-4">
                                    <User className="w-3.5 h-3.5 text-neon-green" />
                                    {formData.handType}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Values Grid */}
                    <div className="p-6 grid grid-cols-2 gap-6 bg-gradient-to-b from-gray-900 to-black">
                        {sensItems.map(item => (
                            <div key={item.key} className="space-y-2 group/val">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.label}</span>
                                    <span className="text-xl font-black text-white italic tracking-tighter glow-text">{results[item.key]}</span>
                                </div>
                                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden p-0.5 border border-gray-700">
                                    <div
                                        className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.1)]`}
                                        style={{ width: `${(results[item.key] / 200) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Card Footer */}
                    <div className="p-4 bg-gray-900/50 flex justify-between items-center border-t border-gray-800">
                        <div className="space-y-1">
                            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-1 mb-1 block">Share Code</span>
                            <div className="text-xs font-mono font-bold text-neon-cyan tracking-widest">{shareCode}</div>
                        </div>
                        <div className="text-right">
                            <span className="text-[8px] font-black text-gray-500 uppercase tracking-tighter">Generated by</span>
                            <div className="text-[10px] font-bold text-white tracking-widest">XP ARENA ENGINE v2.0</div>
                        </div>
                    </div>
                </Card>

                {/* AI Optimization Analysis */}
                <Card glass className="mt-6 bg-neon-cyan/5 border-neon-cyan/20">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-neon-cyan/20 flex items-center justify-center shrink-0">
                            <Zap className="w-5 h-5 text-neon-cyan" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Optimization Analysis</h4>
                            <p className="text-xs text-gray-400 font-medium italic leading-relaxed">
                                {whyAnalysis}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-4">
                <Button
                    variant="secondary"
                    className="flex flex-col gap-2 h-20 bg-gray-900/80 border-gray-800 hover:border-neon-cyan"
                    onClick={() => {
                        addNotification('Download', 'Generating high-res image...', 'info');
                    }}
                >
                    <Download className="w-5 h-5 text-neon-cyan" />
                    <span className="text-[10px] font-black tracking-widest border-t border-gray-800 pt-2 w-full uppercase">SAVE IMAGE</span>
                </Button>

                <Button
                    variant="secondary"
                    className={cn(
                        "flex flex-col gap-2 h-20 bg-gray-900/80 border-gray-800 transition-all",
                        isSaved ? "border-neon-green text-neon-green" : "hover:border-neon-green"
                    )}
                    onClick={() => {
                        if (isSaved) return;
                        saveSetup({
                            formData,
                            results,
                            shareCode
                        });
                        setIsSaved(true);
                        addAXP(20);
                        addNotification('Preset Saved', 'Earned +20 AXP! View it in your Profile.', 'success');
                    }}
                >
                    <Save className="w-5 h-5" />
                    <span className="text-[10px] font-black tracking-widest border-t border-gray-800 pt-2 w-full uppercase">
                        {isSaved ? 'SAVED' : 'SAVE PRESET'}
                    </span>
                </Button>

                <Button
                    variant="secondary"
                    className={cn(
                        "flex flex-col gap-2 h-20 bg-gray-900/80 border-gray-800 transition-all",
                        isCopied ? "border-axp-gold text-axp-gold" : "hover:border-axp-gold"
                    )}
                    onClick={() => {
                        const copyText = `XP ARENA SENSITIVITY\nDevice: ${formData.brand} ${formData.model}\nStyle: ${formData.playStyle}\n\nGeneral: ${results.general}\nRed Dot: ${results.redDot}\n2x: ${results.scope2x}\n4x: ${results.scope4x}\nAWM: ${results.awmScope}\nFree Look: ${results.freeLook}\n\nCode: ${shareCode}`;
                        navigator.clipboard.writeText(copyText);
                        setIsCopied(true);
                        addNotification('Copied', 'Settings formatted and copied to clipboard!', 'info');
                        setTimeout(() => setIsCopied(false), 2000);
                    }}
                >
                    {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    <span className="text-[10px] font-black tracking-widest border-t border-gray-800 pt-2 w-full uppercase">
                        {isCopied ? 'COPIED' : 'COPY TO GAME'}
                    </span>
                </Button>
            </div>

            {/* Disclaimer */}
            <p className="text-center text-[10px] text-gray-500 font-medium px-8 italic">
                Values are calculated based on your specific hardware signature. For best results, ensure your device screen is clean and you are using optimized graphic settings.
            </p>
        </div>
    );
}
