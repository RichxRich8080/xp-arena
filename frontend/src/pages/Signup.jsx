import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { UserPlus, ChevronRight, Activity, ShieldCheck, Mail, Lock, User } from 'lucide-react';
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
            setError("Confirmation Mismatch");
            addNotification('Error', 'Passwords do not match.', 'error');
            return;
        }

        if (formData.password.length < 6) {
            setError("Password Too Short");
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

    return (
        <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 animate-fade-in font-sans">
            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center shadow-lg mb-6 hover:scale-105 transition-transform">
                        <UserPlus className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight uppercase">
                        System <span className="text-primary">Registration</span>
                    </h1>
                    <p className="text-slate-500 text-sm font-medium">
                        Initialize your profile to begin your performance optimization journey.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Card className="p-8 border-white/5 bg-slate-900/50 space-y-6 rounded-3xl">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3">
                                <Activity className="w-4 h-4 text-red-500 shrink-0" />
                                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Username</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Choose a username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-4 pl-12 text-sm text-white focus:outline-none focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-4 pl-12 text-sm text-white focus:outline-none focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-4 pl-12 text-sm text-white focus:outline-none focus:border-primary transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Confirm</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        required
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-4 pl-12 text-sm text-white focus:outline-none focus:border-primary transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full py-6 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 group disabled:opacity-30"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Card>
                </form>

                <div className="text-center space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-white/5" />
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Already a member?</span>
                        <div className="h-px flex-1 bg-white/5" />
                    </div>
                    
                    <button
                        onClick={() => navigate('/login')}
                        className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] hover:text-white transition-colors border border-primary/20 hover:border-white/20 px-8 py-3 rounded-full"
                    >
                        Return to Authentication
                    </button>
                    
                    <div className="flex items-center justify-center gap-3 pt-8 opacity-20">
                        <ShieldCheck className="w-4 h-4 text-white" />
                        <p className="text-[8px] text-white font-bold uppercase tracking-[0.5em] leading-none">
                            Identity Verified System
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
