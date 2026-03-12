import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Button } from '../components/ui/Button';
import { UserPlus, ChevronRight, Activity, ShieldCheck, Fingerprint } from 'lucide-react';
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
            setError("COEFFICIENTS_NOT_SYNCED");
            addNotification('Sync Error', 'Passwords must match.', 'error');
            return;
        }

        if (formData.password.length < 6) {
            setError("KEY_STRENGTH_INSUFFICIENT");
            addNotification('Security Error', 'Password requires min 6 chars.', 'error');
            return;
        }

        setIsLoading(true);

        try {
            await signup(formData.username, formData.email, formData.password);
            addNotification('Profile Initialized', 'Credential registry successful. Redirecting to uplink.', 'success');
            navigate('/login');
        } catch (err) {
            const msg = typeof err === 'string' ? err : (err?.message || 'Registration failure.');
            setError(msg);
            addNotification('Registry Error', msg, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 space-y-12 font-display animate-slide-in">
            {/* Header */}
            <div className="text-center space-y-4 max-w-sm">
                <div className="relative group mx-auto w-20 h-20 mb-8">
                    <div className="absolute -inset-4 bg-accent-green/20 rounded-3xl blur-xl group-hover:bg-accent-green/30 transition-all animate-pulse" />
                    <div className="relative w-full h-full bg-background border-2 border-accent-green/50 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                        <UserPlus className="w-10 h-10 text-accent-green" />
                    </div>
                </div>
                <h1 className="text-4xl font-black italic text-white tracking-tighter uppercase leading-none">
                    PROFILE <span className="text-accent-green">MANIFEST</span>
                </h1>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] leading-relaxed italic">
                    Register your tactical identifier on the XP Arena global ledger.
                </p>
            </div>

            <div className="w-full max-w-md space-y-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-6 glass-panel p-10 border-white/5 bg-white/[0.02]">
                        {error && (
                            <div className="bg-accent-rose/5 border border-accent-rose/20 p-4 mb-4 flex items-center gap-3">
                                <Activity className="w-4 h-4 text-accent-rose shrink-0" />
                                <span className="text-[9px] font-black text-accent-rose uppercase tracking-widest">{error}</span>
                            </div>
                        )}

                        <div className="space-y-3">
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] block ml-1">CODENAME_TAG</label>
                            <input
                                type="text"
                                placeholder="ARENI_X_123..."
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                                className="w-full bg-background border border-white/10 rounded-2xl p-4 font-black text-sm text-white focus:outline-none focus:border-accent-green transition-all italic uppercase"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] block ml-1">COMM_ADDR (EMAIL)</label>
                            <input
                                type="email"
                                placeholder="UPLINK@MAIL.COM"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                className="w-full bg-background border border-white/10 rounded-2xl p-4 font-black text-sm text-white focus:outline-none focus:border-accent-green transition-all italic uppercase"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] block ml-1">NEW_KEY</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    className="w-full bg-background border border-white/10 rounded-2xl p-4 font-black text-sm text-white focus:outline-none focus:border-accent-green transition-all"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] block ml-1">CONFIRM</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                    className="w-full bg-background border border-white/10 rounded-2xl p-4 font-black text-sm text-white focus:outline-none focus:border-accent-green transition-all"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full py-6 mt-4 group disabled:opacity-20 shadow-[0_15px_30px_rgba(34,197,94,0.1)]"
                            disabled={isLoading}
                        >
                            <span className="font-black italic uppercase tracking-[0.4em] text-[11px] flex items-center justify-center gap-4 text-accent-green">
                                {isLoading ? 'INITIALIZING_MANIFEST...' : 'CREATE_ARENI_PROFILE'}
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </span>
                        </Button>
                    </div>
                </form>

                <div className="text-center space-y-6">
                    <div className="flex items-center gap-4 justify-center">
                        <div className="h-1px flex-1 bg-white/5" />
                        <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest leading-none">ALREADY_LINKED?</span>
                        <div className="h-1px flex-1 bg-white/5" />
                    </div>
                    
                    <button
                        onClick={() => navigate('/login')}
                        className="text-[10px] font-black text-accent-green uppercase tracking-[0.3em] italic hover:text-white transition-colors"
                    >
                        RESTORE_TERMINAL_ACCESS
                    </button>
                    
                    <div className="flex items-center justify-center gap-3 pt-8 opacity-20">
                        <ShieldCheck className="w-4 h-4 text-white" />
                        <p className="text-[8px] text-white font-bold uppercase tracking-widest">
                            SECURE_LEDGER_AUTH_V4
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
