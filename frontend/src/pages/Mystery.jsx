import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Sparkles, Lock, Unlock, Zap, Activity, Info, ChevronRight, Gift, Package, ShieldCheck } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

import { mysteryService } from '../services/api';

export default function Mystery() {
    const { user, syncUser } = useAuth();
    const points = user?.axp || 0;
    const { addNotification } = useNotifications();
    const [isOpening, setIsOpening] = useState(false);
    const [reward, setReward] = useState(null);

    const handleOpen = async () => {
        if (points < 500) {
            addNotification('Access Denied', 'You need at least 500 Points to open this chest.', 'error');
            return;
        }
        
        setIsOpening(true);

        try {
            const { data } = await mysteryService.decryptNode();
            
            if (data.success) {
                setTimeout(async () => {
                    setIsOpening(false);
                    setReward(data.reward);
                    addNotification('Chest Unlocked', `You received a ${data.reward.name}.`, 'success');
                    await syncUser();
                }, 2500);
            }
        } catch (error) {
            setIsOpening(false);
            addNotification('System Error', error.message, 'error');
        }
    };

    return (
        <div className="space-y-12 pb-20 animate-fade-in font-sans">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-white/5 shadow-sm">
                <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none select-none">
                    <Package className="w-64 h-64" />
                </div>
                
                <div className="relative p-8 md:p-12 text-center space-y-6 max-w-2xl mx-auto">
                    <div className="flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 w-fit mx-auto">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Premium Rewards</span>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-none uppercase">
                            Reward <span className="text-amber-500">Chest</span>
                        </h1>
                        <p className="text-slate-400 text-sm md:text-base leading-relaxed font-medium">
                            Use your earned Points to unlock exclusive reward chests containing rare items, boosts, and bonus credits.
                        </p>
                    </div>
                </div>
            </div>

            {/* Mystery Box HUD */}
            <div className="max-w-md mx-auto relative group">
                <div className={cn(
                    "absolute -inset-10 bg-amber-500/5 blur-[100px] transition-all duration-1000 rounded-full",
                    isOpening ? "opacity-100 scale-150 animate-pulse" : "opacity-40"
                )} />
                
                <Card className="relative p-12 md:p-16 border-white/5 bg-slate-900 shadow-2xl flex flex-col items-center justify-center min-h-[500px] rounded-[3rem] overflow-hidden">
                    <div className={cn(
                        "relative z-10 transition-all duration-1000 flex flex-col items-center gap-12",
                        isOpening ? "scale-90 blur-sm brightness-150" : "scale-100"
                    )}>
                        {reward ? (
                            <div className="text-center space-y-8 animate-fade-in">
                                <div className="space-y-4">
                                    <span className={cn("px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-slate-800 border border-white/10", reward.color)}>
                                        {reward.rarity} Found
                                    </span>
                                    <h3 className="text-4xl font-bold text-white tracking-tight uppercase leading-tight">{reward.name}</h3>
                                </div>
                                <div className="text-5xl font-bold text-white tracking-tighter">
                                    <span className="text-amber-500">+</span>{reward.val} <span className="text-xs text-slate-500 uppercase tracking-widest">Points</span>
                                </div>
                                <Button 
                                    variant="secondary" 
                                    onClick={() => setReward(null)}
                                    className="px-8 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-slate-800 text-slate-400 hover:text-white border-white/5"
                                >
                                    Return to Chest
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="relative">
                                    <div className={cn(
                                        "w-48 h-48 rounded-[2.5rem] bg-slate-800 border-2 border-white/5 flex items-center justify-center shadow-xl transition-all duration-700",
                                        isOpening ? "rotate-[360deg] scale-110" : "group-hover:scale-105"
                                    )}>
                                        <Gift className="w-20 h-20 text-amber-500" />
                                    </div>
                                    <div className="absolute -top-4 -right-4 bg-amber-500 text-slate-950 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="text-center space-y-8 w-full">
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Unlocking Cost</span>
                                        <div className="text-4xl font-bold text-white tracking-tight">500 <span className="text-sm text-amber-500 font-bold uppercase tracking-widest">Points</span></div>
                                    </div>

                                    <Button
                                        onClick={handleOpen}
                                        disabled={isOpening || points < 500}
                                        className="w-full py-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg transition-all group/btn"
                                    >
                                        <span className="flex items-center justify-center gap-3">
                                            {isOpening ? 'Opening Chest...' : 'Unlock Now'}
                                            {!isOpening && <ChevronRight className="w-4 h-4" />}
                                        </span>
                                    </Button>
                                    
                                    {points < 500 && (
                                        <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest italic animate-pulse">
                                            Insufficient Point Balance
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </Card>
            </div>

            {/* Probabilities */}
            <div className="space-y-6">
                 <div className="flex items-center gap-3 px-2">
                    <Activity className="w-4 h-4 text-slate-500" />
                    <h3 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Reward Probabilities</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: 'Standard Pack', rate: '70%', color: 'text-slate-400', bg: 'bg-slate-900/50' },
                        { label: 'Advanced Pack', rate: '25%', color: 'text-primary', bg: 'bg-primary/5' },
                        { label: 'Premium Pack', rate: '5%', color: 'text-amber-500', bg: 'bg-amber-500/5' }
                    ].map((pack, i) => (
                        <Card key={i} className={cn("p-8 border-white/5 transition-all hover:border-white/10 rounded-2xl flex items-center justify-between", pack.bg)}>
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">{pack.label}</span>
                            <span className={cn("text-xl font-bold tracking-tight", pack.color)}>{pack.rate}</span>
                        </Card>
                    ))}
                </div>
            </div>
            
            <div className="flex justify-center flex-col items-center gap-4 opacity-20">
                <div className="flex items-center gap-6">
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <div className="h-px w-16 bg-white/20" />
                    <Gift className="w-4 h-4 text-white" />
                </div>
                <p className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.4em]">Randomized Reward Logic Verified</p>
            </div>
        </div>
    );
}
