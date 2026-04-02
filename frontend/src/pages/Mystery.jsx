import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Sparkles, Lock, Unlock, Zap, Activity, Info, ChevronRight, Gift, Package, ShieldCheck, Star, Crown, Flame, Trophy, Gem } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

import { mysteryService } from '../services/api';

const RewardTier = ({ name, rate, color, rewards, icon }) => (
    <div className={cn("card-gaming p-6 relative overflow-hidden group", color)}>
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", 
                    name === 'Legendary' ? "bg-amber-500/20" : 
                    name === 'Epic' ? "bg-purple-500/20" : "bg-slate-500/20"
                )}>
                    {React.createElement(icon, {
                        className: cn("w-5 h-5",
                            name === 'Legendary' ? "text-amber-500" :
                            name === 'Epic' ? "text-purple-400" : "text-slate-400"
                        )
                    })}
                </div>
                <div>
                    <h3 className="font-display font-bold text-white">{name}</h3>
                    <p className="text-[10px] text-slate-500">{rate} drop rate</p>
                </div>
            </div>
        </div>
        <div className="space-y-2">
            {rewards.map((reward, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{reward.name}</span>
                    <span className={cn("font-semibold",
                        name === 'Legendary' ? "text-amber-400" : 
                        name === 'Epic' ? "text-purple-400" : "text-slate-300"
                    )}>{reward.value}</span>
                </div>
            ))}
        </div>
    </div>
);

