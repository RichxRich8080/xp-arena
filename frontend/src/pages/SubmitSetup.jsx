import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Target, Zap, ChevronRight, Share2, Copy, Shield, Cpu, Activity, Database, Check, History, Crosshair, BarChart3 } from 'lucide-react';
import { setupService } from '../services/api';
import { cn } from '../utils/cn';

const TechSlider = ({ label, field, formData, handleSensitivityChange, handleSliderChange }) => (
    <div className="group relative p-6 bg-slate-900 border border-white/5 rounded-2xl hover:bg-slate-800/50 transition-all overflow-hidden mb-4 shadow-sm">
        <div className="relative z-10 flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
                <div className="w-1 h-6 bg-primary rounded-full" />
                <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">{label}</span>
                </div>
            </div>
            <input
                type="number"
                max="200"
                min="0"
                value={formData[field]}
                onChange={(e) => handleSensitivityChange(e, field)}
                className="bg-slate-800 border border-white/10 rounded-lg w-20 text-center text-primary font-bold text-lg p-2 focus:outline-none focus:border-primary transition-colors"
            />
        </div>
        <div className="relative h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
                className="absolute left-0 top-0 h-full bg-primary transition-all duration-300"
                style={{ width: `${(formData[field] / 200) * 100}%` }}
            />
            <input
                type="range"
                min="0"
                max="200"
                value={formData[field]}
                onChange={(e) => handleSliderChange(e, field)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
        </div>
    </div>
);

export default function SubmitSetup() {
    const { addPoints } = useAuth();
    const { addNotification } = useNotifications();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [shareCode, setShareCode] = useState(null);

    const [formData, setFormData] = useState({
        device: '',
        ram: '',
        handType: 'Right',
        general: 100,
        redDot: 100,
        scope2x: 100,
        scope4x: 100,
        scope8x: 100,
        comment: ''
    });

    const handleNext = () => setStep(2);
    const handleBack = () => setStep(1);

    const handleSensitivityChange = (e, field) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val)) val = 0;
        if (val < 0) val = 0;
        if (val > 200) val = 200;
        setFormData({ ...formData, [field]: val });
    };

    const handleSliderChange = (e, field) => {
        setFormData({ ...formData, [field]: parseInt(e.target.value, 10) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                mode: 'manual',
                general: Number(formData.general),
                reddot: Number(formData.redDot),
                scope2x: Number(formData.scope2x),
                scope4x: Number(formData.scope4x),
                scope8x: Number(formData.scope8x),
                comment: formData.comment && formData.comment.trim().length >= 10
                    ? formData.comment.trim()
                    : `Configuration for ${formData.device}`,
                current_sens: JSON.stringify({
                    handType: formData.handType,
                    device: formData.device,
                    ram: formData.ram
                })
            };

            const { data } = await setupService.submitSetup(payload);
            const code = data?.code || `XP-${String(data?.id || Math.floor(Math.random() * 100000)).padStart(5, '0')}`;
            setShareCode(code);
            setStep(3);

            addPoints(50);
            addNotification('Setup Posted', `Your configuration is live: ${code}`, 'success');
        } catch (error) {
            addNotification('Submission Failed', 'Connection unstable. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 pb-12 animate-fade-in font-sans">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-white/5 shadow-sm">
                <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none select-none">
                    <Database className="w-64 h-64" />
                </div>
                
                <div className="relative p-8 md:p-12 space-y-6">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit">
                        <Activity className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Global Performance Database</span>
                    </div>
                    
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-none uppercase">
                            Submit <span className="text-primary">Setup</span>
                        </h1>
                        <p className="text-slate-400 text-sm md:text-base max-w-xl leading-relaxed font-medium">
                            Share your optimized settings with the community. Help others discover the best configurations for their devices.
                        </p>
                    </div>
                </div>
            </div>

            {step === 1 && (
                <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
                    <h3 className="text-xs font-bold text-slate-500 tracking-[0.2em] uppercase flex items-center gap-2 ml-1">
                        <Cpu className="w-4 h-4 text-primary" />
                        Device Information
                    </h3>

                    <Card className="p-10 space-y-8 border-white/5 bg-slate-900/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block ml-1">Device Model</label>
                                <input
                                    placeholder="e.g. iPhone 15 Pro"
                                    value={formData.device}
                                    onChange={(e) => setFormData({ ...formData, device: e.target.value })}
                                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-primary transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block ml-1">RAM (GB)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 8"
                                    value={formData.ram}
                                    onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block ml-1">Input Preference</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['Left', 'Right', 'Both'].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, handType: type })}
                                        className={cn(
                                            "py-4 rounded-xl border text-[10px] font-bold uppercase transition-all tracking-widest",
                                            formData.handType === type
                                                ? "bg-primary text-white border-primary shadow-lg"
                                                : "bg-slate-800/50 border-white/5 text-slate-500 hover:border-white/20"
                                        )}
                                    >
                                        {type} Handed
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button
                            variant="primary"
                            className="w-full py-6 flex justify-between items-center px-10 rounded-xl disabled:opacity-30"
                            onClick={handleNext}
                            disabled={!formData.device || !formData.ram}
                        >
                            <span className="text-xs font-bold uppercase tracking-widest">Configuration Details</span>
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </Card>
                </div>
            )}

            {step === 2 && (
                <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                    <h3 className="text-xs font-bold text-slate-500 tracking-[0.2em] uppercase flex items-center gap-2 ml-1">
                        <BarChart3 className="w-4 h-4 text-primary" />
                        Sensitivity Values
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <TechSlider label="General Sensitivity" field="general" formData={formData} handleSensitivityChange={handleSensitivityChange} handleSliderChange={handleSliderChange} />
                            <TechSlider label="Red Dot" field="redDot" formData={formData} handleSensitivityChange={handleSensitivityChange} handleSliderChange={handleSliderChange} />
                            <TechSlider label="2x Scope" field="scope2x" formData={formData} handleSensitivityChange={handleSensitivityChange} handleSliderChange={handleSliderChange} />
                            <TechSlider label="4x Scope" field="scope4x" formData={formData} handleSensitivityChange={handleSensitivityChange} handleSliderChange={handleSliderChange} />
                            <TechSlider label="8x Scope" field="scope8x" formData={formData} handleSensitivityChange={handleSensitivityChange} handleSliderChange={handleSliderChange} />
                            
                            <div className="p-6 bg-slate-900 border border-white/5 rounded-2xl flex flex-col justify-between">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Configuration Notes</label>
                                <textarea
                                    className="w-full h-full min-h-[100px] bg-slate-800/50 border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-primary transition-all resize-none"
                                    placeholder="Optional tips for other players..."
                                    value={formData.comment}
                                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button type="button" variant="ghost" className="px-10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest" onClick={handleBack} disabled={isSubmitting}>
                                Previous
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                className="flex-1 py-6 rounded-xl shadow-lg font-bold text-xs uppercase tracking-[0.2em]"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Posting configuration...' : 'Publish Setup & Earn Points'}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {step === 3 && (
                <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
                    <Card className="p-12 flex flex-col items-center text-center border-emerald-500/20 bg-slate-900/50 rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                        
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center mb-8 shadow-xl">
                            <Check className="w-10 h-10 text-emerald-500" />
                        </div>

                        <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Setup Posted Successfully</h2>
                        <p className="text-slate-500 text-sm font-medium mb-10 max-w-sm">
                            Your settings have been verified and added to the community database.
                        </p>

                        <div className="w-full max-w-sm space-y-4 mb-10">
                            <span className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase block">Share Code</span>
                            <div
                                onClick={() => {
                                    navigator.clipboard.writeText(shareCode);
                                    addNotification('Copied', 'Configuration code copied to clipboard.', 'success');
                                }}
                                className="bg-slate-800 border-2 border-dashed border-white/10 p-8 rounded-2xl flex items-center justify-between cursor-pointer group hover:border-primary/50 transition-all"
                            >
                                <span className="text-3xl font-bold tracking-widest text-primary uppercase">
                                    {shareCode}
                                </span>
                                <Copy className="w-5 h-5 text-slate-500 group-hover:text-white transition-all" />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-emerald-500/10 px-6 py-3 rounded-xl border border-emerald-500/20">
                            <Zap className="w-4 h-4 text-emerald-500" />
                            <span className="font-bold text-white text-xs">+50 Points Rewarded</span>
                        </div>
                    </Card>

                    <Button
                        variant="ghost"
                        className="w-full py-6 text-xs font-bold uppercase tracking-widest border border-white/5 rounded-xl block text-center"
                        onClick={() => navigate('/dashboard')}
                    >
                        Back to Dashboard
                    </Button>
                </div>
            )}
        </div>
    );
}
