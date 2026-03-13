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
                    <div className="h-px w-10 bg-primary/50" />
                    <span className="text-[10px] font-bold text-primary uppercase tracking-[0.5em]">Upload Center</span>
                    <div className="h-px w-10 bg-primary/50" />
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter uppercase leading-none">
                    Upload <span className="text-primary">Performance</span>
                </h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-lg mx-auto">
                    Share your performance records with the community and earn Points for verified activity.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-10">
                {/* Master Upload Zone */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-transparent to-primary/30 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                    <Card className="relative p-20 border-2 border-dashed border-white/5 bg-slate-900/50 hover:bg-slate-800 hover:border-primary/30 transition-all cursor-pointer flex flex-col items-center justify-center text-center rounded-[4rem] min-h-[400px]">
                        <div className={cn("absolute inset-x-0 bottom-0 h-1 bg-primary/40 transition-all duration-[3000ms] ease-out", isUploading ? "w-full" : "w-0")} />
                        
                        <div className="relative z-10 space-y-8 flex flex-col items-center">
                            <div className={cn(
                                "w-24 h-24 rounded-[2.5rem] bg-slate-800 border border-white/10 flex items-center justify-center shadow-inner transition-all duration-700",
                                isUploading ? "scale-90 animate-pulse border-primary/50" : "group-hover:scale-110"
                            )}>
                                {isDone ? <Check className="w-12 h-12 text-green-500" /> : <Film className={cn("w-12 h-12", isUploading ? "text-primary" : "text-slate-400 opacity-40")} />}
                            </div>
                            
                            <div className="space-y-3">
                                <h4 className="text-2xl font-bold text-white tracking-tighter uppercase">
                                    {isUploading ? 'Transferring Data...' : isDone ? 'Upload Complete' : 'Attach Performance File'}
                                </h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">
                                    MP4 FORMAT | MAX 50MB | 1080P SPEC
                                </p>
                            </div>
                            
                            {!isUploading && !isDone && (
                                <div className="pt-6">
                                    <span className="px-8 py-3 bg-slate-800 rounded-full text-[9px] font-bold text-slate-400 uppercase tracking-widest border border-white/5">Select Media Package</span>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Metadata Module */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                    <div className="flex items-center gap-4 ml-6">
                        <FileText className="w-4 h-4 text-slate-500" />
                        <h3 className="text-[10px] font-bold text-slate-500 tracking-[0.4em] uppercase">Metadata Details</h3>
                    </div>

                    <Card className="p-10 md:p-16 border-white/5 bg-slate-900/50 space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-3">
                                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] block ml-1">Performance Title</label>
                                <input
                                    type="text"
                                    placeholder="Enter descriptive title..."
                                    required
                                    className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 font-bold text-sm text-white focus:outline-none focus:border-primary/50 transition-all uppercase"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] block ml-1">Category</label>
                                <select className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 font-bold text-xs text-white focus:outline-none focus:border-primary/50 transition-all uppercase appearance-none">
                                    <option>Standard Engagement</option>
                                    <option>Precision Performance</option>
                                    <option>Advanced Movement</option>
                                    <option>Team Competition</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-10 opacity-30 group-hover:opacity-100 transition-opacity">
                             <div className="flex items-center gap-6">
                                <Globe className="w-6 h-6 text-slate-600" />
                                <div className="space-y-1">
                                    <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest block">Broadcast Visibility</span>
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Public Community Channel</span>
                                </div>
                             </div>
                             <div className="flex items-center gap-6 text-right md:text-left">
                                <ShieldCheck className="w-6 h-6 text-green-500" />
                                <div className="space-y-1">
                                    <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest block">Verification Status</span>
                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Certified Record</span>
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
                            "px-20 py-8 rounded-[3rem] text-[12px] font-bold uppercase tracking-[0.5em] transition-all relative overflow-hidden group shadow-[0_20px_40px_rgba(var(--primary),0.1)]",
                            isDone ? "bg-green-500 text-slate-950" : "bg-primary text-slate-950 hover:scale-105"
                        )}
                    >
                        <span className="relative z-10 flex items-center gap-6">
                            {isUploading ? 'Initializing Transfer...' : isDone ? 'Upload Successful' : 'Submit Performance'}
                            {!isUploading && !isDone && <Upload className="w-6 h-6 group-hover:-translate-y-2 transition-transform" />}
                            {isDone && <Check className="w-6 h-6" />}
                        </span>
                        <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                    </Button>
                    
                    <div className="flex items-center gap-6 opacity-20">
                        <Activity className="w-5 h-5 text-slate-500" />
                        <div className="h-px w-32 bg-white/10" />
                        <p className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.5em]">Secure Protocol v4.2</p>
                    </div>
                </div>
            </form>
            
            <div className="flex justify-center">
                <div className="bg-slate-900/50 border border-white/5 p-8 flex items-center gap-8 max-w-2xl opacity-40 rounded-2xl">
                   <Info className="w-10 h-10 text-primary shrink-0" />
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                      Notice: By initiating an upload, you certify that the content is your own performance record. Any use of unauthorized software or third-party tools will result in immediate account suspension.
                   </p>
                </div>
            </div>
        </div>
    );
}
