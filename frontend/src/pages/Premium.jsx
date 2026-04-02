import React, { useState } from 'react';
import { Target, Shield, Zap, Award, Check, ChevronRight, Star, Gem, CreditCard, Activity, Cpu, ArrowRight, Lock, Crown, Sparkles, Users, Trophy, Gift, Flame, Infinity as InfinityIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

const PlanCard = ({ name, price, period, features, highlighted, icon, onSelect }) => (
    <div className={cn(
        "card-gaming p-8 relative overflow-hidden group",
        highlighted && "border-amber-500/30 shadow-[0_0_60px_rgba(245,158,11,0.1)]"
    )}>
        {/* Popular Badge */}
        {highlighted && (
            <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-background px-4 py-1.5 rounded-bl-xl text-[10px] font-bold uppercase tracking-wider">
                Most Popular
            </div>
        )}
        
        {/* Background Glow */}
        {highlighted && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] -z-10" />
        )}
        
        {/* Icon */}
        <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
            highlighted ? "bg-gradient-to-br from-amber-500 to-orange-500 shadow-glow-amber" : "bg-surface-elevated border border-white/[0.06]"
        )}>
            {React.createElement(icon, { className: cn("w-8 h-8", highlighted ? "text-background" : "text-slate-400") })}
        </div>
        
        {/* Plan Info */}
        <div className="mb-6">
            <h3 className="font-display font-bold text-white text-xl mb-2">{name}</h3>
            <div className="flex items-baseline gap-2">
                <span className="text-4xl font-display font-black text-white">{price}</span>
                {period && <span className="text-sm text-slate-500">/{period}</span>}
            </div>
        </div>
        
        {/* Features */}
        <div className="space-y-3 mb-8">
            {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                    <div className={cn(
                        "w-5 h-5 rounded-lg flex items-center justify-center",
                        highlighted ? "bg-amber-500/20 text-amber-400" : "bg-primary/10 text-primary"
                    )}>
                        <Check className="w-3 h-3" />
                    </div>
                    <span className="text-sm text-slate-300">{feature}</span>
                </div>
            ))}
        </div>
        
        {/* CTA */}
        <Button 
            onClick={onSelect}
            className={cn(
                "w-full py-4",
                highlighted ? "btn-gaming" : "btn-secondary"
            )}
        >
            {highlighted ? "Upgrade Now" : "Get Started"}
            <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
    </div>
);

const Premium = () => {
    const [billingPeriod, setBillingPeriod] = useState('monthly');
    
    const plans = [
        {
            name: "Free",
            price: "$0",
            period: null,
            icon: Shield,
            features: [
                "Basic sensitivity calculator",
                "5 preset saves",
                "Community access",
                "Standard support"
            ]
        },
        {
            name: "Pro",
            price: billingPeriod === 'monthly' ? "$9.99" : "$99",
            period: billingPeriod === 'monthly' ? "month" : "year",
            icon: Crown,
            highlighted: true,
            features: [
                "Everything in Free",
                "AI-powered calibration",
                "Unlimited preset saves",
                "20% XP boost permanent",
                "Priority guild access",
                "Ad-free experience",
                "Exclusive profile badge"
            ]
        },
        {
            name: "Team",
            price: billingPeriod === 'monthly' ? "$29.99" : "$299",
            period: billingPeriod === 'monthly' ? "month" : "year",
            icon: Users,
            features: [
                "Everything in Pro",
                "Up to 10 team members",
                "Team analytics dashboard",
                "Custom guild branding",
                "Priority tournament entry",
                "Dedicated support"
            ]
        }
    ];

    const proFeatures = [
        { icon: Sparkles, title: "AI Sensitivity Engine", desc: "Advanced algorithms for perfect aim calibration" },
        { icon: Zap, title: "20% XP Boost", desc: "Level up faster with permanent XP bonus" },
        { icon: InfinityIcon, title: "Unlimited Presets", desc: "Save and share unlimited configurations" },
        { icon: Trophy, title: "Tournament Priority", desc: "Early access to exclusive tournaments" },
        { icon: Gift, title: "Monthly Rewards", desc: "Exclusive mystery boxes every month" },
        { icon: Flame, title: "Premium Badge", desc: "Stand out with exclusive profile flair" },
    ];

    return (
        <div className="space-y-16 pb-20 animate-fade-in">
            {/* Hero Section */}
            <div className="text-center space-y-8 max-w-3xl mx-auto">
                {/* Badge */}
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
                    <Gem className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Premium Membership</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tight leading-tight">
                    Unlock Your Full
                    <span className="block text-gradient-gold">Gaming Potential</span>
                </h1>
                
                <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
                    Join thousands of elite players who have upgraded their game with premium tools, 
                    exclusive rewards, and advanced features.
                </p>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center gap-4">
                    <button 
                        onClick={() => setBillingPeriod('monthly')}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-sm font-semibold transition-all",
                            billingPeriod === 'monthly' ? "bg-primary text-background" : "text-slate-400 hover:text-white"
                        )}
                    >
                        Monthly
                    </button>
                    <button 
                        onClick={() => setBillingPeriod('yearly')}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2",
                            billingPeriod === 'yearly' ? "bg-primary text-background" : "text-slate-400 hover:text-white"
                        )}
                    >
                        Yearly
                        <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full">Save 17%</span>
                    </button>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {plans.map((plan, i) => (
                    <PlanCard 
                        key={i} 
                        {...plan} 
                        onSelect={() => console.log(`Selected ${plan.name}`)}
                    />
                ))}
            </div>

            {/* Pro Features Grid */}
            <div className="space-y-10 max-w-5xl mx-auto">
                <div className="text-center">
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
                        Everything in <span className="text-gradient-gold">Premium</span>
                    </h2>
                    <p className="text-slate-400">Powerful features to dominate the arena</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {proFeatures.map((feature, i) => (
                        <div key={i} className="card-gaming p-6 group">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <feature.icon className="w-6 h-6 text-amber-500" />
                            </div>
                            <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-sm text-slate-500">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ */}
            <div className="max-w-2xl mx-auto space-y-6">
                <h2 className="text-2xl font-display font-bold text-white text-center mb-8">
                    Frequently Asked Questions
                </h2>
                
                {[
                    { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period." },
                    { q: "Do I keep my presets if I cancel?", a: "Yes, all your saved presets remain accessible. Premium-only presets will be read-only until you resubscribe." },
                    { q: "Is there a refund policy?", a: "We offer a 7-day money-back guarantee for first-time subscribers." },
                ].map((faq, i) => (
                    <div key={i} className="card-gaming p-6">
                        <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                        <p className="text-sm text-slate-400">{faq.a}</p>
                    </div>
                ))}
            </div>

            {/* Trust Section */}
            <div className="flex flex-col items-center gap-6 pt-8 border-t border-white/[0.06]">
                <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-semibold text-slate-500">Secure 256-bit SSL Payment Processing</span>
                </div>
                <div className="flex gap-8 items-center opacity-50">
                    <span className="text-lg font-bold text-white">VISA</span>
                    <span className="text-lg font-bold text-white">MASTERCARD</span>
                    <span className="text-lg font-bold text-white">APPLE PAY</span>
                    <span className="text-lg font-bold text-white">GOOGLE PAY</span>
                </div>
            </div>
        </div>
    );
};

export default Premium;
