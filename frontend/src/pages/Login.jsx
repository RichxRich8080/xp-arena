import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Button } from '../components/ui/Button';
import { LogIn, Activity, Fingerprint, ShieldAlert, ChevronRight, Lock, User } from 'lucide-react';
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
        <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 animate-fade-in font-sans">
            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:scale-105 transition-transform">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight uppercase">
                        System <span className="text-primary">Access</span>
                    </h1>
                    <p className="text-slate-500 text-sm font-medium">
                        Securely authenticate to access your performance analytics and optimization tools.
                    </p>
                </div>

                {/* Alerts */}
                {(redirectReason || serviceMessage) && (
                    <div className="space-y-3">
                        {redirectReason && (
                            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3">
                                <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">{redirectReason}</span>
                            </div>
                        )}
                        {serviceMessage && (
                            <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-3">
                                <Activity className="w-4 h-4 text-primary shrink-0" />
                                <span className="text-xs font-bold text-primary uppercase tracking-widest">{serviceMessage}</span>
                            </div>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Card className="p-8 border-white/5 bg-slate-900/50 space-y-6 rounded-3xl">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Username</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-4 pl-12 text-sm text-white focus:outline-none focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
                                <Link to="/forgot-password" size="sm" className="text-[10px] font-bold text-slate-500 hover:text-primary transition-colors tracking-widest uppercase">
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-4 pl-12 text-sm text-white focus:outline-none focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full py-6 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 group disabled:opacity-30"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Authenticating...' : 'Sign In'}
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Card>
                </form>

                <div className="text-center space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-white/5" />
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">New Member?</span>
                        <div className="h-px flex-1 bg-white/5" />
                    </div>
                    
                    <button
                        onClick={() => navigate('/signup')}
                        className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] hover:text-white transition-colors border border-primary/20 hover:border-white/20 px-8 py-3 rounded-full"
                    >
                        Initialize Registration
                    </button>
                    
                    <p className="text-[8px] text-slate-700 font-bold uppercase tracking-[0.5em] pt-8">
                        Secure Access Guaranteed
                    </p>
                </div>
            </div>
        </div>
    );
}
