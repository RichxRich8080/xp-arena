import React, { useEffect, useState } from 'react';
import { Palette, X, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

const THEMES = [
    { id: 'midnight', name: 'Midnight', bg: '#0b0f1a', surface: '#111827', primary: '#1e3a8a', accent: '#06b6d4', highlight: '#22c55e' },
    { id: 'ember', name: 'Ember', bg: '#120d12', surface: '#1f111a', primary: '#7c2d12', accent: '#f97316', highlight: '#facc15' },
    { id: 'violet', name: 'Violet', bg: '#0d1020', surface: '#181b31', primary: '#6d28d9', accent: '#a78bfa', highlight: '#22d3ee' },
    { id: 'neon', name: 'Neon', bg: '#06141a', surface: '#0c1d25', primary: '#0891b2', accent: '#22d3ee', highlight: '#34d399' },
];

function applyTheme(theme) {
    const root = document.documentElement;
    root.style.setProperty('--app-bg', theme.bg);
    root.style.setProperty('--app-surface', theme.surface);
    root.style.setProperty('--app-primary', theme.primary);
    root.style.setProperty('--app-accent', theme.accent);
    root.style.setProperty('--app-highlight', theme.highlight);
}

export function PaletteButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTheme, setActiveTheme] = useState(() => localStorage.getItem('xp_theme') || 'midnight');

    useEffect(() => {
        const nextTheme = THEMES.find((item) => item.id === activeTheme) || THEMES[0];
        applyTheme(nextTheme);
        localStorage.setItem('xp_theme', nextTheme.id);
    }, [activeTheme]);

    const onChooseTheme = (theme) => {
        setActiveTheme(theme.id);
        applyTheme(theme);
    };

    return (
        <div className="fixed bottom-24 right-20 z-50">
            <div
                className={cn(
                    'absolute bottom-16 right-0 w-56 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right theme-surface',
                    isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
                )}
            >
                <div className="flex justify-between items-center p-3 border-b border-gray-800/80 bg-black/20 backdrop-blur-sm">
                    <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Theme Palette</span>
                    <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="p-2 space-y-2">
                    {THEMES.map((theme) => (
                        <button
                            key={theme.id}
                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                            onClick={() => onChooseTheme(theme)}
                        >
                            <div className="w-10 h-6 rounded border border-gray-700 overflow-hidden flex">
                                <div className="flex-1" style={{ backgroundColor: theme.primary }} />
                                <div className="flex-1" style={{ backgroundColor: theme.accent }} />
                                <div className="flex-1" style={{ backgroundColor: theme.highlight }} />
                            </div>
                            <div className="text-left flex-1">
                                <p className="text-xs font-semibold text-gray-200">{theme.name}</p>
                                <p className="text-[10px] text-gray-500 uppercase">{theme.id}</p>
                            </div>
                            {activeTheme === theme.id && <Check className="w-4 h-4 text-emerald-400" />}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95',
                    isOpen
                        ? 'bg-gray-800 text-white border border-gray-700'
                        : 'text-gray-900 shadow-[0_4px_20px_rgba(34,197,94,0.4)]'
                )}
                style={!isOpen ? { backgroundImage: 'linear-gradient(135deg, var(--app-highlight), var(--app-accent))' } : undefined}
            >
                <Palette className="w-6 h-6" />
            </button>
        </div>
    );
}
