import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ShieldAlert, Mail, ArrowLeft, Activity, Radio, ChevronRight, Lock, Check } from 'lucide-react';
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
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center p-8 overflow-hidden font-display">
            {/* Background Kinetic Effects */}
            <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-accent-rose/5 blur-[180px] rounded-full animate-pulse pointer-events-none" />
            <div className="scanline" />
            
            <div className="w-full max-w-xl relative z-10 space-y-12 animate-in fade-in zoom-in duration-1000">
                <div className="text-center space-y-6">
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-1px w-10 bg-accent-rose/50" />
                        <span className="text-[10px] font-black italic text-accent-rose uppercase tracking-[0.5em]">Recovery_Protocol_Initial</span>
                        <div className="h-1px w-10 bg-accent-rose/50" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black italic text-white tracking-tighter uppercase leading-none">
                        NEURAL <span className="text-accent-rose text-glow-rose">BYPASS</span>
                    </h1>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-lg mx-auto italic">
                        Initiate credentials restoration sequence to establish a secure link with your global terminal identity.
                    </p>
                </div>

                <Card className="relative p-12 md:p-16 border-accent-rose/20 bg-accent-rose/[0.02] shadow-[0_0_80px_rgba(244,63,94,0.1)] rounded-[4rem] overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1px bg-gradient-to-r from-transparent via-accent-rose/40 to-transparent" />
                    
                    {sent ? (
                        <div className="text-center space-y-12 py-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
                            <div className="relative mx-auto w-32 h-32">
                                <div className="absolute inset-0 bg-accent-rose/20 blur-3xl animate-pulse" />
                                <div className="relative w-full h-full rounded-[2.5rem] bg-background border-2 border-accent-rose/30 flex items-center justify-center shadow-2xl">
                                    <Radio className="w-16 h-16 text-accent-rose animate-ping" />
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">SIGNAL_TRANSMITTED</h3>
                                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed italic max-w-xs mx-auto">
                                   CHECK_YOUR_NEURAL_LINKED_EMAIL_FOR_THE_RESTORE_BYPASS_TOKEN.
                                </p>
                            </div>

                            <Button
                                onClick={() => navigate('/login')}
                                className="w-full py-8 bg-white text-background font-black uppercase italic tracking-[0.4em] text-[11px] shadow-2xl hover:scale-105 transition-all"
                            >
                                RETURN_TO_TERMINAL_SYNC
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleRecover} className="space-y-10">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">REGISTERED_OPERATOR_EMAIL</label>
                                    <ShieldAlert className="w-3.5 h-3.5 text-accent-rose/50" />
                                </div>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                        <Mail className="w-5 h-5 text-gray-700 group-focus-within/input:text-accent-rose" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="ENTER_NEURAL_IDENTIFIER..."
                                        required
                                        className="w-full bg-background border border-white/10 rounded-3xl pl-16 pr-8 py-7 font-black text-sm text-white focus:outline-none focus:border-accent-rose/50 transition-all italic uppercase placeholder:text-gray-800"
                                    />
                                </div>
                                <p className="text-[9px] text-gray-700 font-bold uppercase tracking-[0.3em] leading-relaxed italic pl-2">
                                    A SECURE RESTORATION LINK WILL BE DISPATCHED TO THIS ENCRYPTED ADDRESS.
                                </p>
                            </div>

                            <Button
                                disabled={loading}
                                type="submit"
                                className="w-full py-8 bg-accent-rose hover:bg-white text-white hover:text-background font-black uppercase italic tracking-[0.5em] text-[12px] shadow-[0_25px_50px_rgba(244,63,94,0.2)] transition-all group relative overflow-hidden h-20"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-6">
                                    {loading ? 'TRANSMITTING_SIGNAL...' : 'REQUEST_RESTORATION'}
                                    {!loading && <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />}
                                </span>
                                <div className={cn("absolute inset-0 bg-white/20 transition-transform duration-[2000ms] ease-out", loading ? "translate-x-0" : "-translate-x-full")} />
                            </Button>

                            <div className="flex justify-center pt-4">
                                <NavLink 
                                    to="/login" 
                                    className="flex items-center gap-4 text-[9px] font-black text-gray-700 hover:text-white uppercase tracking-[0.4em] transition-all group"
                                >
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
                                    ABORT_RECOVERY_PROTOCOL
                                </NavLink>
                            </div>
                        </form>
                    )}
                </Card>
                
                <div className="flex justify-center flex-col items-center gap-6 opacity-30">
                    <div className="flex items-center gap-8">
                        <Lock className="w-5 h-5" />
                        <div className="h-1px w-24 bg-white/10" />
                        <Check className="w-5 h-5" />
                    </div>
                    <p className="text-[8px] text-gray-700 font-bold uppercase tracking-[0.5em] italic">SECURE_BYPASS_LAYER_v4.2 // SYNC_STATUS_OFFLINE</p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
