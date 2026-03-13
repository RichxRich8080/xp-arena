import React, { useState } from 'react';
import { Send, Activity, ShieldCheck, Mail, MessageSquare, ChevronRight, Globe, Info, Clock, User } from 'lucide-react';
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
            addNotification('Message Sent', 'Our team has received your inquiry and will respond soon.', 'success');
        }, 1500);
    };

    return (
        <div className="space-y-12 pb-20 animate-fade-in font-sans">
            {/* Header */}
            <div className="text-center space-y-6 max-w-3xl mx-auto px-4">
                <div className="flex items-center justify-center gap-4">
                    <div className="h-px w-8 bg-primary/30" />
                    <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Direct Contact Channel</span>
                    <div className="h-px w-8 bg-primary/30" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight uppercase leading-none">
                    Contact <span className="text-primary">Support</span>
                </h1>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest leading-relaxed max-w-xl mx-auto">
                    Have questions or feedback? Reach out to the XP Arena team for assistance.
                </p>
            </div>

            <div className="max-w-4xl mx-auto px-4">
                {/* Contact Form */}
                <div className="space-y-8">
                     <div className="flex items-center gap-3 ml-2">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        <h3 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Send a Message</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <Card className="p-8 md:p-12 bg-slate-900 border-white/5 relative overflow-hidden rounded-[2.5rem] shadow-2xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none transition-opacity opacity-50" />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                <div className="space-y-2.5">
                                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block ml-1">Your Name / Username</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                            type="text"
                                            placeholder="Enter your name"
                                            defaultValue={user?.username || ''}
                                            required
                                            className="w-full bg-slate-950 border border-white/10 rounded-xl pl-11 pr-4 py-4 font-bold text-sm text-white focus:outline-none focus:border-primary transition-all uppercase placeholder:text-slate-700"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block ml-1">Inquiry Subject</label>
                                    <select className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 font-bold text-xs text-white focus:outline-none focus:border-primary transition-all uppercase appearance-none cursor-pointer">
                                        <option>Technical Support</option>
                                        <option>Account Assistance</option>
                                        <option>Partnership Inquiry</option>
                                        <option>Bug Report</option>
                                        <option>General Feedback</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2 space-y-2.5">
                                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block ml-1">Message Details</label>
                                    <textarea
                                        placeholder="How can we help you?"
                                        required
                                        rows={5}
                                        className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 font-bold text-sm text-white focus:outline-none focus:border-primary transition-all uppercase resize-none placeholder:text-slate-700"
                                    />
                                </div>
                            </div>
                        </Card>

                        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-6">
                            <Button
                                type="submit"
                                disabled={sending}
                                className="flex-1 h-16 bg-primary hover:bg-white text-slate-950 font-bold uppercase tracking-[0.2em] text-[10px] shadow-xl transition-all relative overflow-hidden rounded-xl"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-4">
                                    {sending ? 'Sending Message...' : 'Submit Message'}
                                    <Send className="w-4 h-4" />
                                </span>
                            </Button>

                            <div className="px-8 py-4 bg-slate-900 border border-white/5 flex items-center gap-5 rounded-xl">
                                <Clock className="w-5 h-5 text-primary" />
                                <div>
                                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Response Time</span>
                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Within 24 Hours</span>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Direct Channels */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-10 border-t border-white/5 px-4 max-w-5xl mx-auto">
                {[
                    { icon: Mail, label: 'Email Support', val: 'support@xp-arena.com' },
                    { icon: Globe, label: 'Community Hub', val: 'Discord / Twitter' },
                    { icon: ShieldCheck, label: 'Data Privacy', val: 'privacy@xp-arena.com' }
                ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-4 p-6 rounded-2xl hover:bg-slate-900/50 transition-all border border-transparent hover:border-white/5">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center border border-white/5">
                            <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-center space-y-1">
                             <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
                             <p className="text-[10px] font-bold text-white uppercase tracking-tight">{item.val}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="flex justify-center px-4">
                <div className="bg-slate-900 border border-white/5 p-6 flex items-center gap-4 max-w-lg opacity-30 text-center rounded-2xl">
                   <Info className="w-4 h-4 text-slate-500 shrink-0" />
                   <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                      All communications are handled securely. Your data is protected under our unified privacy standards.
                   </p>
                </div>
            </div>
        </div>
    );
};

export default Contact;
