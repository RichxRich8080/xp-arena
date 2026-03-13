import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useNotifications } from '../hooks/useNotifications';
import { Shield, Fingerprint, Eye, EyeOff, Monitor, Zap, Command, Lock, Globe, Settings as SettingsIcon, AppWindow, Bell, ShieldCheck } from 'lucide-react';
import { cn } from '../utils/cn';

export default function Settings() {
    const { addNotification } = useNotifications();
    const [preferences, setPreferences] = useState(() => {
        const saved = localStorage.getItem('xp_settings');
        return saved ? JSON.parse(saved) : {
            compactCards: false,
            highContrast: false,
            reducedMotion: false,
            tacticalMode: false,
            profileVisibility: 'public'
        };
    });

    const onToggle = (key) => {
        const next = { ...preferences, [key]: !preferences[key] };
        setPreferences(next);
        localStorage.setItem('xp_settings', JSON.stringify(next));
        
        // Handle global performance classes
        if (key === 'tacticalMode') {
            document.body.classList.toggle('tactical-mode', next.tacticalMode);
        }
        
        addNotification('Settings Updated', 'Preferences have been synchronized successfully.', 'success');
    };

    const onVisibility = (value) => {
        const next = { ...preferences, profileVisibility: value };
        setPreferences(next);
        localStorage.setItem('xp_settings', JSON.stringify(next));
        addNotification('Privacy Updated', `Profile visibility is now set to ${value}.`, 'success');
    };

    return (
        <div className="space-y-8 pb-12 animate-fade-in font-sans">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-white/5 shadow-sm">
                <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none select-none">
                    <SettingsIcon className="w-64 h-64" />
                </div>
                
                <div className="relative p-8 md:p-12 space-y-6">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Security Verified</span>
                    </div>
                    
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-none uppercase">
                            System <span className="text-primary">Settings</span>
                        </h1>
                        <p className="text-slate-400 text-sm md:text-base max-w-xl leading-relaxed font-medium">
                            Manage your account preferences, interface options, and privacy controls. All changes take effect immediately.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Interface Settings */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-500 tracking-[0.2em] uppercase flex items-center gap-2 ml-1">
                        <AppWindow className="w-4 h-4 text-primary" />
                        Preferences
                    </h3>
                    
                    <Card className="border-white/5 bg-slate-900/50 overflow-hidden divide-y divide-white/5">
                        {[
                            { key: 'compactCards', label: 'Compact Interface', desc: 'Squeeze layout cards for high-density information viewing.', icon: Command },
                            { key: 'highContrast', label: 'High Contrast', desc: 'Increase element visibility for better visual clarity.', icon: Zap },
                            { key: 'reducedMotion', label: 'Reduced Motion', desc: 'Disables animations for a more stable interface experience.', icon: Shield },
                            { key: 'tacticalMode', label: 'Performance Mode', desc: 'Optimizes rendering by disabling blur effects and shadows.', icon: Monitor },
                        ].map((item) => (
                            <div key={item.key} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-white/5 transition-all">
                                        <item.icon className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-sm">{item.label}</p>
                                        <p className="text-[10px] text-slate-500 font-medium tracking-tight leading-tight">{item.desc}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onToggle(item.key)}
                                    className={cn(
                                        "w-12 h-6 rounded-full transition-all relative",
                                        preferences[item.key] ? 'bg-primary' : 'bg-slate-700'
                                    )}
                                >
                                    <div className={cn(
                                        "absolute top-1 left-1 h-4 w-4 bg-white rounded-full transition-all duration-300",
                                        preferences[item.key] ? 'translate-x-6' : 'translate-x-0'
                                    )} />
                                </button>
                            </div>
                        ))}
                    </Card>
                </div>

                {/* Privacy & Security */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-500 tracking-[0.2em] uppercase flex items-center gap-2 ml-1">
                        <Fingerprint className="w-4 h-4 text-primary" />
                        Privacy & Security
                    </h3>

                    <Card className="p-8 border-white/5 bg-slate-900/50 space-y-8">
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-2">Profile Visibility</p>
                            <p className="text-xs text-slate-400 font-medium mb-6">Determines who can see your profile and performance statistics.</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {[
                                    { id: 'public', label: 'Public', icon: Globe },
                                    { id: 'friends', label: 'Private', icon: Shield },
                                    { id: 'private', label: 'Hidden', icon: Lock }
                                ].map((level) => (
                                    <button
                                        key={level.id}
                                        onClick={() => onVisibility(level.id)}
                                        className={cn(
                                            "flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border transition-all",
                                            preferences.profileVisibility === level.id 
                                                ? 'bg-primary/10 border-primary text-primary shadow-sm' 
                                                : 'bg-slate-800/50 border-white/5 text-slate-500 hover:border-white/20 hover:text-white'
                                        )}
                                    >
                                        <level.icon className="w-5 h-5" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{level.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5 space-y-4">
                            <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase block">Account Management</p>
                            <Button variant="ghost" className="w-full text-red-500 border border-red-500/20 hover:bg-red-500/10 uppercase tracking-widest font-bold text-[10px] py-4 rounded-xl">
                                Reset All Preferences
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
