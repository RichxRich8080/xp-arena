import React, { useMemo, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDeviceTier } from '../utils/devices';
import { calculateSensitivities } from '../utils/sensLogic';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Download, Share2, Save, ArrowLeft, Zap, Smartphone, Target, User, Copy, Check, Sparkles, Activity, ShieldAlert, Cpu, ChevronRight, Share } from 'lucide-react';
import { saveSetup } from '../utils/storage';
import { SFX } from '../utils/sfx';
import { Burst } from '../components/ui/Particles';
import { analyzeDifference } from '../utils/sensLogic';
import { cn } from '../utils/cn';

const DiagnosticItem = ({ label, value, color, description }) => (
    <Card className="group relative p-6 border-white/5 bg-slate-900/50 hover:bg-slate-900 transition-all overflow-hidden rounded-2xl">
        <div className={cn("absolute top-0 right-0 w-16 h-16 blur-2xl opacity-[0.05] transition-opacity group-hover:opacity-[0.1]", color.replace('from-', 'bg-').split(' ')[0])} />
        <div className="relative z-10 flex justify-between items-start mb-6">
            <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">{label}</span>
                <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">{description}</span>
            </div>
            <span className="text-3xl font-bold text-white tracking-tight group-hover:text-primary transition-colors">{value}</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
                className={cn("h-full bg-gradient-to-r transition-all duration-1000 ease-out", color)} 
                style={{ width: `${Math.min((value / 120) * 100, 100)}%` }}
            />
        </div>
    </Card>
);

