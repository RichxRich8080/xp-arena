import React, { useMemo, useEffect, useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { analyzeDifference, calculateEliteSensitivities, getRecoilTips } from '../utils/sensLogic';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import {
    Download, ArrowLeft, Zap, Target, Cpu, Wifi,
    Crown, ShieldCheck, Share2, Info, ChevronRight, Check, Copy, Sparkles, Activity, Award
} from 'lucide-react';
import { saveSetup } from '../utils/storage';
import { SFX } from '../utils/sfx';
import { Burst } from '../components/ui/Particles';
import { cn } from '../utils/cn';

const EliteDiagnosticCard = ({ label, value, description, color }) => (
    <div className="group relative p-8 glass-panel border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all overflow-hidden">
        <div className={cn("absolute top-0 right-0 w-24 h-24 blur-[80px] opacity-[0.05] group-hover:opacity-[0.15] transition-opacity", color.replace('from-', 'bg-').split(' ')[0])} />
        <div className="relative z-10 flex justify-between items-start mb-8">
            <div className="space-y-1">
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] block italic">{label}</span>
                <span className="text-[8px] font-bold text-gray-700 uppercase tracking-widest block">{description}</span>
            </div>
            <span className="text-4xl font-black text-white italic tracking-tighter opacity-80 group-hover:opacity-100 transition-opacity">{value}</span>
        </div>
        <div className="h-1px w-full bg-white/5 overflow-hidden">
            <div 
                className={cn("h-full bg-gradient-to-r transition-all duration-[2000ms] delay-500", color)} 
                style={{ width: `${(value / 200) * 100}%` }}
            />
        </div>
    </div>
);

