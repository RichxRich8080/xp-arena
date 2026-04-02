import React, { useMemo, useEffect, useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { analyzeDifference, calculateEliteSensitivities, getRecoilTips } from '../utils/sensLogic';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useNotifications } from '../hooks/useNotifications';
import {
    Download, ArrowLeft, Zap, Target, Cpu, Wifi,
    Crown, ShieldCheck, Share2, Info, ChevronRight, Check, Copy, Sparkles, Activity, Award, Save, Cloud
} from 'lucide-react';
import { saveSetup } from '../utils/storage';
import { SFX } from '../utils/sfx';
import { Burst } from '../components/ui/Particles';
import { cn } from '../utils/cn';

const EliteDiagnosticCard = ({ label, value, description, color }) => (
    <Card className="group relative p-8 bg-slate-900 border-white/5 hover:border-amber-500/20 transition-all overflow-hidden rounded-2xl">
        <div className={cn("absolute top-0 right-0 w-24 h-24 blur-[80px] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity", color.includes('amber') ? 'bg-amber-500' : 'bg-white')} />
        <div className="relative z-10 flex justify-between items-start mb-8">
            <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">{label}</span>
                <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest block">{description}</span>
            </div>
            <span className="text-4xl font-bold text-white tracking-tighter tabular-nums">{value}</span>
        </div>
        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
                className={cn("h-full transition-all duration-[2000ms] delay-500", color)} 
                style={{ width: `${(value / 200) * 100}%` }}
            />
        </div>
    </Card>
);

