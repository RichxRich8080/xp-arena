import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getSetups, deleteSetup } from '../utils/storage';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Clock, Trash2, Smartphone, Target, Database, Search, ArrowUpRight, History as HistoryIcon } from 'lucide-react';

export default function History() {
    const navigate = useNavigate();
    const setups = getSetups();

    const handleDelete = (id) => {
        if (confirm('Permanently delete this configuration record?')) {
            deleteSetup(id);
            window.location.reload();
        }
    };

    return (
        <div className="space-y-8 pb-12 animate-fade-in font-sans">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-white/5 shadow-sm">
                <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none select-none">
                    <HistoryIcon className="w-64 h-64" />
                </div>
                
                <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit">
                            <Database className="w-3.5 h-3.5 text-primary" />
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Local Database</span>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-none uppercase">
                                Calibration <span className="text-primary">History</span>
                            </h1>
                            <p className="text-slate-400 text-sm md:text-base max-w-xl leading-relaxed font-medium">
                                Access and manage your previously exported sensitivity profiles and device configurations.
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                        <Search className="w-4 h-4 text-slate-500" />
                        <input 
                            placeholder="Find record..." 
                            className="bg-transparent border-none focus:outline-none text-xs font-bold uppercase tracking-widest text-white w-40 placeholder:text-slate-600"
                        />
                    </div>
                </div>
            </div>

            {/* History List */}
            <div className="space-y-4">
                {setups.length > 0 ? (
                    setups.map((setup) => {
                        const setupId = setup.id.split('-')[1]?.slice(-4) || 'NULL';
                        
                        return (
                            <Card
                                key={setup.id}
                                className="group relative overflow-hidden border-white/5 bg-slate-900/50 hover:bg-slate-900 hover:border-white/10 transition-all duration-300 p-6 md:p-8 rounded-2xl"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                    <div className="flex items-center gap-8">
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">ID</span>
                                            <span className="text-sm font-bold text-white tracking-widest uppercase">#{setupId}</span>
                                        </div>
                                        <div className="h-10 w-px bg-white/5 hidden md:block" />
                                        
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <Smartphone className="w-4 h-4 text-primary" />
                                                <h3 className="font-bold text-white text-lg tracking-tight uppercase">
                                                    {setup.formData?.brand} {setup.formData?.model}
                                                </h3>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-6">
                                                <div className="flex items-center gap-2">
                                                    <Target className="w-3.5 h-3.5 text-slate-500" />
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{setup.formData?.playStyle}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{new Date(setup.timestamp).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-3 border-t border-white/5 pt-6 md:border-none md:pt-0">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="bg-red-500/5 border border-red-500/10 hover:bg-red-500/20 text-red-500 p-3 rounded-xl transition-all"
                                            onClick={() => handleDelete(setup.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            className="px-8 rounded-xl uppercase font-bold text-[10px] tracking-widest py-4 gap-3 bg-slate-800 hover:bg-slate-700 text-white border-white/5"
                                            onClick={() => navigate('/sensitivity-result', { state: { formData: setup.formData } })}
                                        >
                                            View Details <ArrowUpRight className="w-4 h-4 text-primary" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })
                ) : (
                    <div className="py-32 flex flex-col items-center justify-center text-center space-y-10 rounded-2xl border border-dashed border-white/10 bg-slate-900/20">
                        <div className="relative">
                            <HistoryIcon className="w-24 h-24 text-slate-800" />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white tracking-tight uppercase">No Records Found</h2>
                            <p className="text-sm text-slate-500 font-medium max-w-xs mx-auto">You haven't saved any sensitivity configurations yet. Start a new session to begin.</p>
                        </div>
                        <Button
                            variant="primary"
                            className="px-12 py-4 rounded-xl font-bold text-xs uppercase tracking-widest"
                            onClick={() => navigate('/generate-sensitivity')}
                        >
                            Start New Calibration
                        </Button>
                    </div>
                )}
            </div>

            {/* Archive Analytics */}
            {setups.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                    <Card className="p-10 border-white/5 bg-slate-900/50 flex items-center justify-between group overflow-hidden rounded-2xl">
                        <div className="space-y-2 relative z-10">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Total Records</span>
                            <p className="text-4xl font-bold text-white tracking-tighter uppercase">{setups.length} <span className="text-slate-600 text-xs tracking-widest">Exports</span></p>
                        </div>
                        <ShieldCheck className="w-16 h-16 text-primary opacity-10 absolute top-1/2 right-0 -translate-y-1/2 -mr-4" />
                    </Card>
                    <Card className="p-10 border-white/5 bg-slate-900/50 flex items-center justify-between group overflow-hidden rounded-2xl">
                        <div className="space-y-2 relative z-10">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">System Uptime</span>
                            <p className="text-4xl font-bold text-white tracking-tighter uppercase">99.9<span className="text-slate-600 text-xs tracking-widest">%</span></p>
                        </div>
                        <Zap className="w-16 h-16 text-primary opacity-10 absolute top-1/2 right-0 -translate-y-1/2 -mr-4" />
                    </Card>
                </div>
            )}
        </div>
    );
}
