import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { UserPlus, ChevronRight, Activity, ShieldCheck, Mail, Lock, User, Sparkles, Gamepad2, Trophy, Zap } from 'lucide-react';
import { cn } from '../utils/cn';

export default function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { signup } = useAuth();
    const { addNotification } = useNotifications();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            addNotification('Error', 'Passwords do not match.', 'error');
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            addNotification('Error', 'Password must be at least 6 characters.', 'error');
            return;
        }

        setIsLoading(true);

        try {
            await signup(formData.username, formData.email, formData.password);
            addNotification('Account Created', 'Registration successful. You can now sign in.', 'success');
            navigate('/login');
        } catch (err) {
            const msg = typeof err === 'string' ? err : (err?.message || 'Registration failure.');
            setError(msg);
            addNotification('Error', msg, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const benefits = [
        { icon: Trophy, label: 'Track Your Progress', desc: 'Detailed analytics and stats' },
        { icon: Zap, label: 'Optimized Sensitivity', desc: 'AI-powered calibration' },
        { icon: Sparkles, label: 'Exclusive Rewards', desc: 'Earn XP and unlock items' },
    ];

    return (
        <div className="min-h-[90vh] flex flex-col items-center justify-center p-4 animate-fade-in relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent-cyan/5" />
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl" />
            
            <div className="relative w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center space-y-6">
                    <div className="relative mx-auto w-20 h-20">
                        <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl animate-pulse" />
                        <div className="relative w-full h-full bg-surface-elevated/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl flex items-center justify-center shadow-glow-sm">
                            <UserPlus className="w-10 h-10 text-primary" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
                            <span className="text-white">Join</span>
                            <span className="text-gradient"> XP Arena</span>
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Create your account and start your gaming journey
                        </p>
                    </div>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-3 gap-3">
                    {benefits.map((benefit, i) => (
                        <div key={i} className="p-3 rounded-xl bg-surface-elevated/40 border border-white/[0.04] text-center">
                            <benefit.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                            <div className="text-[10px] font-bold text-white uppercase tracking-wider">{benefit.label}</div>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="p-8 card-gaming space-y-6">
                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3">
                                <Activity className="w-5 h-5 text-rose-400 shrink-0" />
                                <span className="text-sm font-medium text-rose-400">{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Username</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Choose a username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                    className="w-full bg-surface-elevated/80 border border-white/[0.08] rounded-xl p-4 pl-12 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="w-full bg-surface-elevated/80 border border-white/[0.08] rounded-xl p-4 pl-12 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input
                                        type="password"
                                        placeholder="Min 6 characters"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        className="w-full bg-surface-elevated/80 border border-white/[0.08] rounded-xl p-4 pl-12 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Confirm</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input
                                        type="password"
                                        placeholder="Repeat password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        required
                                        className="w-full bg-surface-elevated/80 border border-white/[0.08] rounded-xl p-4 pl-12 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={cn(
                                "relative w-full py-4 rounded-xl font-display font-bold text-sm uppercase tracking-widest transition-all overflow-hidden group",
                                isLoading 
                                    ? "bg-surface-elevated text-slate-500 cursor-not-allowed" 
                                    : "bg-gradient-to-r from-primary to-accent-cyan text-white shadow-glow-sm hover:shadow-glow-md"
                            )}
                        >
                            {!isLoading && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            )}
                            <span className="relative flex items-center justify-center gap-3">
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                        </button>
                    </Card>
                </form>

                <div className="text-center space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Already a Member?</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>
                    
                    <button
                        onClick={() => navigate('/login')}
                        className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-accent-cyan transition-colors border border-primary/20 hover:border-accent-cyan/40 px-8 py-3 rounded-xl hover:bg-primary/5"
                    >
                        Sign In Instead
                    </button>
                    
                    <p className="text-xs text-slate-600">
                        By creating an account, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
}
