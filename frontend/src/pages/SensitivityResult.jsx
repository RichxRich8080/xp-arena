import React, { useMemo, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDeviceTier } from '../utils/devices';
import { calculateSensitivities } from '../utils/sensLogic';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Download, Share2, Save, ArrowLeft, Zap, Smartphone, Target, User, Copy, Check, Sparkles, Activity, ShieldAlert, Cpu } from 'lucide-react';
import { saveSetup } from '../utils/storage';
import { SFX } from '../utils/sfx';
import { Burst } from '../components/ui/Particles';
import { analyzeDifference } from '../utils/sensLogic';
import { cn } from '../utils/cn';

const DiagnosticItem = ({ label, value, color, description }) => (
    <div className="group relative p-6 glass-panel border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all overflow-hidden">
        <div className={cn("absolute top-0 right-0 w-16 h-16 blur-2xl opacity-[0.05] transition-opacity group-hover:opacity-[0.1]", color.replace('from-', 'bg-').split(' ')[0])} />
        <div className="relative z-10 flex justify-between items-start mb-6">
            <div className="space-y-1">
                <span className="text-[9px] font-display font-black text-gray-500 uppercase tracking-[0.2em] block">{label}</span>
                <span className="text-[8px] font-display font-bold text-gray-600 uppercase tracking-widest">{description}</span>
            </div>
            <span className="text-3xl font-display font-black text-white italic tracking-tighter opacity-80 group-hover:opacity-100 transition-opacity">{value}</span>
        </div>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
                className={cn("h-full bg-gradient-to-r transition-all duration-1000 delay-300", color)} 
                style={{ width: `${(value / 200) * 100}%` }}
            />
        </div>
    </div>
);

