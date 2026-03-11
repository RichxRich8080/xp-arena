import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button'; // Added missing import for Button
import { Target, Zap, ChevronRight, Share2, Copy } from 'lucide-react';

// Reusable Slider Component
const SensSlider = ({ label, field, formData, handleSensitivityChange, handleSliderChange }) => (
    <div className="space-y-2 mb-4">
        <div className="flex justify-between items-end">
            <label className="text-sm font-bold text-gray-300 tracking-wider uppercase">{label}</label>
            <input
                type="number"
                max="200"
                min="0"
                value={formData[field]}
                onChange={(e) => handleSensitivityChange(e, field)}
                className="bg-gray-800 border-b border-gray-600 w-16 text-center text-neon-cyan font-bold focus:outline-none focus:border-neon-cyan px-1 py-1"
            />
        </div>
        <div className="relative w-full h-8 flex items-center group">
            <input
                type="range"
                min="0"
                max="200"
                value={formData[field]}
                onChange={(e) => handleSliderChange(e, field)}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
            />
            {/* Fill track visual overlay */}
            <div
                className="absolute left-0 pointer-events-none h-2 bg-gradient-to-r from-primary-blue to-neon-cyan rounded-l-lg shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                style={{ width: `${(formData[field] / 200) * 100}%` }}
            ></div>
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

    // Form State
    const [formData, setFormData] = useState({
        device: '',
        ram: '',
        handType: 'Right',
        general: 100,
        redDot: 100,
        scope2x: 100,
        scope4x: 100,
        comment: ''
    });

    // Handlers
    const handleNext = () => setStep(2);
    const handleBack = () => setStep(1);

    const handleSensitivityChange = (e, field) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val)) val = 0;
        if (val < 0) val = 0;
        if (val > 200) val = 200; // Enforce max 200
        setFormData({ ...formData, [field]: val });
    };

    const handleSliderChange = (e, field) => {
        setFormData({ ...formData, [field]: parseInt(e.target.value, 10) });
    };

    const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = 'AXP-';
        for (let i = 0; i < 5; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Mock API Submit Delay
        setTimeout(() => {
            const code = generateCode();
            setShareCode(code);
            setIsSubmitting(false);
            setStep(3);

            // Reward user context
            addAXP(50);

            // Global Notifications
            addNotification('Setup Created!', `Unique share code: ${code}`, 'success');
            addNotification('Earned AXP', 'You earned +50 AXP for submitting a setup.', 'axp');
        }, 1500);
    };

    const copyCode = () => {
        navigator.clipboard.writeText(shareCode);
        addNotification('Copied', 'Setup code copied to clipboard!', 'info');
    };

    return (
        <div className="max-w-xl mx-auto space-y-6 pb-6 animate-slide-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-wider">Submit Setup</h1>
                    <p className="text-sm text-gray-400">Share your elite settings and earn AXP.</p>
                </div>
                <div className="w-12 h-12 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-neon-cyan glow-cyan" />
                </div>
            </div>

            {step === 1 && (
                <Card className="animate-in fade-in zoom-in-95 duration-300">
                    <div className="mb-6 flex justify-between items-center pb-4 border-b border-gray-800">
                        <h2 className="font-bold text-gray-200">Hardware Info</h2>
                        <span className="text-xs font-bold bg-primary-blue/20 text-neon-cyan px-2 py-1 rounded">Step 1/2</span>
                    </div>

                    <div className="space-y-4">
                        <Input
                            label="DEVICE NAME"
                            placeholder="e.g. iPhone 13 Pro Max"
                            value={formData.device}
                            onChange={(e) => setFormData({ ...formData, device: e.target.value })}
                        />
                        <Input
                            label="RAM (GB)"
                            type="number"
                            placeholder="e.g. 6"
                            value={formData.ram}
                            onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                        />

                        <div className="flex flex-col gap-1 w-full pt-2">
                            <label className="text-sm font-medium text-gray-400">HAND TYPE</label>
                            <div className="flex gap-2">
                                {['Left', 'Right', 'Both'].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, handType: type })}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-colors ${formData.handType === type
                                            ? 'bg-primary-blue/20 border-primary-blue text-white'
                                            : 'bg-gray-900 border-gray-700 text-gray-500 hover:bg-gray-800'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button
                            className="w-full mt-6 flex justify-between group"
                            onClick={handleNext}
                            disabled={!formData.device || !formData.ram}
                        >
                            <span>Next: Sensitivities</span>
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </Card>
            )}

            {step === 2 && (
                <Card className="animate-in fade-in slide-in-from-right-4 duration-300 border-t-4 border-t-neon-cyan">
                    <div className="mb-6 flex justify-between items-center pb-4 border-b border-gray-800">
                        <h2 className="font-bold text-gray-200">Sensitivities (Max 200)</h2>
                        <span className="text-xs font-bold bg-primary-blue/20 text-neon-cyan px-2 py-1 rounded">Step 2/2</span>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <SensSlider label="General" field="general" formData={formData} handleSensitivityChange={handleSensitivityChange} handleSliderChange={handleSliderChange} />
                        <SensSlider label="Red Dot" field="redDot" formData={formData} handleSensitivityChange={handleSensitivityChange} handleSliderChange={handleSliderChange} />
                        <SensSlider label="2x Scope" field="scope2x" formData={formData} handleSensitivityChange={handleSensitivityChange} handleSliderChange={handleSliderChange} />
                        <SensSlider label="4x Scope" field="scope4x" formData={formData} handleSensitivityChange={handleSensitivityChange} handleSliderChange={handleSliderChange} />

                        <div className="mt-6 mb-8">
                            <label className="text-sm font-medium text-gray-400 mb-1 block">CREATOR COMMENT</label>
                            <textarea
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-text-default focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan resize-none"
                                rows="3"
                                placeholder="Tips on how to use this setup..."
                                value={formData.comment}
                                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                            ></textarea>
                        </div>

                        <div className="flex gap-3">
                            <Button type="button" variant="secondary" onClick={handleBack} disabled={isSubmitting}>
                                Back
                            </Button>
                            <Button
                                type="submit"
                                variant="neonCyan"
                                className="flex-1 text-gray-900 shadow-[0_4px_15px_rgba(6,182,212,0.4)]"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'GENERATING CODE...' : 'SUBMIT & EARN AXP'}
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            {step === 3 && (
                <div className="space-y-4 animate-in zoom-in-95 duration-500">
                    <Card className="text-center py-10 border-neon-green/30 bg-gradient-to-b from-[#0b1b16] to-gray-900">
                        <div className="w-20 h-20 mx-auto bg-neon-green/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                            <Share2 className="w-10 h-10 text-neon-green" />
                        </div>

                        <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">Setup Published!</h2>
                        <p className="text-sm text-gray-400 mb-8 max-w-sm mx-auto">
                            Your settings have been registered in the Arena. Share this code with other Arenis.
                        </p>

                        <div className="max-w-xs mx-auto mb-8">
                            <p className="text-xs uppercase font-bold text-gray-500 mb-2">Share Code</p>
                            <div
                                onClick={copyCode}
                                className="bg-gray-900 border-2 border-dashed border-gray-600 hover:border-neon-cyan rounded-xl p-4 flex items-center justify-between cursor-pointer group transition-colors"
                            >
                                <span className="text-2xl font-mono font-bold tracking-widest text-neon-cyan drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
                                    {shareCode}
                                </span>
                                <Copy className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                            </div>
                        </div>

                        <div className="flex justify-center gap-2 items-center bg-yellow-500/10 text-axp-gold px-4 py-2 rounded-lg max-w-xs mx-auto border border-yellow-500/20">
                            <Zap className="w-5 h-5" />
                            <span className="font-bold">+50 AXP Rewarded</span>
                        </div>
                    </Card>

                    <Button
                        variant="outline"
                        className="w-full py-4 text-sm tracking-wider"
                        onClick={() => navigate('/dashboard')}
                    >
                        RETURN TO DASHBOARD
                    </Button>
                </div>
            )}
        </div>
    );
}