export default function Mystery() {
    const { user, syncUser } = useAuth();
    const points = user?.axp || 0;
    const { addNotification } = useNotifications();
    const [isOpening, setIsOpening] = useState(false);
    const [reward, setReward] = useState(null);
    const [boxType, setBoxType] = useState('standard');

    const boxes = {
        standard: { cost: 500, name: 'Standard Box', icon: Package },
        premium: { cost: 1500, name: 'Premium Box', icon: Gift },
        legendary: { cost: 5000, name: 'Legendary Box', icon: Crown },
    };

    const currentBox = boxes[boxType];

    const handleOpen = async () => {
        if (points < currentBox.cost) {
            addNotification('Insufficient XP', `You need at least ${currentBox.cost} XP to open this box.`, 'error');
            return;
        }
        
        setIsOpening(true);

        try {
            const { data } = await mysteryService.decryptNode();
            
            if (data.success) {
                setTimeout(async () => {
                    setIsOpening(false);
                    setReward(data.reward);
                    addNotification('Reward Unlocked!', `You received: ${data.reward.name}`, 'success');
                    await syncUser();
                }, 3000);
            }
        } catch (error) {
            setIsOpening(false);
            addNotification('Error', error.message || 'Failed to open box', 'error');
        }
    };

    const rewardTiers = [
        { 
            name: 'Common', 
            rate: '70%', 
            icon: Package,
            rewards: [
                { name: 'XP Bonus', value: '+50-200 XP' },
                { name: 'Profile Frame', value: 'Basic' },
            ]
        },
        { 
            name: 'Epic', 
            rate: '25%', 
            icon: Gem,
            rewards: [
                { name: 'XP Bonus', value: '+500-1000 XP' },
                { name: 'XP Multiplier', value: '2x for 24h' },
                { name: 'Profile Badge', value: 'Rare' },
            ]
        },
        { 
            name: 'Legendary', 
            rate: '5%', 
            icon: Crown,
            rewards: [
                { name: 'XP Bonus', value: '+2000-5000 XP' },
                { name: 'Premium Days', value: '+7 Days' },
                { name: 'Exclusive Title', value: 'Unique' },
            ]
        },
    ];

    return (
        <div className="space-y-10 pb-20 animate-fade-in">
            {/* Header */}
            <div className="card-gaming p-8 md:p-10 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-[80px]" />
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
                </div>
                
                <div className="relative z-10 text-center space-y-6 max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Mystery Rewards</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight">
                        Reward <span className="text-gradient-gold">Vault</span>
                    </h1>
                    <p className="text-slate-400 text-base leading-relaxed">
                        Spend your hard-earned XP to unlock mystery boxes containing exclusive rewards, 
                        XP boosts, premium time, and rare collectibles.
                    </p>
                </div>
            </div>

            {/* Box Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {Object.entries(boxes).map(([key, box]) => (
                    <button
                        key={key}
                        onClick={() => setBoxType(key)}
                        className={cn(
                            "card-gaming p-6 text-center transition-all",
                            boxType === key 
                                ? "border-primary/50 shadow-glow-sm" 
                                : "hover:border-white/10"
                        )}
                    >
                        <div className={cn(
                            "w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-transform",
                            boxType === key ? "scale-110" : "",
                            key === 'legendary' ? "bg-amber-500/20" : 
                            key === 'premium' ? "bg-purple-500/20" : "bg-surface-elevated"
                        )}>
                            <box.icon className={cn(
                                "w-7 h-7",
                                key === 'legendary' ? "text-amber-500" : 
                                key === 'premium' ? "text-purple-400" : "text-slate-400"
                            )} />
                        </div>
                        <h3 className="font-display font-bold text-white mb-1">{box.name}</h3>
                        <div className="flex items-center justify-center gap-1.5">
                            <Zap className="w-4 h-4 text-amber-500" />
                            <span className="font-bold text-amber-400">{box.cost.toLocaleString()} XP</span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Mystery Box Display */}
            <div className="max-w-lg mx-auto">
                <div className={cn(
                    "card-gaming p-12 relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center",
                    boxType === 'legendary' && "border-amber-500/20",
                    boxType === 'premium' && "border-purple-500/20"
                )}>
                    {/* Background Effects */}
                    <div className={cn(
                        "absolute inset-0 transition-all duration-1000",
                        isOpening ? "opacity-100" : "opacity-0"
                    )}>
                        <div className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent animate-pulse" />
                    </div>
                    
                    {reward ? (
                        // Reward Display
                        <div className="text-center space-y-8 animate-scale-in relative z-10">
                            <div className="space-y-4">
                                <span className={cn(
                                    "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                                    reward.rarity === 'Legendary' ? "bg-amber-500/20 text-amber-400" :
                                    reward.rarity === 'Epic' ? "bg-purple-500/20 text-purple-400" :
                                    "bg-slate-500/20 text-slate-300"
                                )}>
                                    {reward.rarity} Reward
                                </span>
                                <h3 className="text-3xl font-display font-black text-white">{reward.name}</h3>
                            </div>
                            
                            <div className={cn(
                                "text-5xl font-display font-black",
                                reward.rarity === 'Legendary' ? "text-gradient-gold" :
                                reward.rarity === 'Epic' ? "text-purple-400" : "text-primary"
                            )}>
                                +{reward.val?.toLocaleString() || 0}
                                <span className="text-lg text-slate-500 ml-2">XP</span>
                            </div>
                            
                            <Button 
                                variant="secondary" 
                                onClick={() => setReward(null)}
                                className="px-8"
                            >
                                Open Another
                            </Button>
                        </div>
                    ) : (
                        // Box Display
                        <div className={cn(
                            "text-center space-y-8 relative z-10 transition-all duration-500",
                            isOpening && "scale-95 blur-sm"
                        )}>
                            <div className="relative">
                                <div className={cn(
                                    "w-40 h-40 rounded-3xl flex items-center justify-center mx-auto transition-all duration-700",
                                    boxType === 'legendary' ? "bg-gradient-to-br from-amber-500/30 to-orange-500/20 border-2 border-amber-500/30" :
                                    boxType === 'premium' ? "bg-gradient-to-br from-purple-500/30 to-pink-500/20 border-2 border-purple-500/30" :
                                    "bg-surface-elevated border-2 border-white/[0.06]",
                                    isOpening && "rotate-[360deg] scale-110"
                                )}>
                                    <currentBox.icon className={cn(
                                        "w-20 h-20",
                                        boxType === 'legendary' ? "text-amber-500" :
                                        boxType === 'premium' ? "text-purple-400" : "text-slate-400"
                                    )} />
                                </div>
                                
                                {/* Lock Icon */}
                                <div className={cn(
                                    "absolute -top-3 -right-3 p-3 rounded-xl shadow-lg",
                                    boxType === 'legendary' ? "bg-amber-500" :
                                    boxType === 'premium' ? "bg-purple-500" : "bg-surface-elevated border border-white/[0.06]"
                                )}>
                                    <Lock className={cn(
                                        "w-5 h-5",
                                        boxType === 'legendary' || boxType === 'premium' ? "text-background" : "text-slate-400"
                                    )} />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cost to Open</span>
                                    <div className="flex items-center justify-center gap-2">
                                        <Zap className="w-6 h-6 text-amber-500" />
                                        <span className="text-4xl font-display font-black text-white">{currentBox.cost.toLocaleString()}</span>
                                        <span className="text-sm text-amber-500 font-bold">XP</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <span className="text-xs text-slate-500">Your Balance: <span className="text-white font-bold">{points.toLocaleString()} XP</span></span>
                                </div>

                                <Button
                                    onClick={handleOpen}
                                    disabled={isOpening || points < currentBox.cost}
                                    className={cn(
                                        "w-full py-4 text-sm font-bold",
                                        boxType === 'legendary' ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-background" :
                                        boxType === 'premium' ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white" :
                                        "btn-gaming"
                                    )}
                                >
                                    {isOpening ? (
                                        <span className="flex items-center gap-2">
                                            <Activity className="w-4 h-4 animate-spin" />
                                            Opening...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Unlock className="w-4 h-4" />
                                            Unlock {currentBox.name}
                                        </span>
                                    )}
                                </Button>
                                
                                {points < currentBox.cost && (
                                    <p className="text-xs text-rose-400 animate-pulse">
                                        Insufficient XP - Need {(currentBox.cost - points).toLocaleString()} more
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Reward Tiers */}
            <div className="space-y-6">
                <h2 className="font-display font-bold text-white text-xl text-center flex items-center justify-center gap-3">
                    <Activity className="w-5 h-5 text-primary" />
                    Possible Rewards
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                    {rewardTiers.map((tier, i) => (
                        <RewardTier key={i} {...tier} />
                    ))}
                </div>
            </div>
            
            {/* Trust Badge */}
            <div className="flex flex-col items-center gap-4 opacity-40">
                <div className="flex items-center gap-4">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <div className="h-px w-12 bg-white/20" />
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <div className="h-px w-12 bg-white/20" />
                    <Gift className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest">
                    Provably Fair RNG System
                </p>
            </div>
        </div>
    );
}