export default function SensitivityResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const { addPoints } = useAuth();
    const { addNotification } = useNotifications();

    const formData = location.state?.formData;

    const results = useMemo(() => {
        if (!formData) return null;
        const tier = getDeviceTier(formData.brand, formData.series, formData.model, formData.ram);
        return calculateSensitivities({
            tier,
            playStyle: formData.playStyle,
            handType: formData.handType,
            screenSize: formData.screenSize
        });
    }, [formData]);

    const [shareCode] = useState(() => `RES-${Math.floor(Math.random() * 90000) + 10000}`);
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
            addPoints(10);
            addNotification('Calibration Complete', 'Your optimized settings are ready.', 'success');
            SFX.play('reveal');
        }
    }, [formData, navigate, addPoints, addNotification]);

    useEffect(() => {
        const timer = setTimeout(() => setIsRevealed(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!results) return null;

    const sensData = [
        { key: 'general', label: 'General', color: 'from-primary to-primary/50', desc: 'Core Sensitivity' },
        { key: 'redDot', label: 'Red Dot', color: 'from-blue-500 to-blue-500/50', desc: 'Close Range' },
        { key: 'scope2x', label: '2X Scope', color: 'from-emerald-500 to-emerald-500/50', desc: 'Mid Range' },
        { key: 'scope4x', label: '4X Scope', color: 'from-amber-500 to-amber-500/50', desc: 'Squad Support' },
        { key: 'awmScope', label: 'Sniper', color: 'from-primary to-emerald-500', desc: 'Elite Precision' },
        { key: 'freeLook', label: 'Free Look', color: 'from-slate-500 to-slate-700', desc: 'Observation' },
    ];

    return (
        <div className="space-y-8 pb-20 animate-fade-in font-sans">
            {/* Header / Nav */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                    onClick={() => navigate('/generate-sensitivity')}
                    className="flex items-center gap-2 text-slate-500 hover:text-white transition-all group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Back to Calibration</span>
                </button>
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
                    <Zap className="w-4 h-4 text-primary animate-pulse" />
                    <span className="text-[10px] font-bold text-primary tracking-widest uppercase">+10 Points Earned</span>
                </div>
            </div>

            {/* Results Header */}
            <div className={cn(
                "relative transition-all duration-1000 space-y-8",
                isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}>
                <Burst active={isRevealed} />
                
                <Card className="p-8 md:p-12 border-white/5 bg-slate-900 shadow-xl relative overflow-hidden rounded-[2rem]">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none select-none">
                        <Target className="w-64 h-64" />
                    </div>

                    <div className="relative z-10 space-y-10">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-white/5 w-fit">
                                    <Activity className="w-3.5 h-3.5 text-primary" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Calibration Report</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight uppercase leading-none">
                                    Results <span className="text-primary">Ready</span>
                                </h1>
                                <p className="text-slate-400 text-sm font-medium max-w-md">
                                    Based on your hardware profile and play style, we've generated the following optimized coefficients.
                                </p>
                            </div>

                            <div className="flex flex-col items-end gap-2 p-6 rounded-2xl bg-slate-800/50 border border-white/5">
                                <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase">Reference ID</span>
                                <span className="text-xl font-bold text-primary tracking-widest uppercase">{shareCode}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-white/5">
                            <div className="space-y-1">
                                <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase block">Device</span>
                                <span className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-2">
                                    <Smartphone className="w-4 h-4 text-primary" /> {formData.brand} {formData.model}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase block">Technique</span>
                                <span className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-2">
                                    <Target className="w-4 h-4 text-primary" /> {formData.playStyle}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase block">Input</span>
                                <span className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-2">
                                    <User className="w-4 h-4 text-primary" /> {formData.handType}
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Values Grid */}
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

                {/* AI Insight */}
                <Card className="p-8 border-primary/10 bg-primary/5 relative overflow-hidden group rounded-2xl">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary shadow-[0_0_20px_rgba(var(--primary),0.5)]" />
                    <div className="flex gap-6 items-start relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <Cpu className="w-5 h-5 text-primary" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <h4 className="text-[10px] font-bold text-white tracking-widest uppercase">System Analysis</h4>
                                <div className="h-px flex-1 bg-white/5" />
                            </div>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed uppercase tracking-tight">
                                {whyAnalysis}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button
                    variant="secondary"
                    className="flex flex-col items-center justify-center gap-4 h-32 bg-slate-900 border-white/5 hover:border-primary/30 rounded-2xl transition-all"
                    onClick={() => addNotification('Export', 'Preparing result image...', 'info')}
                >
                    <Download className="w-6 h-6 text-primary" />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">Save Image</span>
                </Button>

                <Button
                    variant="secondary"
                    className={cn(
                        "flex flex-col items-center justify-center gap-4 h-32 border-white/5 rounded-2xl transition-all",
                        isSaved ? "bg-primary/10 border-primary/20" : "bg-slate-900 hover:border-primary/30"
                    )}
                    onClick={() => {
                        if (isSaved) return;
                        saveSetup({ formData, results, shareCode });
                        setIsSaved(true);
                        addPoints(20);
                        addNotification('Profile Saved', 'Configuration added to your history.', 'success');
                    }}
                >
                    <Save className={cn("w-6 h-6", isSaved ? "text-primary" : "text-slate-500")} />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">
                        {isSaved ? 'Successfully Saved' : 'Save to Profile'}
                    </span>
                </Button>

                <Button
                    variant="secondary"
                    className={cn(
                        "flex flex-col items-center justify-center gap-4 h-32 border-white/5 rounded-2xl transition-all",
                        isCopied ? "bg-primary/10 border-primary/20" : "bg-slate-900 hover:border-primary/30"
                    )}
                    onClick={() => {
                        const copyText = `SETTINGS\nDEVICE: ${formData.brand} ${formData.model}\nID: ${shareCode}\n\nGEN: ${results.general}\nRDS: ${results.redDot}\n2X: ${results.scope2x}\n4X: ${results.scope4x}\nSNP: ${results.awmScope}`;
                        navigator.clipboard.writeText(copyText);
                        setIsCopied(true);
                        addNotification('Copied', 'Values saved to clipboard.', 'success');
                        setTimeout(() => setIsCopied(false), 2000);
                    }}
                >
                    {isCopied ? <Check className="w-6 h-6 text-primary" /> : <Copy className="w-6 h-6 text-slate-500" />}
                    <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">
                        {isCopied ? 'Values Copied' : 'Copy Values'}
                    </span>
                </Button>
            </div>

            {/* Warning */}
            <div className="flex justify-center max-w-2xl mx-auto">
                <div className="rounded-2xl border border-red-500/10 bg-red-500/5 p-6 flex items-center gap-4">
                    <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
                    <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest leading-loose">
                        Note: These settings are strictly calibrated for your system. Using them on different hardware may result in decreased accuracy.
                    </p>
                </div>
            </div>
        </div>
    );
}
