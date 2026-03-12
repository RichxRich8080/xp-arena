import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import { Upload, Film, FileText, Globe, ShieldCheck, Activity, Info, ChevronRight, Check } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

export default function Submit() {
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const navigate = useNavigate();
    const [isUploading, setIsUploading] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsUploading(true);

        setTimeout(() => {
            setIsUploading(false);
            setIsDone(true);
            addNotification('Transmission Successful', 'High-fidelity highlight synced to global broadcast node.', 'success');
            setTimeout(() => navigate('/dashboard'), 2000);
        }, 3000);
    };

    return (
        <div className="space-y-16 pb-20 animate-slide-in font-display">
            {/* Header */}
            <div className="text-center space-y-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-4">
                    <div className="h-1px w-10 bg-accent-rose/50" />
                    <span className="text-[10px] font-black italic text-accent-rose uppercase tracking-[0.5em]">Content_Submission_Node</span>
                    <div className="h-1px w-10 bg-accent-rose/50" />
                </div>
                <h1 className="text-5xl md:text-7xl font-black italic text-white tracking-tighter uppercase leading-none">
                    SUBMIT <span className="text-accent-rose">HIGHLIGHT</span>
                </h1>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-lg mx-auto italic">
                    Transmit your mechanical masterclasses to the global syndicate broadcast and earn AXP rewards for elite performance.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-10">
                {/* Master Upload Zone */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-accent-rose/30 via-transparent to-accent-rose/30 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                    <Card className="relative p-20 border-2 border-dashed border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-accent-rose/30 transition-all cursor-pointer flex flex-col items-center justify-center text-center rounded-[4rem] min-h-[400px]">
                        <div className={cn("absolute inset-x-0 bottom-0 h-1px bg-accent-rose/40 transition-all duration-[3000ms] ease-out", isUploading ? "w-full" : "w-0")} />
                        
                        <div className="relative z-10 space-y-8 flex flex-col items-center">
                            <div className={cn(
                                "w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center shadow-inner transition-all duration-700",
                                isUploading ? "scale-90 animate-pulse border-accent-rose/50" : "group-hover:scale-110 group-hover:rotate-6"
                            )}>
                                {isDone ? <Check className="w-12 h-12 text-accent-green" /> : <Film className={cn("w-12 h-12", isUploading ? "text-accent-rose" : "text-white opacity-40")} />}
                            </div>
                            
                            <div className="space-y-3">
                                <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase">
                                    {isUploading ? 'DATA_TRANSMITTING...' : isDone ? 'SIGNAL_LOCKED' : 'ATTACH_MECHANICAL_LOG'}
                                </h4>
                                <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] italic">
                                    MP4_PACKET | MAX_50MB | 1080P_UHD_SPEC
                                </p>
                            </div>
                            
                            {!isUploading && !isDone && (
                                <div className="pt-6">
                                    <span className="px-8 py-3 bg-white/5 rounded-full text-[9px] font-black text-white/40 uppercase tracking-widest border border-white/5">SELECT_SOURCE_PACKAGE</span>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Metadata Module */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                    <div className="flex items-center gap-4 ml-6">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <h3 className="text-[10px] font-black text-gray-500 tracking-[0.4em] uppercase">TRANSMISSION_METADATA</h3>
                    </div>

                    <Card className="p-10 md:p-16 border-white/5 bg-white/[0.01] space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] block ml-1">HIGHLIGHT_SIGNATURE (TITLE)</label>
                                <input
                                    type="text"
                                    placeholder="ENTER_CATCHY_ID..."
                                    required
                                    className="w-full bg-background border border-white/10 rounded-2xl p-5 font-black text-sm text-white focus:outline-none focus:border-accent-rose/50 transition-all italic uppercase"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] block ml-1">TACTICAL_CATEGORY</label>
                                <select className="w-full bg-background border border-white/10 rounded-2xl p-5 font-black text-xs text-white focus:outline-none focus:border-accent-rose/50 transition-all italic uppercase appearance-none">
                                    <option>CLUTCH_ENGAGEMENT</option>
                                    <option>PRECISION_HEADSHOT</option>
                                    <option>MECHANICAL_MOVEMENT</option>
                                    <option>GUILD_WAR_RECORD</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-10 opacity-30 group-hover:opacity-100 transition-opacity">
                             <div className="flex items-center gap-6">
                                <Globe className="w-6 h-6 text-gray-600" />
                                <div className="space-y-1">
                                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest block">BROADCAST_VISIBILITY</span>
                                    <span className="text-[10px] font-black text-accent-cyan italic uppercase tracking-widest">PUBLIC_SYNDICATE_CHANNEL</span>
                                </div>
                             </div>
                             <div className="flex items-center gap-6 text-right md:text-left">
                                <ShieldCheck className="w-6 h-6 text-accent-green" />
                                <div className="space-y-1">
                                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest block">LEGAL_CLEARANCE</span>
                                    <span className="text-[10px] font-black text-white italic uppercase tracking-widest">VERIFIED_FOR_AIR</span>
                                </div>
                             </div>
                        </div>
                    </Card>
                </div>

                {/* Submit Action */}
                <div className="flex justify-center flex-col items-center gap-10">
                    <Button
                        type="submit"
                        disabled={isUploading || isDone}
                        className={cn(
                            "px-20 py-8 rounded-[3rem] text-[12px] font-black uppercase tracking-[0.5em] transition-all relative overflow-hidden group shadow-[0_30px_60px_rgba(244,63,94,0.2)]",
                            isDone ? "bg-accent-green text-background" : "bg-accent-rose text-white hover:scale-105"
                        )}
                    >
                        <span className="relative z-10 flex items-center gap-6">
                            {isUploading ? 'INITIATING_UPLINK...' : isDone ? 'DATA_SYNC_COMPLETE' : 'INITIALIZE_TRANSMISSION'}
                            {!isUploading && !isDone && <Upload className="w-6 h-6 group-hover:-translate-y-2 transition-transform" />}
                            {isDone && <Check className="w-6 h-6" />}
                        </span>
                        <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                    </Button>
                    
                    <div className="flex items-center gap-6 opacity-20">
                        <Activity className="w-5 h-5 text-gray-500" />
                        <div className="h-1px w-32 bg-white/10" />
                        <p className="text-[8px] text-gray-500 font-bold uppercase tracking-[0.5em] italic">SECURE_CONTENT_BIPPASS_v4.2</p>
                    </div>
                </div>
            </form>
            
            <div className="flex justify-center">
                <div className="glass-panel border-white/5 bg-white/[0.01] p-8 flex items-center gap-8 max-w-2xl opacity-40">
                   <Info className="w-10 h-10 text-accent-rose shrink-0" />
                   <p className="text-[10px] text-gray-500 font-display font-black uppercase tracking-widest leading-relaxed italic">
                      TACTICAL_NOTICE: By initiating a transmission, you certify that the content is your own mechanical output. Use of "Aimbot" or "Speed-Hack" nodes will result in immediate terminal termination.
                   </p>
                </div>
            </div>
        </div>
    );
}
