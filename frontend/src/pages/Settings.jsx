import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useNotifications } from '../hooks/useNotifications';
import { Shield, Fingerprint, Eye, EyeOff, Monitor, Zap, Command, Lock, Globe } from 'lucide-react';
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
        
        addNotification('Configuration Secure', `${key} parameter synchronized.`, 'success');
    };

    const onVisibility = (value) => {
        const next = { ...preferences, profileVisibility: value };
        setPreferences(next);
        localStorage.setItem('xp_settings', JSON.stringify(next));
        addNotification('Security Updated', `Profile visibility protocols set to ${value}.`, 'success');
    };

    return (
        <div className="space-y-12 pb-20 animate-slide-in">
            {/* VAULT HEADER */}
            <div className="relative group overflow-hidden glass-panel p-8 md:p-12 border-white/5">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] font-display font-black text-8xl italic select-none pointer-events-none uppercase">
                    VAULT_SECURE
                </div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <Lock className="w-5 h-5 text-accent-rose animate-pulse" />
                        <h2 className="text-xs font-display font-black text-gray-500 uppercase tracking-[0.3em]">System_Infrastructure</h2>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-black text-white italic tracking-tighter uppercase leading-none">
                        SECURE <span className="text-accent-rose">VAULT</span>
                    </h1>
                    <p className="text-gray-400 font-display font-bold text-sm mt-6 max-w-xl">
                        Calibrate terminal protocols and interface preferences. All changes are synchronized to the local neural-link.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Interface Calibration */}
                <div className="space-y-6">
                    <h3 className="font-display font-black text-white text-xs tracking-[0.2em] uppercase flex items-center gap-3 ml-4">
                        <Monitor className="w-4 h-4 text-accent-cyan" />
                        INTERFACE_CALIBRATION
                    </h3>
                    
                    <Card className="p-2 border-white/5 bg-white/[0.02] divide-y divide-white/5">
                        {[
                            { key: 'compactCards', label: 'COMPACT_INTERFACE', desc: 'Squeeze terminal cards for high-density monitoring.', icon: Command },
                            { key: 'highContrast', label: 'ULTRA_CONTRAST', desc: 'Enhanced retinal clarity for low-light operations.', icon: Zap },
                            { key: 'reducedMotion', label: 'STABLE_AXIS', desc: 'Disables kinetic interface transitions.', icon: Shield },
                            { key: 'tacticalMode', label: 'TACTICAL_MODE', desc: 'Performance focus. Disables heavy neural blur filters.', icon: Monitor },
                        ].map((item) => (
                            <div key={item.key} className="p-6 flex items-center justify-between group hover:bg-white/[0.02] transition-colors">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-accent-cyan/30 transition-all">
                                        <item.icon className="w-5 h-5 text-gray-500 group-hover:text-accent-cyan" />
                                    </div>
                                    <div>
                                        <p className="font-display font-black text-white text-[10px] tracking-widest uppercase mb-1">{item.label}</p>
                                        <p className="text-[10px] text-gray-500 font-display font-bold tracking-wider">{item.desc}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onToggle(item.key)}
                                    className={cn(
                                        "w-14 h-7 rounded-full transition-all relative",
                                        preferences[item.key] ? 'bg-accent-cyan' : 'bg-white/10'
                                    )}
                                >
                                    <div className={cn(
                                        "absolute top-1 left-1 h-5 w-5 bg-white rounded-full transition-all duration-300 shadow-xl",
                                        preferences[item.key] ? 'translate-x-7' : 'translate-x-0'
                                    )} />
                                </button>
                            </div>
                        ))}
                    </Card>
                </div>

                {/* Security Protocols */}
                <div className="space-y-6">
                    <h3 className="font-display font-black text-white text-xs tracking-[0.2em] uppercase flex items-center gap-3 ml-4">
                        <Fingerprint className="w-4 h-4 text-accent-rose" />
                        SECURITY_PROTOCOLS
                    </h3>

                    <Card className="p-8 border-white/5 bg-white/[0.02] space-y-8">
                        <div>
                            <p className="font-display font-black text-white text-[10px] tracking-widest uppercase mb-2">DOSSIER_VISIBILITY</p>
                            <p className="text-[10px] text-gray-500 font-display font-bold tracking-wider mb-6">Determines how your dossier appears on public frequency scans.</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {[
                                    { id: 'public', label: 'GLOBAL', icon: Globe },
                                    { id: 'friends', label: 'SQUAD-ONLY', icon: Fingerprint },
                                    { id: 'private', label: 'DARK_MODE', icon: Lock }
                                ].map((level) => (
                                    <button
                                        key={level.id}
                                        onClick={() => onVisibility(level.id)}
                                        className={cn(
                                            "flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border transition-all group",
                                            preferences.profileVisibility === level.id 
                                                ? 'bg-accent-rose/10 border-accent-rose/30 text-accent-rose' 
                                                : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20 hover:text-white'
                                        )}
                                    >
                                        <level.icon className="w-5 h-5" />
                                        <span className="font-display font-black text-[9px] tracking-[.3em]">{level.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5">
                            <Button variant="ghost" className="w-full text-accent-rose border-accent-rose/20 hover:bg-accent-rose/10 uppercase tracking-widest font-black text-[10px] py-4">
                                INITIALIZE_FACTORY_RESET
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