export default function EliteResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const { addAXP } = useAuth();
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
            addAXP(100);
            addNotification('Gold Tier Allocated', '100_AXP rewards synced to dossier.', 'success');
        }, 500);
        return () => clearTimeout(timer);
    }, [reference, formData, addAXP, addNotification]);

    if (!reference || !formData || !results) {
        return <Navigate to="/generate-sensitivity" />;
    }

    const eliteItems = [
        { key: 'general', label: 'ELITE_NEURAL_BASE', desc: 'CORE_KINEMATIC_AXIS', color: 'from-axp-gold to-white' },
        { key: 'redDot', label: 'PRECISION_RDS', desc: 'SIGHT_POLLING_ALGO', color: 'from-axp-gold to-yellow-600' },
        { key: 'scope2x', label: 'TACTICAL_ZOOM_2X', desc: 'MID_RANGE_SYNC', color: 'from-axp-gold to-orange-500' },
        { key: 'scope4x', label: 'AUDIT_ACOG_4X', desc: 'QUAD_AXIS_COMP', color: 'from-axp-gold to-red-600' },
        { key: 'awmScope', label: 'ELITE_SNIPER_CORE', desc: 'SNIPER_PRECISION_UPLINK', color: 'from-white to-gray-400' },
        { key: 'freeLook', label: 'AWARENESS_NODE', desc: 'SENSORY_SWEEP', color: 'from-axp-gold to-white' },
    ];

    return (
        <div className="space-y-12 pb-20 animate-slide-in font-display">
            {/* Elite Result Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/generate-sensitivity')}
                    className="flex items-center gap-4 text-gray-500 hover:text-axp-gold transition-all group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">RE-ENTRY_AUDIT</span>
                </button>
                <div className="flex items-center gap-4 px-6 py-2 glass-panel border-axp-gold/20 bg-axp-gold/5">
                    <Crown className="w-4 h-4 text-axp-gold animate-pulse" />
                    <span className="text-[10px] font-black text-axp-gold tracking-[0.2em] italic">ELITE_AUDIT_VERIFIED</span>
                </div>
            </div>

            <div className={cn(
                "relative transition-all duration-1000 space-y-10",
                isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
            )}>
                <Burst active={isRevealed} />
                
                {/* ELITE REPORT HEADER */}
                <div className="glass-panel p-12 md:p-16 border-axp-gold/20 bg-axp-gold/[0.02] relative overflow-hidden backdrop-blur-3xl">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.05] font-black text-9xl italic select-none pointer-events-none uppercase text-axp-gold">
                        GOLD
                    </div>

                    <div className="relative z-10 space-y-12">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Activity className="w-6 h-6 text-axp-gold" />
                                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.5em] italic">Elite_Diagnostic_Report</h3>
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">
                                    HARDWARE <span className="text-axp-gold">MASTERY</span>
                                </h1>
                            </div>

                            <div className="flex flex-col items-end gap-3 p-8 glass-panel border-axp-gold/20 bg-axp-gold/5 group">
                                <span className="text-[9px] font-black text-gray-500 tracking-[0.4em] uppercase">AUDIT_PROTOCOL_HASH</span>
                                <span className="text-2xl font-black text-axp-gold italic tracking-[0.25em] uppercase group-hover:text-white transition-colors">XP-ELITE-V22</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-16 pt-12 border-t border-white/5">
                            <div className="space-y-2">
                                <span className="text-[9px] font-black text-gray-600 tracking-[0.4em] uppercase block">PROCESSOR_NODE</span>
                                <span className="text-sm font-black text-white italic uppercase tracking-widest flex items-center gap-3">
                                    <Cpu className="w-4 h-4 text-axp-gold" /> {formData.chipset}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[9px] font-black text-gray-600 tracking-[0.4em] uppercase block">NEURAL_DPI</span>
                                <span className="text-sm font-black text-white italic uppercase tracking-widest flex items-center gap-3">
                                    <Target className="w-4 h-4 text-axp-gold" /> {formData.dpi} DPI_MATRIX
                                </span>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[9px] font-black text-gray-600 tracking-[0.4em] uppercase block">UPLINK_STATUS</span>
                                <span className="text-sm font-black text-accent-cyan italic uppercase tracking-widest flex items-center gap-3">
                                    <Wifi className="w-4 h-4 text-accent-cyan" /> {formData.ping}MS_STABLE
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ELITE VALUES GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* RECOIL MASTERY MODULE */}
                    <div className="lg:col-span-12 space-y-8">
                         <div className="flex items-center gap-4 ml-4">
                            <Activity className="w-4 h-4 text-axp-gold" />
                            <h3 className="text-[10px] font-black text-white tracking-[0.3em] uppercase italic">RECOIL_CALIBRATION_OUTPUT</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {recoilTips.map((tip, i) => (
                                <Card key={i} className="p-8 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group relative overflow-hidden">
                                     <div className="absolute top-0 left-0 w-1 h-full bg-axp-gold/20 group-hover:bg-axp-gold transition-all" />
                                     <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black text-axp-gold uppercase italic tracking-widest">TIP_0{i+1}</span>
                                            <Award className="w-4 h-4 text-axp-gold/30 group-hover:text-axp-gold transition-colors" />
                                        </div>
                                        <h4 className="text-sm font-black text-white uppercase italic tracking-tighter">{tip.title}</h4>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">{tip.text}</p>
                                     </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* AI ANALYSIS MODULE */}
                <Card className="p-12 border-axp-gold/20 bg-axp-gold/[0.03] relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-2 h-full bg-axp-gold shadow-[0_0_40px_rgba(251,191,36,0.6)]" />
                    <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
                        <div className="w-20 h-20 rounded-3xl bg-axp-gold/10 flex items-center justify-center shrink-0 border border-axp-gold/30 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-10 h-10 text-axp-gold" />
                        </div>
                        <div className="space-y-5 flex-1">
                            <div className="flex items-center gap-4">
                                <h4 className="text-xs font-black text-white tracking-[0.4em] uppercase italic">ULTRA_PRECISION_AUDIT_AI</h4>
                                <div className="h-1px flex-1 bg-axp-gold/20" />
                            </div>
                            <p className="text-sm text-gray-300 font-bold italic leading-relaxed uppercase tracking-tighter">
                                {whyAnalysis}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* ACTION GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <Button
                    variant="ghost"
                    className="group flex flex-col items-center justify-center gap-8 h-40 border-axp-gold/10 bg-axp-gold/[0.02] hover:bg-axp-gold/5 hover:border-axp-gold/40 rounded-[2.5rem] transition-all"
                    onClick={() => addNotification('Export', 'Generating Ultra-HD report...', 'info')}
                >
                    <Download className="w-8 h-8 text-axp-gold transition-transform group-hover:-translate-y-2" />
                    <span className="text-[10px] font-black tracking-[0.5em] uppercase text-gray-500 group-hover:text-axp-gold">EXPORT_ELITE_DATA</span>
                </Button>

                <Button
                    variant="ghost"
                    className={cn(
                        "group flex flex-col items-center justify-center gap-8 h-40 border-white/5 bg-white/[0.01] rounded-[2.5rem] transition-all",
                        isSaved ? "bg-accent-green/5 border-accent-green/20" : "hover:bg-accent-green/5 hover:border-accent-green/20"
                    )}
                    onClick={() => {
                        if (isSaved) return;
                        saveSetup({ formData, results, type: 'ELITE' });
                        setIsSaved(true);
                        addAXP(200);
                        addNotification('Cloud Secure', 'Elite configuration backed up to neural cloud.', 'success');
                    }}
                >
                    <ShieldCheck className={cn("w-8 h-8 transition-transform group-hover:-translate-y-2", isSaved ? "text-accent-green" : "text-gray-500 group-hover:text-white")} />
                    <span className="text-[10px] font-black tracking-[0.5em] uppercase text-gray-500 group-hover:text-white">
                        {isSaved ? 'CLOUD_SECURED' : 'SYNC_TO_DOSSIER'}
                    </span>
                </Button>

                <Button
                    variant="ghost"
                    className={cn(
                        "group flex flex-col items-center justify-center gap-8 h-40 border-white/5 bg-white/[0.01] rounded-[2.5rem] transition-all",
                        isCopied ? "bg-axp-gold/10 border-axp-gold/30" : "hover:bg-axp-gold/10 hover:border-axp-gold/30"
                    )}
                    onClick={() => {
                        const copyText = `XP ARENA ELITE\nPROCESSOR: ${formData.chipset}\nREF: ${reference}\n\nGENERAL: ${results.general}\nRDS: ${results.redDot}\n2X: ${results.scope2x}\n4X: ${results.scope4x}\nELT: ${results.awmScope}`;
                        navigator.clipboard.writeText(copyText);
                        setIsCopied(true);
                        addNotification('Protocol Mapped', 'Elite coefficients copied to local memory.', 'success');
                        setTimeout(() => setIsCopied(false), 2000);
                    }}
                >
                    {isCopied ? <Check className="w-8 h-8 text-axp-gold" /> : <Copy className="w-8 h-8 text-gray-500 group-hover:text-axp-gold transition-transform group-hover:-translate-y-2" />}
                    <span className="text-[10px] font-black tracking-[0.5em] uppercase text-gray-500 group-hover:text-axp-gold">
                        {isCopied ? 'NODE_SYNCED' : 'COPY_AUDIT_COEFS'}
                    </span>
                </Button>
            </div>

            {/* Premium Instruction */}
            <div className="flex justify-center px-16">
                <div className="glass-panel border-axp-gold/10 bg-axp-gold/5 p-8 flex items-center gap-8 max-w-2xl">
                    <Info className="w-8 h-8 text-axp-gold shrink-0" />
                    <p className="text-[10px] text-axp-gold font-display font-black uppercase tracking-widest leading-relaxed italic">
                        TACTICAL_NOTE: Elite calibration relies on exact frame-pacing. For maximum precision, ensure "Battery Saver" is disabled and display refresh rate is set to "Uncapped" in terminal settings.
                    </p>
                </div>
            </div>
        </div>
    );
}