export default function SensitivityResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const { addAXP } = useAuth();
    const { addNotification } = useNotifications();

    const formData = location.state?.formData;

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
            addAXP(10);
            addNotification('Optimization Verified', 'Coefficients exported to dossier.', 'success');
            SFX.play('reveal');
        }
    }, [formData, navigate, addAXP, addNotification]);

    useEffect(() => {
        const timer = setTimeout(() => setIsRevealed(true), 100);
        setShareCode(`ARC-${Math.floor(Math.random() * 90000) + 10000}`);
        return () => clearTimeout(timer);
    }, []);

    if (!results) return null;

    const sensData = [
        { key: 'general', label: 'GENERAL_PNT', color: 'from-accent-cyan to-accent-cyan/50', desc: 'CORE_LATENCY_BASE' },
        { key: 'redDot', label: 'RDS_OPTIC', color: 'from-accent-rose to-accent-rose/50', desc: 'SHORT_RANGE_ACQ' },
        { key: 'scope2x', label: '2X_ZOOM', color: 'from-accent-green to-accent-green/50', desc: 'MID_RANGE_PREC' },
        { key: 'scope4x', label: '4X_ACOG', color: 'from-axp-gold to-axp-gold/50', desc: 'SQUAD_SUPPORT_AXIS' },
        { key: 'awmScope', label: 'ELITE_SNIPER', color: 'from-accent-cyan to-accent-green', desc: 'EXTREME_ACURRACY' },
        { key: 'freeLook', label: 'SITU_AWARE', color: 'from-gray-400 to-gray-600', desc: 'VISUAL_SWEEP_RESTART' },
    ];

    return (
        <div className="space-y-12 pb-20 animate-slide-in font-display">
            {/* Nav Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/generate-sensitivity')}
                    className="flex items-center gap-4 text-gray-500 hover:text-white transition-all group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">RECALIBRATE_FORGE</span>
                </button>
                <div className="flex items-center gap-4 px-6 py-2 glass-panel border-white/5 bg-accent-green/5">
                    <Zap className="w-4 h-4 text-accent-green animate-pulse" />
                    <span className="text-[10px] font-black text-accent-green tracking-[0.2em]">+10_AXP_ALLOCATED</span>
                </div>
            </div>

            {/* Main Diagnostic Report */}
            <div className={cn(
                "relative transition-all duration-1000 space-y-8",
                isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            )}>
                <Burst active={isRevealed} />
                
                {/* DIAGNOSTIC HEADER */}
                <div className="glass-panel p-10 md:p-12 border-white/5 relative overflow-hidden backdrop-blur-3xl">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] font-black text-8xl italic select-none pointer-events-none uppercase">
                        SENS_DATA
                    </div>

                    <div className="relative z-10 space-y-10">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <Activity className="w-5 h-5 text-accent-cyan" />
                                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Neural_Output_Report</h3>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
                                    OPTIMIZED <span className="text-accent-cyan">RESULTS</span>
                                </h1>
                            </div>

                            <div className="flex flex-col items-end gap-2 p-6 glass-panel border-white/5 bg-white/[0.02]">
                                <span className="text-[8px] font-black text-gray-500 tracking-[0.3em] uppercase">VALIDATION_CODE</span>
                                <span className="text-xl font-black text-accent-cyan italic tracking-[0.2em] uppercase">{shareCode}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-10 pt-10 border-t border-white/5">
                            <div className="space-y-1">
                                <span className="text-[8px] font-black text-gray-600 tracking-[0.3em] uppercase block">TERMINAL_SIGNATURE</span>
                                <span className="text-[11px] font-black text-white italic uppercase tracking-widest flex items-center gap-2">
                                    <Smartphone className="w-3 h-3 text-accent-cyan text-gray-500" /> {formData.brand} {formData.model}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[8px] font-black text-gray-600 tracking-[0.3em] uppercase block">COMBAT_TIER</span>
                                <span className="text-[11px] font-black text-white italic uppercase tracking-widest flex items-center gap-2">
                                    <Target className="w-3 h-3 text-accent-cyan text-gray-500" /> {formData.playStyle}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[8px] font-black text-gray-600 tracking-[0.3em] uppercase block">KINETIC_LINK</span>
                                <span className="text-[11px] font-black text-white italic uppercase tracking-widest flex items-center gap-2">
                                    <User className="w-3 h-3 text-accent-cyan text-gray-500" /> {formData.handType}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* VALUES GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sensData.map(item => (
                        <DiagnosticItem 
                            key={item.key} 
                            label={item.label} 
                            value={results[item.key]} 
                            color={item.color} 
                            description={item.desc} 
                        />
                    ))}
                </div>

                {/* AI ANALYSIS MODULE */}
                <Card className="p-8 border-accent-cyan/10 bg-accent-cyan/[0.02] relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-accent-cyan shadow-[0_0_20px_rgba(6,182,212,0.5)]" />
                    <div className="flex gap-8 items-start relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-accent-cyan/10 flex items-center justify-center shrink-0 border border-accent-cyan/20 group-hover:scale-110 transition-transform">
                            <Cpu className="w-6 h-6 text-accent-cyan" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <h4 className="text-[10px] font-black text-white tracking-[0.3em] uppercase">SYSTEM_ANALYSIS_SYNC</h4>
                                <div className="h-1px flex-1 bg-white/5" />
                            </div>
                            <p className="text-xs text-gray-400 font-bold italic leading-relaxed uppercase tracking-tighter">
                                {whyAnalysis}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* ACTION GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Button
                    variant="ghost"
                    className="group flex flex-col items-center justify-center gap-6 h-32 border-white/5 bg-white/[0.02] hover:bg-accent-cyan/5 hover:border-accent-cyan/20 rounded-[2rem] transition-all"
                    onClick={() => addNotification('Analysis', 'Exporting diagnostic image...', 'info')}
                >
                    <Download className="w-6 h-6 text-accent-cyan transition-transform group-hover:-translate-y-1" />
                    <span className="text-[9px] font-black tracking-[0.4em] uppercase text-gray-500 group-hover:text-white">EXPORT_REPORT</span>
                </Button>

                <Button
                    variant="ghost"
                    className={cn(
                        "group flex flex-col items-center justify-center gap-6 h-32 border-white/5 bg-white/[0.02] rounded-[2rem] transition-all",
                        isSaved ? "bg-accent-green/5 border-accent-green/20" : "hover:bg-accent-green/5 hover:border-accent-green/20"
                    )}
                    onClick={() => {
                        if (isSaved) return;
                        saveSetup({ formData, results, shareCode });
                        setIsSaved(true);
                        addAXP(20);
                        addNotification('Core Updated', 'Allocated session data to local dossier.', 'success');
                    }}
                >
                    <Save className={cn("w-6 h-6 transition-transform group-hover:-translate-y-1", isSaved ? "text-accent-green" : "text-gray-500 group-hover:text-white")} />
                    <span className="text-[9px] font-black tracking-[0.4em] uppercase text-gray-500 group-hover:text-white">
                        {isSaved ? 'DATALINK_SECURED' : 'SECURE_DOU_PRESET'}
                    </span>
                </Button>

                <Button
                    variant="ghost"
                    className={cn(
                        "group flex flex-col items-center justify-center gap-6 h-32 border-white/5 bg-white/[0.02] rounded-[2rem] transition-all",
                        isCopied ? "bg-axp-gold/5 border-axp-gold/20" : "hover:bg-axp-gold/5 hover:border-axp-gold/20"
                    )}
                    onClick={() => {
                        const copyText = `XP ARENA GENESIS\nDEVICE: ${formData.brand} ${formData.model}\nVAL_CODE: ${shareCode}\n\nGEN: ${results.general}\nRDS: ${results.redDot}\n2X: ${results.scope2x}\n4X: ${results.scope4x}\nELT: ${results.awmScope}`;
                        navigator.clipboard.writeText(copyText);
                        setIsCopied(true);
                        addNotification('Sync Successful', 'Values mapped to tactical clipboard.', 'success');
                        setTimeout(() => setIsCopied(false), 2000);
                    }}
                >
                    {isCopied ? <Check className="w-6 h-6 text-axp-gold" /> : <Copy className="w-6 h-6 text-gray-500 group-hover:text-white transition-transform group-hover:-translate-y-1" />}
                    <span className="text-[9px] font-black tracking-[0.4em] uppercase text-gray-500 group-hover:text-white">
                        {isCopied ? 'SYNCED_NODE' : 'COPY_COEFFICIENTS'}
                    </span>
                </Button>
            </div>

            {/* Global Warning */}
            <div className="flex justify-center px-12">
                <div className="glass-panel border-accent-rose/10 bg-accent-rose/5 p-6 flex items-center gap-6 max-w-lg">
                    <ShieldAlert className="w-6 h-6 text-accent-rose shrink-0" />
                    <p className="text-[9px] text-accent-rose font-display font-black uppercase tracking-widest leading-relaxed">
                        WARNING: Neural alignment is strictly calibrated to your specific terminal signature. Diverging hardware may result in combat latency or accuracy loss.
                    </p>
                </div>
            </div>
        </div>
    );
}
