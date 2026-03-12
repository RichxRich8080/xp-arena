import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Sparkles, Lock, Unlock, Zap, Activity, Info, ChevronRight, Gift } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

export default function Mystery() {
    const { axp, triggerAreniPulse, subtractAXP, addAXP } = useAuth();
    const { addNotification } = useNotifications();
    const [isOpening, setIsOpening] = useState(false);
    const [reward, setReward] = useState(null);

    const handleOpen = () => {
        if (axp < 500) {
            addNotification('Access Denied', 'Insufficient AXP tokens for decryption.', 'error');
            return;
        }
        
        setIsOpening(true);
        subtractAXP(500);

        setTimeout(() => {
            setIsOpening(false);
            const rewards = [
                { type: 'AXP', val: '1,200', name: 'NEURAL_OVERLOAD', rarity: 'RARE', color: 'text-accent-cyan' },
                { type: 'AXP', val: '5,000', name: 'MATRIX_BREAKER', rarity: 'ELITE', color: 'text-axp-gold' },
                { type: 'AXP', val: '600', name: 'SIGNAL_BOOST', rarity: 'COMMON', color: 'text-gray-400' }
            ];
            const result = rewards[Math.floor(Math.random() * rewards.length)];
            setReward(result);
            if (result.type === 'AXP') addAXP(parseInt(result.val.replace(',', '')));
            
            addNotification('Decryption Successful', `${result.name} package acquired.`, 'success');
            triggerAreniPulse();
        }, 2500);
    };

    return (
        <div className="space-y-16 pb-20 animate-slide-in font-display">
            {/* Header */}
            <div className="text-center space-y-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-4">
                    <div className="h-1px w-10 bg-axp-gold/50" />
                    <span className="text-[10px] font-black italic text-axp-gold uppercase tracking-[0.5em]">Secret_Storage_Node</span>
                    <div className="h-1px w-10 bg-axp-gold/50" />
                </div>
                <h1 className="text-5xl md:text-7xl font-black italic text-white tracking-tighter uppercase leading-none">
                    MYSTERY <span className="text-axp-gold text-glow-gold">VAULT</span>
                </h1>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-lg mx-auto italic">
                    Decrypt high-tier reward packages using your earned AXP tokens to unlock rare neural boosters and credits.
                </p>
            </div>

            {/* Mystery Box HUD */}
            <div className="max-w-md mx-auto relative group">
                <div className={cn(
                    "absolute -inset-10 bg-axp-gold/5 blur-[100px] transition-all duration-1000 rounded-full",
                    isOpening ? "opacity-100 scale-150 animate-pulse" : "opacity-40"
                )} />
                
                <Card className="relative p-16 border-axp-gold/20 bg-axp-gold/[0.02] flex flex-col items-center justify-center min-h-[500px] rounded-[4rem] overflow-hidden">
                    <div className="scanline opacity-10" />
                    
                    <div className={cn(
                        "relative z-10 transition-all duration-1000 flex flex-col items-center gap-12",
                        isOpening ? "scale-90 blur-sm brightness-150" : "scale-100"
                    )}>
                        {reward ? (
                            <div className="text-center space-y-8 animate-in zoom-in duration-500">
                                <div className="space-y-2">
                                    <span className={cn("text-[10px] font-black uppercase tracking-[0.5em] italic", reward.color)}>{reward.rarity}_DECRYPTED</span>
                                    <h3 className="text-4xl font-black italic text-white tracking-tighter uppercase leading-tight">{reward.name}</h3>
                                </div>
                                <div className="text-5xl font-black text-white font-mono tracking-tighter">
                                    <span className="text-axp-gold">+</span>{reward.val} <span className="text-xs text-gray-500">AXP</span>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    onClick={() => setReward(null)}
                                    className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white"
                                >
                                    BACK_TO_TERMINAL
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="relative">
                                    <div className={cn(
                                        "w-48 h-48 rounded-[3.5rem] bg-background border-2 border-axp-gold/30 flex items-center justify-center shadow-[0_0_60px_rgba(251,191,36,0.15)] transition-all duration-700",
                                        isOpening ? "rotate-[360deg] scale-110" : "group-hover:scale-105 group-hover:-rotate-3"
                                    )}>
                                        <Gift className="w-20 h-20 text-axp-gold" />
                                    </div>
                                    <div className="absolute -top-4 -right-4 bg-axp-gold text-background p-4 rounded-3xl shadow-2xl group-hover:scale-110 transition-transform">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="text-center space-y-8 w-full">
                                    <div className="space-y-2">
                                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">DECRYPTION_COST</span>
                                        <div className="text-4xl font-black text-white italic tracking-widest">500 <span className="text-xs text-axp-gold font-bold">AXP</span></div>
                                    </div>

                                    <Button
                                        onClick={handleOpen}
                                        disabled={isOpening || axp < 500}
                                        className="w-full py-8 bg-axp-gold hover:bg-white text-background font-black uppercase italic tracking-[0.4em] text-[11px] shadow-[0_20px_40px_rgba(251,191,36,0.15)] transition-all group/btn"
                                    >
                                        <span className="flex items-center justify-center gap-4">
                                            {isOpening ? 'DECRYPTING_PACKET...' : 'INITIALIZE_UNLOCK'}
                                            {!isOpening && <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />}
                                        </span>
                                    </Button>
                                    
                                    {axp < 500 && (
                                        <p className="text-[9px] text-accent-rose font-black uppercase tracking-widest italic animate-pulse">
                                            INSUFFICIENT_FUNDS_IN_WALLET
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </Card>
            </div>

            {/* Odds Footer */}
            <div className="space-y-8">
                 <div className="flex items-center gap-4 ml-4">
                    <Activity className="w-4 h-4 text-gray-500" />
                    <h3 className="text-[10px] font-black text-gray-500 tracking-[0.4em] uppercase">RARITY_DROP_PROBABILITIES</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'COMMON_PACK_NODE', rate: '70%', color: 'text-gray-500', bg: 'bg-white/5' },
                        { label: 'RARE_SYNC_PACK', rate: '25%', color: 'text-accent-cyan', bg: 'bg-accent-cyan/10' },
                        { label: 'ELITE_MATRIX_PACK', rate: '05%', color: 'text-axp-gold', bg: 'bg-axp-gold/10' }
                    ].map((pack, i) => (
                        <div key={i} className={cn("p-8 glass-panel border-white/5 transition-all hover:border-white/20 flex items-center justify-between", pack.bg)}>
                            <span className="text-[9px] font-black text-white uppercase tracking-widest leading-none">{pack.label}</span>
                            <span className={cn("text-xl font-black italic tracking-tighter", pack.color)}>{pack.rate}</span>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="flex justify-center">
                <div className="glass-panel border-white/5 bg-white/[0.01] p-6 flex items-center gap-6 max-w-lg opacity-30 text-center">
                   <Info className="w-5 h-5 text-gray-600 shrink-0" />
                   <p className="text-[8px] text-gray-700 font-bold uppercase tracking-[0.4em] leading-relaxed italic">
                      SECURE_ENCRYPTION_LAYER_v9. RANDOM_NODE_GENERATION_VERIFIED_BY_SYNDICATE_ARCHITECTS.
                   </p>
                </div>
            </div>
        </div>
    );
}
