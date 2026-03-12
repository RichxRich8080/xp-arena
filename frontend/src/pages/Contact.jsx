import React, { useState } from 'react';
import { Send, Activity, ShieldCheck, Mail, MessageSquare, ChevronRight, Globe, Info } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

const Contact = () => {
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const [sending, setSending] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSending(true);
        setTimeout(() => {
            setSending(false);
            addNotification('Signal Transmitted', 'Direct link to Command established. Awaiting response cycle.', 'success');
        }, 2000);
    };

    return (
        <div className="space-y-16 pb-20 animate-slide-in font-display">
            {/* Header */}
            <div className="text-center space-y-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-4">
                    <div className="h-1px w-10 bg-indigo-500/50" />
                    <span className="text-[10px] font-black italic text-indigo-400 uppercase tracking-[0.5em]">Neural_Dispatch_Link</span>
                    <div className="h-1px w-10 bg-indigo-500/50" />
                </div>
                <h1 className="text-5xl md:text-7xl font-black italic text-white tracking-tighter uppercase leading-none">
                    CONTACT <span className="text-indigo-400">COMMAND</span>
                </h1>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-lg mx-auto italic">
                    Establish a direct communication channel with the lead architects of the Areni Syndicate.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Tactical Form */}
                <div className="lg:col-span-12 space-y-8">
                     <div className="flex items-center gap-4 ml-4">
                        <MessageSquare className="w-4 h-4 text-gray-500" />
                        <h3 className="text-[10px] font-black text-gray-500 tracking-[0.4em] uppercase">DISPATCH_CONFIGURATION</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <Card className="p-12 border-white/5 bg-white/[0.01] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] pointer-events-none transition-opacity opacity-50 group-hover:opacity-100" />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] block ml-1">OPERATOR_IDENTITY</label>
                                    <input
                                        type="text"
                                        placeholder="ENTER_HANDLE..."
                                        defaultValue={user?.username || ''}
                                        required
                                        className="w-full bg-background border border-white/10 rounded-2xl p-5 font-black text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all italic uppercase"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] block ml-1">COMMUNICATION_TOPIC_ID</label>
                                    <select className="w-full bg-background border border-white/10 rounded-2xl p-5 font-black text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-all italic uppercase appearance-none">
                                        <option>TECHNICAL_NODE_FEEDBACK</option>
                                        <option>SYNDICATE_PARTNERSHIP</option>
                                        <option>CREDENTIAL_ACCESS_SUPPORT</option>
                                        <option>CRITICAL_SYSTEM_BUG</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] block ml-1">NEURAL_DATA_MESSAGE</label>
                                    <textarea
                                        placeholder="COMPOSE_DISPATCH_LOG..."
                                        required
                                        rows={6}
                                        className="w-full bg-background border border-white/10 rounded-3xl p-6 font-black text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all italic uppercase resize-none"
                                    />
                                </div>
                            </div>
                        </Card>

                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <Button
                                type="submit"
                                disabled={sending}
                                className="flex-1 py-7 bg-indigo-500 hover:bg-white text-background font-black h-20 uppercase italic tracking-[0.4em] text-[11px] shadow-[0_20px_40px_rgba(129,140,248,0.15)] transition-all relative overflow-hidden group"
                            >
                                <div className={cn("absolute inset-0 bg-white/20 transition-transform duration-[3000ms] ease-out", sending ? "translate-x-0" : "-translate-x-full")} />
                                <span className="relative z-10 flex items-center justify-center gap-4">
                                    {sending ? 'TRANSMITTING_UPLINK...' : 'DISPATCH_COMMUNICATION'}
                                    <Send className="w-5 h-5 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                                </span>
                            </Button>

                            <div className="px-10 py-6 glass-panel border-white/5 bg-white/[0.01] flex items-center gap-6 opacity-40 hover:opacity-100 transition-opacity">
                                <Activity className="w-6 h-6 text-indigo-400" />
                                <div>
                                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-[0.3em] block">RESPONSE_CYCLE_TARGET</span>
                                    <span className="text-[10px] font-black text-white italic uppercase tracking-[0.25em]">2.4_SOLAR_HOURS</span>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Direct Channels */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-10 border-t border-white/5">
                {[
                    { icon: Mail, label: 'CORE_EMAIL', val: 'COMMAND@XP-ARENA.COM' },
                    { icon: Globe, label: 'SYNDICATE_HQ', val: 'ARENA_NODE_GLOBAL' },
                    { icon: ShieldCheck, label: 'SECURITY_NODE', val: 'ENCRYPTED_SHA256' }
                ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-6 p-8 opacity-40 hover:opacity-100 transition-all hover:-translate-y-2">
                        <item.icon className="w-8 h-8 text-indigo-400" />
                        <div className="text-center space-y-2">
                             <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{item.label}</span>
                             <p className="text-[10px] font-black text-white italic uppercase tracking-tighter">{item.val}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="flex justify-center">
                <div className="glass-panel border-white/5 bg-white/[0.01] p-6 flex items-center gap-6 max-w-lg opacity-30 text-center">
                   <Info className="w-5 h-5 text-gray-600 shrink-0" />
                   <p className="text-[8px] text-gray-700 font-bold uppercase tracking-[0.4em] leading-relaxed italic">
                      SECURE_DISPATCH_PROTOCOL_V4. ALL COMMUNICATIONS ARE ENCRYPTED AND LOGGED FOR QUALITY_SYNCHRONIZATION.
                   </p>
                </div>
            </div>
        </div>
    );
};

export default Contact;
