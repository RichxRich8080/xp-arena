import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LogIn, Activity, ShieldAlert, ChevronRight, Lock, User, Sparkles, Gamepad2 } from 'lucide-react';
import { systemService } from '../services/api';
import { cn } from '../utils/cn';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [serviceMessage, setServiceMessage] = useState('');

    const { login } = useAuth();
    const { addNotification } = useNotifications();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectReason = location.state?.reason || '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await systemService.readiness();
            setServiceMessage('');
        } catch (readyErr) {
            setServiceMessage(readyErr?.message || 'The authentication service is currently optimizing.');
        }
        
        setError('');
        setIsLoading(true);

        try {
            await login(username, password);
            addNotification('Login Successful', 'Authentication established.', 'success');
            const redirectPath = location.state?.from || '/dashboard';
            navigate(redirectPath, { replace: true });
        } catch (err) {
            const msg = typeof err === 'string' ? err : (err?.message || 'Invalid credentials provided.');
            setError(msg);
            addNotification('Login Failed', msg, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] flex flex-col items-center justify-center p-4 animate-fade-in relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent-cyan/5" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl" />
            
            <div className="relative w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center space-y-6">
                    <div className="relative mx-auto w-20 h-20">
                        <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl animate-pulse" />
                        <div className="relative w-full h-full bg-surface-elevated/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl flex items-center justify-center shadow-glow-sm">
                            <Gamepad2 className="w-10 h-10 text-primary" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
                            <span className="text-white">Welcome</span>
                            <span className="text-gradient"> Back</span>
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Sign in to access your gaming profile and analytics
                        </p>
                    </div>
                </div>

                {/* Alerts */}
                {(redirectReason || serviceMessage || error) && (
                    <div className="space-y-3">
                        {redirectReason && (
                            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3 backdrop-blur-sm">
                                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
                                <span className="text-sm font-medium text-amber-400">{redirectReason}</span>
                            </div>
                        )}
                        {serviceMessage && (
                            <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-3 backdrop-blur-sm">
                                <Activity className="w-5 h-5 text-primary shrink-0 animate-pulse" />
                                <span className="text-sm font-medium text-primary">{serviceMessage}</span>
                            </div>
                        )}
                        {error && (
                            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 backdrop-blur-sm">
                                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                                <span className="text-sm font-medium text-rose-400">{error}</span>
                            </div>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="p-8 card-gaming space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Username</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full bg-surface-elevated/80 border border-white/[0.08] rounded-xl p-4 pl-12 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                                <Link to="/forgot-password" className="text-xs font-bold text-primary hover:text-accent-cyan transition-colors">
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-surface-elevated/80 border border-white/[0.08] rounded-xl p-4 pl-12 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                                />
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
                                        Authenticating...
                                    </>
                                ) : (
                                    <>
                                        Sign In
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
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">New Player?</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>
                    
                    <button
                        onClick={() => navigate('/signup')}
                        className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-accent-cyan transition-colors border border-primary/20 hover:border-accent-cyan/40 px-8 py-3 rounded-xl hover:bg-primary/5"
                    >
                        <Sparkles className="w-4 h-4" />
                        Create Account
                    </button>
                    
                    <p className="text-xs text-slate-600">
                        By signing in, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
}
