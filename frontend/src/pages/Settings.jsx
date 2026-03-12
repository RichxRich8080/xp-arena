import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useNotifications } from '../hooks/useNotifications';

export default function Settings() {
    const { addNotification } = useNotifications();
    const [preferences, setPreferences] = useState(() => {
        const saved = localStorage.getItem('xp_settings');
        return saved ? JSON.parse(saved) : {
            compactCards: false,
            highContrast: false,
            reducedMotion: false,
            profileVisibility: 'public'
        };
    });

    const onToggle = (key) => {
        const next = { ...preferences, [key]: !preferences[key] };
        setPreferences(next);
        localStorage.setItem('xp_settings', JSON.stringify(next));
        addNotification('Settings Saved', `${key} updated successfully.`, 'success');
    };

    const onVisibility = (value) => {
        const next = { ...preferences, profileVisibility: value };
        setPreferences(next);
        localStorage.setItem('xp_settings', JSON.stringify(next));
        addNotification('Settings Saved', `Profile visibility set to ${value}.`, 'success');
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-4">
            <div>
                <h1 className="text-2xl font-black text-white uppercase tracking-wide">Settings</h1>
                <p className="text-sm text-gray-400">Personalize the arena experience.</p>
            </div>

            <Card className="theme-surface p-5 space-y-4">
                <h2 className="text-sm uppercase tracking-widest text-gray-300 font-bold">Interface</h2>
                {[
                    { key: 'compactCards', label: 'Compact Cards', desc: 'Reduce whitespace in cards.' },
                    { key: 'highContrast', label: 'High Contrast', desc: 'Increase contrast for readability.' },
                    { key: 'reducedMotion', label: 'Reduced Motion', desc: 'Minimize animation movement.' },
                ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between border border-white/10 rounded-xl p-3">
                        <div>
                            <p className="text-sm font-semibold text-white">{item.label}</p>
                            <p className="text-xs text-gray-400">{item.desc}</p>
                        </div>
                        <button
                            onClick={() => onToggle(item.key)}
                            className={`w-14 h-8 rounded-full transition-all ${preferences[item.key] ? 'bg-emerald-500/80' : 'bg-gray-700'}`}
                        >
                            <span className={`block h-6 w-6 bg-white rounded-full transition-transform ${preferences[item.key] ? 'translate-x-7' : 'translate-x-1'}`} />
                        </button>
                    </div>
                ))}
            </Card>

            <Card className="theme-surface p-5 space-y-4">
                <h2 className="text-sm uppercase tracking-widest text-gray-300 font-bold">Profile Visibility</h2>
                <div className="flex gap-2">
                    {['public', 'friends', 'private'].map((level) => (
                        <Button
                            key={level}
                            variant={preferences.profileVisibility === level ? 'neonCyan' : 'secondary'}
                            size="sm"
                            onClick={() => onVisibility(level)}
                            className="capitalize"
                        >
                            {level}
                        </Button>
                    ))}
                </div>
            </Card>
        </div>
    );
}