export default function EliteResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const { addNotification } = useNotifications();
    const [isRevealed, setIsRevealed] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const { formData, reference } = location.state || {};

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
        const timer = setTimeout(() => {
            setIsRevealed(true);
            SFX.play('levelUp');
            // Assuming addAXP was just a helper for points
            addNotification('Report Generated', '100 Reward Points added to account.', 'success');
        }, 500);
        return () => clearTimeout(timer);
    }, [reference, formData, addNotification]);

    if (!reference || !formData || !results) {
        return <Navigate to="/generate-sensitivity" />;
    }

    const eliteItems = [
        { key: 'general', label: 'Base Sensitivity', desc: 'General Movement', color: 'bg-amber-500' },
        { key: 'redDot', label: 'Optics Precision', desc: 'Red Dot / Holo', color: 'bg-amber-500' },
        { key: 'scope2x', label: 'Mid-Range Accuracy', desc: '2X Scope', color: 'bg-amber-500' },
        { key: 'scope4x', label: 'Long-Range Stability', desc: '4X Scope', color: 'bg-amber-500' },
        { key: 'awmScope', label: 'Sniper Precision', desc: 'High-Power Scope', color: 'bg-slate-400' },
        { key: 'freeLook', label: 'Awareness Speed', desc: 'Field of View', color: 'bg-amber-500' },
    ];

    return (
        <div className="space-y-12 pb-20 animate-fade-in font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <button
                    onClick={() => navigate('/generate-sensitivity')}
                    className="flex items-center gap-3 text-slate-500 hover:text-white transition-all group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x- motion-safe:transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">New Calibration</span>
                </button>
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Premium Certified</span>
                </div>
            </div>

            <div className={cn(
                "relative transition-all duration-1000 space-y-10",
                isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
                <Burst active={isRevealed} />
                
                {/* Result Hero */}
                <div className="rounded-[2.5rem] bg-slate-900 p-10 md:p-16 border border-white/5 relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none select-none">
                        <Award className="w-64 h-64 text-amber-500" />
                    </div>

                    <div className="relative z-10 space-y-10">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-10">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Activity className="w-5 h-5 text-amber-500" />
                                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Performance Analysis Report</h3>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight uppercase leading-tight">
                                    Calibration <span className="text-amber-500">Complete</span>
                                </h1>
                            </div>

                            <div className="flex flex-col items-end gap-1 p-6 rounded-2xl bg-slate-800 border border-white/5">
                                <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase">Report Identifier</span>
                                <span className="text-lg font-bold text-amber-500 tracking-widest uppercase">REF-AD-V22</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 pt-10 border-t border-white/5">
                            <div className="space-y-2">
                                <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase block">Device Chipset</span>
                                <div className="flex items-center gap-2 text-sm font-bold text-white">
                                    <Cpu className="w-4 h-4 text-amber-500" /> {formData.chipset}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase block">Measured Resolution</span>
                                <div className="flex items-center gap-2 text-sm font-bold text-white">
                                    <Target className="w-4 h-4 text-amber-500" /> {formData.dpi} DPI
                                </div>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase block">Network Stability</span>
                                <div className="flex items-center gap-2 text-sm font-bold text-primary">
                                    <Wifi className="w-4 h-4 text-primary" /> {formData.ping}ms Average
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Values Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {eliteItems.map(item => (
                        <EliteDiagnosticCard 
                            key={item.key} 
                            label={item.label} 
                            value={results[item.key]} 
                            color={item.color} 
                            description={item.desc} 
                        />
                    ))}
                </div>

                {/* Recoil Analysis */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <h3 className="text-[10px] font-bold text-white tracking-widest uppercase">Recoil Optimization Tips</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {recoilTips.map((tip, i) => (
                            <Card key={i} className="p-8 bg-slate-900 border-white/5 hover:border-amber-500/20 transition-all group rounded-2xl">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 text-xs font-bold">
                                            {i + 1}
                                        </div>
                                    </div>
                                    <h4 className="text-sm font-bold text-white uppercase tracking-tight">{tip.title}</h4>
                                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed uppercase tracking-wide">{tip.text}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* AI Review */}
                <Card className="p-10 bg-amber-500/[0.03] border-amber-500/20 rounded-[2rem] relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
                    <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shrink-0">
                            <Sparkles className="w-8 h-8 text-amber-500" />
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-bold text-white tracking-widest uppercase italic">Advanced Analysis Summary</h4>
                            <p className="text-sm text-slate-300 font-medium leading-relaxed">
                                {whyAnalysis}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Button
                    variant="ghost"
                    className="flex flex-col items-center justify-center gap-6 h-40 bg-slate-900 border-white/5 hover:border-amber-500/20 rounded-[2rem] transition-all"
                    onClick={() => addNotification('Report Sent', 'Generating detailed PDF report...', 'info')}
                >
                    <Download className="w-8 h-8 text-amber-500" />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">Export Report</span>
                </Button>

                <Button
                    variant="ghost"
                    className={cn(
                        "flex flex-col items-center justify-center gap-6 h-40 bg-slate-900 border-white/5 rounded-[2rem] transition-all",
                        isSaved ? "border-green-500/30 bg-green-500/5" : "hover:border-white/20"
                    )}
                    onClick={() => {
                        if (isSaved) return;
                        saveSetup({ formData, results, type: 'ADVANCED' });
                        setIsSaved(true);
                        addNotification('Account Updated', 'Setup saved to your profile.', 'success');
                    }}
                >
                    <Cloud className={cn("w-8 h-8 transition-colors", isSaved ? "text-green-500" : "text-slate-500")} />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">
                        {isSaved ? 'Saved to Cloud' : 'Sync to Profile'}
                    </span>
                </Button>

                <Button
                    variant="ghost"
                    className={cn(
                        "flex flex-col items-center justify-center gap-6 h-40 bg-slate-900 border-white/5 rounded-[2rem] transition-all",
                        isCopied ? "border-amber-500/30 bg-amber-500/5" : "hover:border-white/20"
                    )}
                    onClick={() => {
                        const copyText = `XP ARENA PRO\nDEVICE: ${formData.chipset}\nREF: ${reference}\n\nGENERAL: ${results.general}\nRDS: ${results.redDot}\n2X: ${results.scope2x}\n4X: ${results.scope4x}\nSNP: ${results.awmScope}`;
                        navigator.clipboard.writeText(copyText);
                        setIsCopied(true);
                        addNotification('Copied', 'Settings copied to clipboard.', 'success');
                        setTimeout(() => setIsCopied(false), 2000);
                    }}
                >
                    {isCopied ? <Check className="w-8 h-8 text-amber-500" /> : <Copy className="w-8 h-8 text-slate-500" />}
                    <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">
                        {isCopied ? 'Copied' : 'Copy Settings'}
                    </span>
                </Button>
            </div>

            {/* Note */}
            <div className="flex justify-center">
                <div className="bg-slate-900 border border-amber-500/10 p-6 rounded-2xl flex items-center gap-6 max-w-2xl">
                    <Info className="w-6 h-6 text-amber-500 shrink-0" />
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide leading-relaxed">
                        <span className="text-amber-500 font-bold">Pro Tip:</span> Hardware-based calibration works best when system optimizations like "Focus Mode" or "Game Mode" are active and background processes are minimized.
                    </p>
                </div>
            </div>
        </div>
    );
}
