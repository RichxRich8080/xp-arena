import React, { useState } from 'react';
import { Palette, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export function PaletteButton() {
    const [isOpen, setIsOpen] = useState(false);

    const colors = [
        { name: 'Background', hex: '#0b0f1a', class: 'bg-[#0b0f1a]' },
        { name: 'Primary Blue', hex: '#1e3a8a', class: 'bg-[#1e3a8a]' },
        { name: 'Neon Green', hex: '#22c55e', class: 'bg-[#22c55e]' },
        { name: 'Accent Cyan', hex: '#06b6d4', class: 'bg-[#06b6d4]' },
        { name: 'Text', hex: '#e5e7eb', class: 'bg-[#e5e7eb]' },
    ];

    return (
        <div className="fixed bottom-24 right-4 z-40">
            {/* Overlay Panel */}
            <div
                className={cn(
                    "absolute bottom-16 right-0 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right",
                    isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
                )}
            >
                <div className="flex justify-between items-center p-3 border-b border-gray-800 bg-gray-900/90 backdrop-blur-sm">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Theme Palette</span>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-500 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="p-2 space-y-2">
                    {colors.map((color) => (
                        <div key={color.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                            <div className={`w-6 h-6 rounded border border-gray-700 ${color.class}`}></div>
                            <div>
                                <p className="text-xs font-medium text-gray-200">{color.name}</p>
                                <p className="text-[10px] text-gray-500 uppercase">{color.hex}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95",
                    isOpen
                        ? "bg-gray-800 text-white border border-gray-700"
                        : "bg-gradient-to-r from-neon-green to-neon-cyan text-gray-900 shadow-[0_4px_20px_rgba(34,197,94,0.4)] hover:shadow-[0_4px_25px_rgba(6,182,212,0.6)]"
                )}
            >
                <Palette className="w-6 h-6" />
            </button>
        </div>
    );
}
