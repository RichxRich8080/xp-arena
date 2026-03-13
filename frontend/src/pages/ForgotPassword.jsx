import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Mail, ArrowLeft, Activity, Radio, ChevronRight, Lock, Check, Send } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleRecover = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSent(true);
        }, 1500);
    };

    return (
        <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 animate-fade-in font-sans">
            <div className="w-full max-w-lg space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:scale-105 transition-transform">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight uppercase">
                        Credential <span className="text-primary">Recovery</span>
                    </h1>
                    <p className="text-slate-500 text-sm font-medium">
                        Initiate a secure recovery process by providing your registered email address.
                    </p>
                </div>

                <Card className="p-8 md:p-12 border-white/5 bg-slate-900/50 rounded-[2.5rem] shadow-xl overflow-hidden">
                    {sent ? (
                        <div className="text-center space-y-8 py-4 animate-fade-in">
                            <div className="relative mx-auto w-24 h-24">
                                <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse rounded-full" />
                                <div className="relative w-full h-full rounded-3xl bg-slate-900 border border-primary/30 flex items-center justify-center shadow-lg">
                                    <Send className="w-10 h-10 text-primary animate-pulse" />
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Email Sent</h3>
                                <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
                                   Please check your inbox for a password reset link. If you don't see it, check your spam folder.
                                </p>
                            </div>

                            <Button
                                onClick={() => navigate('/login')}
                                className="w-full py-6 rounded-xl font-bold text-xs uppercase tracking-widest bg-white text-slate-950 hover:bg-slate-200"
                            >
                                Return to Login
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleRecover} className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                                    <ShieldAlert className="w-4 h-4 text-slate-600" />
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                        <Mail className="w-5 h-5 text-slate-600 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        required
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-sm text-white focus:outline-none focus:border-primary transition-all font-medium"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-500 font-medium leading-relaxed pl-1 italic">
                                    Security verification will be required to complete the restoration.
                                </p>
                            </div>

                            <Button
                                disabled={loading}
                                type="submit"
                                variant="primary"
                                className="w-full py-6 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 group disabled:opacity-30 relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    {loading ? 'Processing...' : 'Send Reset Link'}
                                    {!loading && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                </span>
                            </Button>

                            <div className="flex justify-center pt-2">
                                <Link 
                                    to="/login" 
                                    className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-all group"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    )}
                </Card>
                
                <div className="flex flex-col items-center gap-4 opacity-20">
                    <div className="flex items-center gap-6">
                        <Lock className="w-4 h-4 text-white" />
                        <div className="h-px w-16 bg-white/20" />
                        <Check className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.4em]">Secure Verification Active</p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
