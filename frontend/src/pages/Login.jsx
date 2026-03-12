import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Button } from '../components/ui/Button';
import { LogIn, Activity, Fingerprint, LucideShieldAlert, ChevronRight } from 'lucide-react';
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
            setServiceMessage(readyErr?.message || 'Service is not fully ready yet.');
        }
        
        setError('');
        setIsLoading(true);

        try {
            await login(username, password);
            addNotification('Access Granted', `Neural link established for ${username}`, 'success');
            const redirectPath = location.state?.from || '/dashboard';
            navigate(redirectPath, { replace: true });
        } catch (err) {
            const msg = typeof err === 'string' ? err : (err?.message || 'Authentication failure.');
            setError(msg);
            addNotification('Access Denied', msg, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 space-y-12 font-display animate-slide-in">
            {/* Header / Intro */}
            <div className="text-center space-y-4 max-w-sm">
                <div className="relative group mx-auto w-20 h-20 mb-8">
                    <div className="absolute -inset-4 bg-accent-cyan/20 rounded-3xl blur-xl group-hover:bg-accent-cyan/30 transition-all animate-pulse" />
                    <div className="relative w-full h-full bg-background border-2 border-accent-cyan/50 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                        <Fingerprint className="w-10 h-10 text-accent-cyan" />
                    </div>
                </div>
                <h1 className="text-4xl font-black italic text-white tracking-tighter uppercase leading-none">
                    TERMINAL <span className="text-accent-cyan">ACCESS</span>
                </h1>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] leading-relaxed italic">
                    Establish a secure neural link to the XP Arena global network.
                </p>
            </div>

            <div className="w-full max-w-md space-y-8">
                {/* Alerts */}
                {(redirectReason || serviceMessage) && (
                    <div className="space-y-3">
                        {redirectReason && (
                            <div className="glass-panel border-axp-gold/20 bg-axp-gold/5 p-4 flex items-center gap-4">
                                <LucideShieldAlert className="w-4 h-4 text-axp-gold shrink-0" />
                                <span className="text-[9px] font-black text-axp-gold uppercase tracking-widest">{redirectReason}</span>
                            </div>
                        )}
                        {serviceMessage && (
                            <div className="glass-panel border-accent-rose/20 bg-accent-rose/5 p-4 flex items-center gap-4">
                                <Activity className="w-4 h-4 text-accent-rose shrink-0" />
                                <span className="text-[9px] font-black text-accent-rose uppercase tracking-widest">{serviceMessage}</span>
                            </div>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-8 glass-panel p-10 border-white/5 bg-white/[0.02]">
                        <div className="space-y-3">
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] block ml-1">ARENI_IDENTIFIER</label>
                            <input
                                type="text"
                                placeholder="USERNAME_OR_TAG..."
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full bg-background border border-white/10 rounded-2xl p-5 font-black text-sm text-white focus:outline-none focus:border-accent-cyan transition-all italic uppercase"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] block ml-1">SECURITY_KEY</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-background border border-white/10 rounded-2xl p-5 font-black text-sm text-white focus:outline-none focus:border-accent-cyan transition-all italic"
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full py-6 group disabled:opacity-20"
                            disabled={isLoading}
                        >
                            <span className="font-black italic uppercase tracking-[0.4em] text-[11px] flex items-center justify-center gap-4">
                                {isLoading ? 'AUTHORIZING_CREDENTIALS...' : 'INITIALIZE_UPLINK'}
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </span>
                        </Button>
                    </div>
                </form>

                <div className="text-center space-y-6">
                    <div className="flex items-center gap-4 justify-center">
                        <div className="h-1px flex-1 bg-white/5" />
                        <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest leading-none">NEW_SIGNAL_DETECTED?</span>
                        <div className="h-1px flex-1 bg-white/5" />
                    </div>
                    
                    <button
                        onClick={() => navigate('/signup')}
                        className="text-[10px] font-black text-accent-cyan uppercase tracking-[0.3em] italic hover:text-white transition-colors"
                    >
                        INITIALIZE_NEW_PROFILE
                    </button>
                    
                    <p className="text-[8px] text-gray-700 font-bold uppercase tracking-widest pt-8">
                        ENCRYPTED_SHA256_ACTIVE // NODE_42_READY
                    </p>
                </div>
            </div>
        </div>
    );
}
