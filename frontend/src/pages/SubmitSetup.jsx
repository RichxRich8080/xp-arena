import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Target, Zap, ChevronRight, Share2, Copy, Shield, Cpu, Activity, Database, Check } from 'lucide-react';
import { setupService } from '../services/api';
import { cn } from '../utils/cn';

// Reusable Technical Slider Component
const TechSlider = ({ label, field, formData, handleSensitivityChange, handleSliderChange, code }) => (
    <div className="group relative p-6 glass-panel border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all overflow-hidden mb-4">
        <div className="relative z-10 flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
                <div className="w-1.5 h-6 bg-accent-cyan rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="space-y-1">
                    <span className="text-[9px] font-display font-black text-gray-500 uppercase tracking-[0.2em] block">{label}</span>
                    <span className="text-[7px] font-display font-bold text-gray-600 uppercase tracking-widest">SYSTEM_PARAM_{code}</span>
                </div>
            </div>
            <input
                type="number"
                max="200"
                min="0"
                value={formData[field]}
                onChange={(e) => handleSensitivityChange(e, field)}
                className="bg-background/50 border border-white/10 rounded-lg w-20 text-center text-accent-cyan font-display font-black text-lg p-2 focus:outline-none focus:border-accent-cyan uppercase italic"
            />
        </div>
        <div className="relative h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div
                className="absolute left-0 top-0 h-full bg-accent-cyan transition-all duration-300"
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
    const { addAXP } = useAuth();
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
                    : `Setup from ${formData.device} with ${formData.ram}GB RAM`,
                current_sens: JSON.stringify({
                    handType: formData.handType,
                    device: formData.device,
                    ram: formData.ram
                })
            };

            const { data } = await setupService.submitSetup(payload);
            const code = data?.code || `AXP-${String(data?.id || Math.floor(Math.random() * 100000)).padStart(5, '0')}`;
            setShareCode(code);
            setStep(3);

            addAXP(50);
            addNotification('Setup Certified', `Neural signature registered: ${code}`, 'success');
        } catch (error) {
            addNotification('Registry Failed', 'Uplink unstable. Please retry transmission.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-12 pb-20 animate-slide-in font-display">
            {/* Header */}
            <div className="relative group overflow-hidden glass-panel p-8 md:p-12 border-white/5">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] font-black text-8xl italic select-none pointer-events-none uppercase text-accent-cyan">
                    CONTRIB_DATA
                </div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <Database className="w-5 h-5 text-accent-cyan animate-pulse" />
                        <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Neural_Archive_Entry</h2>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
                        SUBMIT <span className="text-accent-cyan">SETUP</span>
                    </h1>
                    <p className="text-gray-400 font-bold text-sm mt-6 max-w-xl">
                        Publish your combat coefficients to the global archive. Help other Arenis optimize their terminals.
                    </p>
                </div>
            </div>

            {step === 1 && (
                <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex items-center gap-3 ml-4">
                        <Cpu className="w-4 h-4 text-accent-cyan" />
                        <h3 className="text-[10px] font-black text-white tracking-[0.3em] uppercase">HARDWARE_SIGNATURE_VERIFICATION</h3>
                    </div>

                    <Card className="p-10 space-y-10 border-white/5 bg-white/[0.02]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] block ml-1">TERMINAL_CODENAME</label>
                                <input
                                    placeholder="E.G. IPHONE_15_PRO"
                                    value={formData.device}
                                    onChange={(e) => setFormData({ ...formData, device: e.target.value })}
                                    className="w-full bg-background border border-white/10 rounded-2xl p-5 font-black text-sm text-white focus:outline-none focus:border-accent-cyan transition-all italic uppercase"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] block ml-1">MEMORY_CLOCK (GB)</label>
                                <input
                                    type="number"
                                    placeholder="E.G. 8"
                                    value={formData.ram}
                                    onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                                    className="w-full bg-background border border-white/10 rounded-2xl p-5 font-black text-sm text-white focus:outline-none focus:border-accent-cyan transition-all italic uppercase"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] block ml-1">KINETIC_LINK_PROTOCOL</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['Left', 'Right', 'Both'].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, handType: type })}
                                        className={cn(
                                            "py-4 rounded-xl border font-black text-[10px] uppercase transition-all italic tracking-widest",
                                            formData.handType === type
                                                ? "bg-accent-cyan/10 border-accent-cyan text-accent-cyan shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                                                : "bg-background border-white/5 text-gray-500 hover:border-white/20"
                                        )}
                                    >
                                        {type}_DOMINANT
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button
                            variant="primary"
                            className="w-full py-6 flex justify-between group disabled:opacity-20"
                            onClick={handleNext}
                            disabled={!formData.device || !formData.ram}
                        >
                            <span className="font-black italic uppercase tracking-[0.3em] text-[10px] ml-4">PROCEED_TO_COEFFICIENTS</span>
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform mr-4" />
                        </Button>
                    </Card>
                </div>
            )}

            {step === 2 && (
                <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                    <div className="flex items-center gap-3 ml-4">
                        <Activity className="w-4 h-4 text-accent-rose" />
                        <h3 className="text-[10px] font-black text-white tracking-[0.3em] uppercase">NEURAL_PARAMETER_ENCRYPTION</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <TechSlider label="GENERAL_BIAS" field="general" formData={formData} handleSensitivityChange={handleSensitivityChange} handleSliderChange={handleSliderChange} code="A01" />
                            <TechSlider label="RED_DOT_ACQ" field="redDot" formData={formData} handleSensitivityChange={handleSensitivityChange} handleSliderChange={handleSliderChange} code="B04" />
                            <TechSlider label="2X_OPTICAL" field="scope2x" formData={formData} handleSensitivityChange={handleSensitivityChange} handleSliderChange={handleSliderChange} code="C09" />
                            <TechSlider label="4X_ACOG_AXIS" field="scope4x" formData={formData} handleSensitivityChange={handleSensitivityChange} handleSliderChange={handleSliderChange} code="D12" />
                            <TechSlider label="8X_ELITE_SENS" field="scope8x" formData={formData} handleSensitivityChange={handleSensitivityChange} handleSliderChange={handleSliderChange} code="E15" />
                            
                            <div className="p-6 glass-panel border-white/5 bg-white/[0.02] flex flex-col justify-between">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] block mb-4">TACTICAL_NOTES</label>
                                <textarea
                                    className="w-full h-full bg-background border border-white/5 rounded-xl p-4 font-bold text-xs text-white focus:outline-none focus:border-accent-cyan transition-all italic resize-none"
                                    placeholder="TRANSMIT_ADDITIONAL_OP_TIPS..."
                                    value={formData.comment}
                                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button type="button" variant="ghost" className="px-10 border-white/10 hover:bg-white/5 uppercase italic font-black text-[10px] tracking-widest" onClick={handleBack} disabled={isSubmitting}>
                                BACK_VERIFY
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                className="flex-1 py-6 shadow-[0_10px_30px_rgba(6,182,212,0.2)]"
                                disabled={isSubmitting}
                            >
                                <span className="font-black italic uppercase tracking-[0.4em] text-[10px]">
                                    {isSubmitting ? 'ENCRYPTING_TRANSMISSION...' : 'PUBLISH_TO_ARCHIVE_&_EARN_AXP'}
                                </span>
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {step === 3 && (
                <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
                    <Card className="relative p-16 flex flex-col items-center text-center border-accent-green/20 bg-accent-green/[0.02] overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-green/10 blur-[100px] -translate-x-1/2 -translate-y-1/2" />
                        
                        <div className="w-24 h-24 bg-accent-green/10 rounded-[2.5rem] border border-accent-green/20 flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(34,197,94,0.15)] relative z-10">
                            <Share2 className="w-10 h-10 text-accent-green" />
                        </div>

                        <h2 className="text-3xl font-black text-white italic tracking-[0.2em] uppercase mb-4 relative z-10">ARCHIVE_SUCCESS</h2>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-12 max-w-sm relative z-10">
                            Your tactile coefficients have been verified and integrated into the global neural network.
                        </p>

                        <div className="w-full max-w-sm space-y-4 mb-12 relative z-10">
                            <span className="text-[9px] font-black text-gray-600 tracking-[0.4em] uppercase">NEURAL_ACCESS_KEY</span>
                            <div
                                onClick={() => {
                                    navigator.clipboard.writeText(shareCode);
                                    addNotification('Secured', 'Link copied to terminal.', 'success');
                                }}
                                className="glass-panel border-white/10 bg-background/50 p-8 flex items-center justify-between cursor-pointer group hover:border-accent-cyan/30 transition-all border-dashed border-2"
                            >
                                <span className="text-4xl font-black italic tracking-[0.3em] text-accent-cyan uppercase">
                                    {shareCode}
                                </span>
                                <Copy className="w-6 h-6 text-gray-600 group-hover:text-white transition-all group-hover:scale-110" />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-accent-green/10 px-8 py-4 rounded-2xl border border-accent-green/20 shadow-[0_10px_30px_rgba(34,197,94,0.1)]">
                            <Zap className="w-5 h-5 text-accent-green fill-accent-green/20" />
                            <span className="font-black text-white italic tracking-widest text-xs">+50_AXP_REWARDED</span>
                        </div>
                    </Card>

                    <Button
                        variant="ghost"
                        className="w-full py-6 text-[10px] font-black uppercase tracking-[0.5em] italic border-white/5 hover:bg-white/5"
                        onClick={() => navigate('/dashboard')}
                    >
                        RETURN_TO_COMMAND_CENTER
                    </Button>
                </div>
            )}
        </div>
    );
}
