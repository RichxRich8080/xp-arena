import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getSetups, deleteSetup } from '../utils/storage';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Clock, Trash2, Smartphone, Target, ChevronRight, Zap, Database, Search, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { cn } from '../utils/cn';

export default function History() {
    const navigate = useNavigate();
    const setups = getSetups();

    const handleDelete = (id) => {
        if (confirm('Permanently delete this tactical record from the archive?')) {
            deleteSetup(id);
            window.location.reload();
        }
    };

    return (
        <div className="space-y-12 pb-20 animate-slide-in font-display">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                        <Database className="w-5 h-5 text-accent-rose" />
                        <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Tactical_Archive_Storage</h2>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none text-center md:text-left">
                        FORGE <span className="text-accent-rose">ARCHIVE</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <Search className="w-4 h-4 text-gray-600" />
                    <input 
                        placeholder="FILTER_RECORDS..." 
                        className="bg-transparent border-none focus:outline-none text-[10px] font-black uppercase tracking-[0.2em] text-white w-32"
                    />
                </div>
            </div>

            {/* History List */}
            <div className="space-y-4">
                {setups.length > 0 ? (
                    setups.map((setup, index) => {
                        const setupId = setup.id.split('-')[1]?.slice(-4) || 'NULL';
                        
                        return (
                            <div
                                key={setup.id}
                                className="group relative overflow-hidden glass-panel p-6 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all duration-500"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                    <div className="flex items-center gap-8">
                                        <div className="flex flex-col items-center">
                                            <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1 italic">ENTRY</span>
                                            <span className="text-sm font-black text-white italic tracking-widest uppercase">#{setupId}</span>
                                        </div>
                                        <div className="h-10 w-1px bg-white/5 hidden md:block" />
                                        
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <Smartphone className="w-3.5 h-3.5 text-accent-cyan" />
                                                <h3 className="font-black text-white text-base uppercase italic tracking-tighter">
                                                    {setup.formData?.brand} {setup.formData?.model}
                                                </h3>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-6">
                                                <div className="flex items-center gap-2">
                                                    <Target className="w-3 h-3 text-accent-cyan" />
                                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">{setup.formData?.playStyle}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3 h-3 text-gray-600" />
                                                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{new Date(setup.timestamp).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-3 border-t border-white/5 pt-6 md:border-none md:pt-0">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="bg-accent-rose/5 border border-accent-rose/20 hover:bg-accent-rose/10 text-accent-rose uppercase p-3 opacity-0 group-hover:opacity-100 transition-all"
                                            onClick={() => handleDelete(setup.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="px-8 border-white/10 hover:bg-white/5 uppercase italic font-black text-[10px] tracking-widest py-4 gap-3 group/btn"
                                            onClick={() => navigate('/sensitivity-result', { state: { formData: setup.formData } })}
                                        >
                                            RESTORE_PARAMS <ArrowUpRight className="w-4 h-4 text-accent-cyan group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                        </Button>
                                    </div>
                                </div>
                                
                                {/* Background Decorative Element */}
                                <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-accent-cyan/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                        );
                    })
                ) : (
                    <div className="py-32 flex flex-col items-center justify-center text-center space-y-10 glass-panel border-white/5 bg-white/[0.01]">
                        <div className="relative">
                            <div className="absolute -inset-8 bg-accent-cyan/10 rounded-full blur-2xl animate-pulse" />
                            <Database className="w-20 h-20 text-gray-800 relative z-10" />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-2xl font-black text-white italic tracking-[0.2em] uppercase">ARCHIVE_EMPTY</h2>
                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest max-w-xs">Initialize a new neural calibration cycle to generate persistent tactical records.</p>
                        </div>
                        <Button
                            variant="primary"
                            className="px-12 py-6 uppercase italic font-black text-[10px] tracking-widest"
                            onClick={() => navigate('/generate-sensitivity')}
                        >
                            INITIATE_CALIBRATION
                        </Button>
                    </div>
                )}
            </div>

            {/* Archive Analytics */}
            {setups.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                    <Card className="p-10 border-white/5 bg-white/[0.01] flex items-center justify-between group overflow-hidden">
                        <div className="space-y-2 relative z-10">
                            <span className="text-[8px] font-black text-gray-600 uppercase tracking-[0.3em] block">TOTAL_ARCHIVED_DATA</span>
                            <p className="text-4xl font-black text-white italic tracking-tighter uppercase">{setups.length} <span className="text-gray-600 text-xs tracking-widest">ENTRIES</span></p>
                        </div>
                        <ShieldCheck className="w-16 h-16 text-accent-cyan opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all absolute top-1/2 right-0 -translate-y-1/2" />
                    </Card>
                    <Card className="p-10 border-white/5 bg-white/[0.01] flex items-center justify-between group overflow-hidden">
                        <div className="space-y-2 relative z-10">
                            <span className="text-[8px] font-black text-gray-600 uppercase tracking-[0.3em] block">AVG_OPT_SUCCESS_RATE</span>
                            <p className="text-4xl font-black text-accent-cyan italic tracking-tighter uppercase">98.4<span className="text-gray-600 text-xs tracking-widest">%</span></p>
                        </div>
                        <Zap className="w-16 h-16 text-axp-gold opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all absolute top-1/2 right-0 -translate-y-1/2" />
                    </Card>
                </div>
            )}
        </div>
    );
}
